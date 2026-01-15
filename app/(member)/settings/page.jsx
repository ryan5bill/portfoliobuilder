'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [profile, setProfile] = useState({
    name: 'Demo User',
    email: 'demo@example.com',
    phone: '+1 (555) 000-0000'
  });
  
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    weeklyRecap: true,
    marketNews: false
  });
  
  const [preferences, setPreferences] = useState({
    defaultPortfolio: 'HRGP',
    theme: 'dark',
    compactView: false
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    router.push('/login');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      if (confirm('This will permanently delete all your data. Type "DELETE" to confirm.')) {
        alert('Account deletion requested. In production, this would delete your account.');
        router.push('/');
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-pb-text-muted">Manage your account and preferences.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-pb-border pb-4">
        {[
          { id: 'profile', label: 'Profile', icon: '👤' },
          { id: 'notifications', label: 'Notifications', icon: '🔔' },
          { id: 'preferences', label: 'Preferences', icon: '⚙️' },
          { id: 'security', label: 'Security', icon: '🔐' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-pb-bg-elevated text-white'
                : 'text-pb-text-muted hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold">Profile Information</h3>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label className="block text-sm text-pb-text-muted mb-2">Display Name</label>
                <input
                  type="text"
                  className="input"
                  value={profile.name}
                  onChange={e => setProfile({...profile, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-pb-text-muted mb-2">Email Address</label>
                <input
                  type="email"
                  className="input"
                  value={profile.email}
                  onChange={e => setProfile({...profile, email: e.target.value})}
                />
                <p className="text-xs text-pb-text-dim mt-1">Used for login and notifications</p>
              </div>
              <div>
                <label className="block text-sm text-pb-text-muted mb-2">Phone Number</label>
                <input
                  type="tel"
                  className="input font-mono"
                  value={profile.phone}
                  onChange={e => setProfile({...profile, phone: e.target.value})}
                />
                <p className="text-xs text-pb-text-dim mt-1">Used for SMS alerts (optional)</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold">Email Notifications</h3>
            </div>
            <div className="card-body space-y-4">
              <label className="flex items-center justify-between p-3 bg-pb-bg rounded-lg cursor-pointer">
                <div>
                  <div className="font-medium">Trade Alerts</div>
                  <div className="text-sm text-pb-text-muted">Get notified when new trades are posted</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailAlerts}
                  onChange={e => setNotifications({...notifications, emailAlerts: e.target.checked})}
                  className="w-5 h-5 rounded accent-pb-green"
                />
              </label>
              <label className="flex items-center justify-between p-3 bg-pb-bg rounded-lg cursor-pointer">
                <div>
                  <div className="font-medium">Weekly Recap</div>
                  <div className="text-sm text-pb-text-muted">Summary of portfolio performance</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.weeklyRecap}
                  onChange={e => setNotifications({...notifications, weeklyRecap: e.target.checked})}
                  className="w-5 h-5 rounded accent-pb-green"
                />
              </label>
              <label className="flex items-center justify-between p-3 bg-pb-bg rounded-lg cursor-pointer">
                <div>
                  <div className="font-medium">Market News</div>
                  <div className="text-sm text-pb-text-muted">Important market updates and analysis</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.marketNews}
                  onChange={e => setNotifications({...notifications, marketNews: e.target.checked})}
                  className="w-5 h-5 rounded accent-pb-green"
                />
              </label>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold">SMS Notifications</h3>
            </div>
            <div className="card-body">
              <label className="flex items-center justify-between p-3 bg-pb-bg rounded-lg cursor-pointer">
                <div>
                  <div className="font-medium">SMS Trade Alerts</div>
                  <div className="text-sm text-pb-text-muted">Instant SMS when trades are posted</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.smsAlerts}
                  onChange={e => setNotifications({...notifications, smsAlerts: e.target.checked})}
                  className="w-5 h-5 rounded accent-pb-green"
                />
              </label>
              {!profile.phone && (
                <p className="text-sm text-yellow-400 mt-3">
                  ⚠️ Add a phone number in Profile to enable SMS alerts
                </p>
              )}
            </div>
          </div>

          <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Preferences'}
          </button>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold">Display Preferences</h3>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label className="block text-sm text-pb-text-muted mb-2">Default Portfolio</label>
                <select
                  className="input"
                  value={preferences.defaultPortfolio}
                  onChange={e => setPreferences({...preferences, defaultPortfolio: e.target.value})}
                >
                  <option value="HRGP">HRGP - High-Risk Growth</option>
                  <option value="SFGP">SFGP - Safe Growth</option>
                </select>
                <p className="text-xs text-pb-text-dim mt-1">Portfolio shown by default on dashboard</p>
              </div>
              <div>
                <label className="block text-sm text-pb-text-muted mb-2">Theme</label>
                <select
                  className="input"
                  value={preferences.theme}
                  onChange={e => setPreferences({...preferences, theme: e.target.value})}
                >
                  <option value="dark">Dark (Default)</option>
                  <option value="light" disabled>Light (Coming Soon)</option>
                </select>
              </div>
              <label className="flex items-center justify-between p-3 bg-pb-bg rounded-lg cursor-pointer">
                <div>
                  <div className="font-medium">Compact View</div>
                  <div className="text-sm text-pb-text-muted">Show more data in less space</div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.compactView}
                  onChange={e => setPreferences({...preferences, compactView: e.target.checked})}
                  className="w-5 h-5 rounded accent-pb-green"
                />
              </label>
            </div>
          </div>

          <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Preferences'}
          </button>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold">Session</h3>
            </div>
            <div className="card-body">
              <p className="text-sm text-pb-text-muted mb-4">
                You're currently logged in. You can log out of your account here.
              </p>
              <button onClick={handleLogout} className="btn btn-secondary">
                Log Out
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold">Export Your Data</h3>
            </div>
            <div className="card-body">
              <p className="text-sm text-pb-text-muted mb-4">
                Download a copy of your portfolio data and trade history.
              </p>
              <button className="btn btn-secondary">
                Export Data
              </button>
            </div>
          </div>

          <div className="card border-red-500/30">
            <div className="card-header">
              <h3 className="font-semibold text-red-400">Danger Zone</h3>
            </div>
            <div className="card-body">
              <p className="text-sm text-pb-text-muted mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <button onClick={handleDeleteAccount} className="btn btn-danger">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
