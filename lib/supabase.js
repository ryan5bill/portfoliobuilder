import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Using local data only.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Server-side client with service key (for admin operations)
export function getServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.warn('Supabase service key not configured.');
    return null;
  }
  return createClient(supabaseUrl, serviceKey);
}

// ============================================
// PORTFOLIO FUNCTIONS
// ============================================

export async function getPortfolios() {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  
  const { data, error } = await supabase
    .from('portfolios')
    .select('*');
  
  return { data, error };
}

export async function getPortfolio(id) {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('id', id)
    .single();
  
  return { data, error };
}

export async function updatePortfolio(id, updates) {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  
  const { data, error } = await supabase
    .from('portfolios')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  return { data, error };
}

// ============================================
// TRADE ALERTS FUNCTIONS
// ============================================

export async function getTradeAlerts(options = {}) {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  
  let query = supabase
    .from('trade_alerts')
    .select('*')
    .eq('is_published', true)
    .order('date', { ascending: false });
  
  if (options.limit) {
    query = query.limit(options.limit);
  }
  
  if (options.portfolioId) {
    query = query.eq('portfolio_id', options.portfolioId);
  }
  
  const { data, error } = await query;
  return { data, error };
}

export async function createTradeAlert(alert) {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  
  const { data, error } = await supabase
    .from('trade_alerts')
    .insert(alert)
    .select()
    .single();
  
  return { data, error };
}

export async function updateTradeAlert(id, updates) {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  
  const { data, error } = await supabase
    .from('trade_alerts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  return { data, error };
}

export async function deleteTradeAlert(id) {
  if (!supabase) return { error: 'Supabase not configured' };
  
  const { error } = await supabase
    .from('trade_alerts')
    .delete()
    .eq('id', id);
  
  return { error };
}

// ============================================
// USER FUNCTIONS
// ============================================

export async function getUsers() {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
  
  return { data, error };
}

export async function getUserByEmail(email) {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  return { data, error };
}

export async function updateUser(id, updates) {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  return { data, error };
}

// ============================================
// USER PORTFOLIO FUNCTIONS
// ============================================

export async function getUserPortfolio(userId) {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  
  const { data, error } = await supabase
    .from('user_portfolios')
    .select('*, user_trades(*)')
    .eq('user_id', userId)
    .single();
  
  return { data, error };
}

export async function createUserPortfolio(portfolio) {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  
  const { data, error } = await supabase
    .from('user_portfolios')
    .insert(portfolio)
    .select()
    .single();
  
  return { data, error };
}

export async function addUserTrade(trade) {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  
  const { data, error } = await supabase
    .from('user_trades')
    .insert(trade)
    .select()
    .single();
  
  return { data, error };
}

export async function deleteUserTrade(id) {
  if (!supabase) return { error: 'Supabase not configured' };
  
  const { error } = await supabase
    .from('user_trades')
    .delete()
    .eq('id', id);
  
  return { error };
}

// ============================================
// BROADCAST FUNCTIONS
// ============================================

export async function getBroadcasts() {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  
  const { data, error } = await supabase
    .from('broadcasts')
    .select('*')
    .order('created_at', { ascending: false });
  
  return { data, error };
}

export async function createBroadcast(broadcast) {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  
  const { data, error } = await supabase
    .from('broadcasts')
    .insert(broadcast)
    .select()
    .single();
  
  return { data, error };
}

// ============================================
// AUTH HELPERS
// ============================================

export async function signInWithOtp(email) {
  if (!supabase) return { error: 'Supabase not configured' };
  
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  
  return { error };
}

export async function signOut() {
  if (!supabase) return { error: 'Supabase not configured' };
  
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  
  const { data, error } = await supabase.auth.getSession();
  return { data: data?.session, error };
}

export async function getUser() {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  
  const { data, error } = await supabase.auth.getUser();
  return { data: data?.user, error };
}
