-- Portfolio Builder Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'expired')),
  following TEXT DEFAULT 'HRGP' CHECK (following IN ('HRGP', 'SFGP', 'BOTH')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- ============================================
-- MODEL PORTFOLIOS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS portfolios (
  id TEXT PRIMARY KEY, -- 'HRGP' or 'SFGP'
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#00d4aa',
  start_date DATE,
  starting_balance DECIMAL(12, 2),
  -- Store positions and returns as JSONB for flexibility
  positions JSONB DEFAULT '[]'::jsonb,
  monthly_returns JSONB DEFAULT '{}'::jsonb,
  deposits JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRADE ALERTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS trade_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id TEXT REFERENCES portfolios(id) ON DELETE SET NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  ticker TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('BUY', 'SELL', 'HOLD', 'REBALANCE')),
  shares DECIMAL(12, 4),
  price DECIMAL(12, 4),
  details TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster alert queries
CREATE INDEX IF NOT EXISTS idx_trade_alerts_date ON trade_alerts(date DESC);
CREATE INDEX IF NOT EXISTS idx_trade_alerts_portfolio ON trade_alerts(portfolio_id);

-- ============================================
-- USER PORTFOLIOS TABLE (User's own tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS user_portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT DEFAULT 'My Portfolio',
  following TEXT REFERENCES portfolios(id), -- Which model they follow
  is_paper BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user lookups
CREATE INDEX IF NOT EXISTS idx_user_portfolios_user ON user_portfolios(user_id);

-- ============================================
-- USER TRADES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_portfolio_id UUID REFERENCES user_portfolios(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  ticker TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('BUY', 'SELL')),
  shares DECIMAL(12, 4) NOT NULL,
  price DECIMAL(12, 4) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for trade queries
CREATE INDEX IF NOT EXISTS idx_user_trades_portfolio ON user_trades(user_portfolio_id);
CREATE INDEX IF NOT EXISTS idx_user_trades_date ON user_trades(date DESC);

-- ============================================
-- BROADCASTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS broadcasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'both')),
  subject TEXT,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'failed')),
  recipient_count INTEGER DEFAULT 0,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;

-- Portfolios: Public read, admin write
CREATE POLICY "Portfolios are viewable by everyone" 
  ON portfolios FOR SELECT USING (true);

CREATE POLICY "Portfolios are editable by admins" 
  ON portfolios FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
  );

-- Trade Alerts: Public read for published, admin write
CREATE POLICY "Published alerts are viewable by everyone" 
  ON trade_alerts FOR SELECT USING (is_published = true);

CREATE POLICY "Alerts are editable by admins" 
  ON trade_alerts FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
  );

-- User Portfolios: Users can only see their own
CREATE POLICY "Users can view own portfolios" 
  ON user_portfolios FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own portfolios" 
  ON user_portfolios FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolios" 
  ON user_portfolios FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own portfolios" 
  ON user_portfolios FOR DELETE USING (auth.uid() = user_id);

-- User Trades: Users can only see their own
CREATE POLICY "Users can manage own trades" 
  ON user_trades FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_portfolios 
      WHERE user_portfolios.id = user_trades.user_portfolio_id 
      AND user_portfolios.user_id = auth.uid()
    )
  );

-- Broadcasts: Admin only
CREATE POLICY "Broadcasts are admin only" 
  ON broadcasts FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
  );

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert model portfolios (empty, to be populated from JSON)
INSERT INTO portfolios (id, name, description, color, start_date, starting_balance) VALUES
  ('HRGP', 'HIGH-RISK GROWTH', 'Concentrated AI/Crypto positions for maximum growth', '#00d4aa', '2020-12-01', 1000),
  ('SFGP', 'SAFE GROWTH', 'Diversified leveraged ETFs for steady growth', '#ff6b00', '2018-12-01', 40035)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_portfolios_updated_at
  BEFORE UPDATE ON portfolios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_trade_alerts_updated_at
  BEFORE UPDATE ON trade_alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_portfolios_updated_at
  BEFORE UPDATE ON user_portfolios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- DONE!
-- ============================================
-- After running this schema:
-- 1. Go to Authentication > Settings in Supabase
-- 2. Enable Email OTP and/or Phone OTP
-- 3. Update your .env.local with Supabase credentials
