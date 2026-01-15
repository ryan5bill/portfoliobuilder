# PORTFOLIO BUILDER - MASTER BUILD PLAN
## pbtracker.app

**Created:** January 15, 2026  
**Two Workstreams:** Website (Ryan) + Data Template (Jason)

---

# 🎯 PROJECT OVERVIEW

## What We're Building

**pbtracker.app** - A platform where:
1. Jason showcases his model portfolios (HRGP + SFGP) with full track records
2. Members can follow along, calculate positions, and track their own trades
3. Trade alerts go out via email (Beehiiv) and SMS (Twilio)
4. Jason updates everything through a simple admin panel

## Two Separate Workstreams

| Workstream | Owner | Purpose |
|------------|-------|---------|
| **Website Build** | Ryan | Platform, admin, user features, API |
| **Portfolio Template** | Jason | Track record data, returns, positions |

The website uses **placeholder/sample data** until Jason's real track record is imported later.

---

# 📦 WORKSTREAM 1: WEBSITE BUILD (Ryan)

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (email/phone OTP)
- **Hosting:** Vercel
- **Email:** Beehiiv API
- **SMS:** Twilio API
- **AI:** Claude API (admin assistant)

---

## PHASE 1: PROJECT FOUNDATION
**Goal:** Deployable Next.js app with basic structure

### Task 1.1: Project Setup
- [ ] Initialize Next.js 14 project
- [ ] Configure Tailwind CSS
- [ ] Setup folder structure (app/, components/, lib/)
- [ ] Create .env.example with all variables
- [ ] Setup .gitignore
- [ ] Create package.json with dependencies

### Task 1.2: Design System
- [ ] Create lib/theme.js with colors, fonts
- [ ] Bloomberg-terminal dark theme (#0a0a0a background)
- [ ] Color palette: Primary (#00d4aa), Secondary (#ff6b00)
- [ ] Typography: IBM Plex Sans + JetBrains Mono
- [ ] Create globals.css with base styles

### Task 1.3: Layout Components
- [ ] Create components/Header.jsx (logo, nav, user menu)
- [ ] Create components/Footer.jsx
- [ ] Create app/layout.jsx (root layout)
- [ ] Mobile responsive navigation

### Task 1.4: Sample Data File
- [ ] Create lib/sampleData.js with placeholder portfolios
- [ ] HRGP: 5 sample positions, sample returns
- [ ] SFGP: 5 sample positions, sample returns
- [ ] Sample trade alerts (10-20 entries)
- [ ] NOTE: This gets replaced with real data later

**Deliverable:** Deployable skeleton app

---

## PHASE 2: PUBLIC PAGES
**Goal:** What visitors see before signing up

### Task 2.1: Landing Page (app/page.jsx)
- [ ] Hero section with value proposition
- [ ] Track record teaser (blurred/limited view)
- [ ] Feature highlights (3-4 cards)
- [ ] "How it works" section
- [ ] CTA buttons (Sign Up / Login)
- [ ] Mobile responsive

### Task 2.2: Portfolio Preview Page (app/portfolio/[id]/page.jsx)
- [ ] Portfolio summary card (name, total return, since date)
- [ ] Monthly returns heatmap (public view)
- [ ] Current positions table (maybe blurred for non-members)
- [ ] Performance stats overview
- [ ] CTA: "Sign up to see full details"

### Task 2.3: About/Contact Pages
- [ ] Simple about page
- [ ] Contact form (optional)

**Deliverable:** Marketing-ready public site

---

## PHASE 3: CORE COMPONENTS
**Goal:** Reusable React components for portfolio display

### Task 3.1: PortfolioSummary.jsx
- [ ] Portfolio name, ticker, description
- [ ] Total return (large, colored)
- [ ] Current value, starting balance
- [ ] Start date, deposits (if any)
- [ ] Color-coded by portfolio (HRGP=green, SFGP=orange)

### Task 3.2: MonthlyReturns.jsx
- [ ] Heatmap table (years × months)
- [ ] Color-coded cells by return magnitude
- [ ] YTD column with calculation
- [ ] Hover tooltips
- [ ] Responsive (horizontal scroll on mobile)

### Task 3.3: PositionsTable.jsx
- [ ] Current holdings list
- [ ] Columns: Ticker, Name, Shares, Entry, Current, Value, P&L, Type, Ratio
- [ ] Sort by value or P&L
- [ ] Offense/Defense grouping option

### Task 3.4: Calculator.jsx
- [ ] Dollar input field
- [ ] Unit cost display
- [ ] Calculated shares per position
- [ ] Total allocation breakdown
- [ ] Copy to clipboard button

### Task 3.5: TradeHistory.jsx
- [ ] Scrollable trade list
- [ ] Columns: Date, Ticker, Action, Shares, Price, Total
- [ ] Filter by date range
- [ ] Search by ticker
- [ ] Export CSV button

### Task 3.6: AlertsFeed.jsx
- [ ] Chronological alert cards
- [ ] BUY/SELL/REBALANCE badges
- [ ] Portfolio tag (HRGP/SFGP/BOTH)
- [ ] Timestamp formatting
- [ ] "New" indicator for recent alerts

### Task 3.7: EquityCurve.jsx
- [ ] Line chart of portfolio growth
- [ ] Optional: SPY benchmark overlay
- [ ] Time range filters (YTD, 1Y, 3Y, ALL)
- [ ] Tooltips with values
- [ ] Use Recharts or similar

### Task 3.8: PerformanceStats.jsx
- [ ] Total Return vs SPY
- [ ] Win Rate (% positive months)
- [ ] Best Month / Worst Month
- [ ] Average gain / Average loss
- [ ] Current streak

**Deliverable:** Complete component library

---

## PHASE 4: DATABASE SCHEMA
**Goal:** Supabase tables for all data

### Task 4.1: Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  phone TEXT,
  name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active', -- active, suspended, expired
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);
```

### Task 4.2: Portfolios Table (Model Portfolios)
```sql
CREATE TABLE portfolios (
  id TEXT PRIMARY KEY, -- 'HRGP', 'SFGP'
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  start_date DATE,
  starting_balance DECIMAL,
  current_data JSONB, -- positions, returns (updated by admin)
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Task 4.3: Trade Alerts Table
```sql
CREATE TABLE trade_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id TEXT REFERENCES portfolios(id),
  date DATE NOT NULL,
  ticker TEXT NOT NULL,
  action TEXT NOT NULL, -- BUY, SELL, HOLD, REBALANCE
  shares DECIMAL,
  price DECIMAL,
  notes TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Task 4.4: User Portfolios Table
```sql
CREATE TABLE user_portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT DEFAULT 'My Portfolio',
  following TEXT REFERENCES portfolios(id), -- which model they follow
  is_paper BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Task 4.5: User Trades Table
```sql
CREATE TABLE user_trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID REFERENCES user_portfolios(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  ticker TEXT NOT NULL,
  action TEXT NOT NULL,
  shares DECIMAL NOT NULL,
  price DECIMAL NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Task 4.6: Broadcasts Table
```sql
CREATE TABLE broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- 'email', 'sms', 'both'
  subject TEXT,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'draft', -- draft, sent, failed
  sent_at TIMESTAMPTZ,
  sent_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Task 4.7: Row Level Security
- [ ] Users can only see their own data
- [ ] Admin can see all users
- [ ] Public can see published portfolios
- [ ] Trade alerts visible to authenticated users only

**Deliverable:** Complete database schema SQL file

---

## PHASE 5: AUTHENTICATION
**Goal:** Passwordless login with email/phone

### Task 5.1: Auth Configuration
- [ ] Setup Supabase Auth
- [ ] Enable email OTP (magic link or code)
- [ ] Enable phone OTP (requires Twilio)
- [ ] Configure redirect URLs

### Task 5.2: Auth Pages
- [ ] app/(auth)/login/page.jsx - Email/phone input
- [ ] app/(auth)/verify/page.jsx - OTP code entry
- [ ] app/(auth)/signup/page.jsx - New user registration

### Task 5.3: Auth API Routes
- [ ] app/api/auth/send-code/route.js
- [ ] app/api/auth/verify/route.js
- [ ] app/api/auth/logout/route.js

### Task 5.4: Auth Middleware
- [ ] middleware.js - Protect member routes
- [ ] Redirect unauthenticated users to login
- [ ] Redirect authenticated users away from login

### Task 5.5: Auth Context
- [ ] lib/auth-context.jsx - AuthProvider
- [ ] useAuth() hook for components
- [ ] Session persistence

**Deliverable:** Working auth flow

---

## PHASE 6: MEMBER PAGES
**Goal:** Authenticated user dashboard

### Task 6.1: Member Layout
- [ ] app/(member)/layout.jsx
- [ ] Sidebar navigation
- [ ] User profile dropdown
- [ ] Auth check wrapper

### Task 6.2: Dashboard (app/(member)/dashboard/page.jsx)
- [ ] Portfolio selector (HRGP / SFGP)
- [ ] Full track record view
- [ ] Recent trade alerts
- [ ] Quick calculator access

### Task 6.3: Calculator Page (app/(member)/calculator/page.jsx)
- [ ] Full calculator component
- [ ] Save calculations to account
- [ ] Share/export allocations

### Task 6.4: My Portfolio (app/(member)/my-portfolio/page.jsx)
- [ ] User's personal trade log
- [ ] Add trade form
- [ ] Import trades (CSV)
- [ ] Calculate returns from trades
- [ ] Compare vs model portfolio

### Task 6.5: Alerts Page (app/(member)/alerts/page.jsx)
- [ ] Full alerts history
- [ ] Filter by portfolio
- [ ] Filter by date
- [ ] Search by ticker

### Task 6.6: Settings Page (app/(member)/settings/page.jsx)
- [ ] Update email/phone
- [ ] Notification preferences
- [ ] Delete account option

**Deliverable:** Complete member experience

---

## PHASE 7: ADMIN PANEL
**Goal:** Jason's control center

### Task 7.1: Admin Layout
- [ ] app/(admin)/layout.jsx
- [ ] Admin auth check (ADMIN_PASSWORD or is_admin flag)
- [ ] Admin sidebar navigation

### Task 7.2: Admin Dashboard (app/(admin)/admin/page.jsx)
- [ ] Quick stats (users, last update, etc.)
- [ ] Recent activity log
- [ ] Quick action buttons

### Task 7.3: Portfolio Editor (app/(admin)/admin/portfolios/page.jsx)
- [ ] Select portfolio (HRGP / SFGP)
- [ ] Edit current positions
- [ ] Add/remove positions
- [ ] Edit monthly returns
- [ ] Preview changes
- [ ] Publish changes

### Task 7.4: Trade Alerts Manager (app/(admin)/admin/alerts/page.jsx)
- [ ] Create new alert form
- [ ] Edit existing alerts
- [ ] Delete alerts
- [ ] Publish/unpublish toggle
- [ ] Alert templates

### Task 7.5: User Manager (app/(admin)/admin/users/page.jsx)
- [ ] User list table with search
- [ ] View user details
- [ ] Activate/deactivate users
- [ ] Set expiration dates
- [ ] Import users (CSV)
- [ ] Export users (CSV)

### Task 7.6: Broadcasts (app/(admin)/admin/broadcasts/page.jsx)
- [ ] Compose message
- [ ] Select channel (email/SMS/both)
- [ ] Preview before send
- [ ] Send to all or segment
- [ ] View send history

### Task 7.7: Claude Assistant (app/(admin)/admin/claude/page.jsx)
- [ ] Chat interface
- [ ] Context about the system
- [ ] Help with portfolio updates
- [ ] Generate broadcast content

**Deliverable:** Complete admin panel

---

## PHASE 8: API ROUTES
**Goal:** Backend endpoints

### Task 8.1: Portfolio APIs
- [ ] GET /api/portfolios - List portfolios
- [ ] GET /api/portfolios/[id] - Get portfolio details
- [ ] PATCH /api/portfolios/[id] - Update portfolio (admin)

### Task 8.2: Alert APIs
- [ ] GET /api/alerts - List alerts (with filters)
- [ ] POST /api/alerts - Create alert (admin)
- [ ] PATCH /api/alerts/[id] - Update alert (admin)
- [ ] DELETE /api/alerts/[id] - Delete alert (admin)

### Task 8.3: User Portfolio APIs
- [ ] GET /api/user/portfolio - Get user's portfolio
- [ ] POST /api/user/portfolio - Create portfolio
- [ ] GET /api/user/trades - Get user's trades
- [ ] POST /api/user/trades - Add trade
- [ ] POST /api/user/trades/import - Bulk import

### Task 8.4: Admin APIs
- [ ] GET /api/admin/users - List users
- [ ] PATCH /api/admin/users/[id] - Update user
- [ ] POST /api/admin/users/import - Import users
- [ ] GET /api/admin/stats - Dashboard stats

### Task 8.5: Broadcast APIs
- [ ] POST /api/broadcasts/send - Send broadcast
- [ ] GET /api/broadcasts - List broadcasts
- [ ] Integration with Beehiiv
- [ ] Integration with Twilio

### Task 8.6: Claude API
- [ ] POST /api/admin/claude - Proxy to Claude API
- [ ] System prompt with project context

**Deliverable:** Complete API layer

---

## PHASE 9: INTEGRATIONS
**Goal:** External service connections

### Task 9.1: Beehiiv (Email)
- [ ] lib/beehiiv.js client
- [ ] Send broadcast function
- [ ] Subscriber sync (optional)

### Task 9.2: Twilio (SMS)
- [ ] lib/twilio.js client
- [ ] Send SMS function
- [ ] Phone number formatting

### Task 9.3: Price Updates (Optional)
- [ ] Yahoo Finance or similar API
- [ ] Auto-update current prices
- [ ] Scheduled job (Vercel cron)

**Deliverable:** Working integrations

---

## PHASE 10: POLISH & LAUNCH
**Goal:** Production-ready

### Task 10.1: Error Handling
- [ ] Error boundaries
- [ ] Loading states
- [ ] Empty states
- [ ] Toast notifications

### Task 10.2: Performance
- [ ] Image optimization
- [ ] Code splitting
- [ ] Caching strategy

### Task 10.3: SEO & Meta
- [ ] Page titles
- [ ] Meta descriptions
- [ ] OG images

### Task 10.4: Testing
- [ ] Test all user flows
- [ ] Test admin flows
- [ ] Mobile testing
- [ ] Cross-browser testing

### Task 10.5: Documentation
- [ ] README.md
- [ ] DEPLOYMENT.md
- [ ] ADMIN-GUIDE.md

**Deliverable:** Launch-ready platform

---

# 📊 WORKSTREAM 2: PORTFOLIO TEMPLATE (Jason)

## Separate Tool
The portfolio template is a **standalone HTML file** that Jason uses to:
1. View/edit track record data
2. Input trades manually or via CSV import
3. Add monthly returns
4. Export clean JSON for the website

## Data Structure
```javascript
{
  portfolios: {
    "HRGP": {
      name, startDate, startingBalance, deposits,
      positions: [...],
      monthlyReturns: { "2020": { "Jan": 5.2, ... }, ... },
      trades: [...]
    },
    "SFGP": { ... }
  }
}
```

## Workflow
1. Jason opens portfolio-template.html locally
2. Inputs/imports trade data
3. Adds monthly returns
4. Exports JSON
5. Ryan imports JSON into website database

---

# 📅 EXECUTION ORDER

```
WEEK 1: Foundation
├── Phase 1: Project Setup ✓
├── Phase 2: Public Pages
└── Phase 3: Core Components (partial)

WEEK 2: Components + Database
├── Phase 3: Core Components (complete)
├── Phase 4: Database Schema
└── Phase 5: Authentication

WEEK 3: Member Features
├── Phase 6: Member Pages
└── Phase 8: API Routes (partial)

WEEK 4: Admin + Polish
├── Phase 7: Admin Panel
├── Phase 8: API Routes (complete)
└── Phase 9: Integrations

WEEK 5+: Launch
├── Phase 10: Polish & Launch
└── Import real track record data
```

---

# 📁 FILE STRUCTURE (Target)

```
pbtracker/
├── app/
│   ├── layout.jsx
│   ├── page.jsx                    # Landing
│   ├── globals.css
│   ├── (auth)/
│   │   ├── login/page.jsx
│   │   ├── signup/page.jsx
│   │   └── verify/page.jsx
│   ├── (member)/
│   │   ├── layout.jsx
│   │   ├── dashboard/page.jsx
│   │   ├── calculator/page.jsx
│   │   ├── my-portfolio/page.jsx
│   │   ├── alerts/page.jsx
│   │   └── settings/page.jsx
│   ├── (admin)/
│   │   ├── layout.jsx
│   │   └── admin/
│   │       ├── page.jsx
│   │       ├── portfolios/page.jsx
│   │       ├── alerts/page.jsx
│   │       ├── users/page.jsx
│   │       ├── broadcasts/page.jsx
│   │       └── claude/page.jsx
│   ├── portfolio/
│   │   └── [id]/page.jsx           # Public portfolio view
│   └── api/
│       ├── portfolios/
│       ├── alerts/
│       ├── user/
│       ├── admin/
│       └── broadcasts/
├── components/
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── PortfolioSummary.jsx
│   ├── MonthlyReturns.jsx
│   ├── PositionsTable.jsx
│   ├── Calculator.jsx
│   ├── TradeHistory.jsx
│   ├── AlertsFeed.jsx
│   ├── EquityCurve.jsx
│   └── PerformanceStats.jsx
├── lib/
│   ├── theme.js
│   ├── sampleData.js               # Placeholder until real data
│   ├── supabase.js
│   ├── auth.js
│   ├── beehiiv.js
│   └── twilio.js
├── public/
│   └── favicon.svg
├── package.json
├── next.config.js
├── tailwind.config.js
├── middleware.js
└── .env.example
```

---

# ✅ READY TO BUILD

Say **"GO"** and I'll start with **Phase 1, Task 1.1: Project Setup**

I'll build each piece and give you files to review as we go.

