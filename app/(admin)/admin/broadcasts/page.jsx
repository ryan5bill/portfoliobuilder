'use client';

import { useState } from 'react';

export default function BroadcastsPage() {
  const [broadcasts, setBroadcasts] = useState([
    { id: 1, date: '2025-01-10', type: 'email', subject: 'MSTR Position Update', status: 'sent', recipients: 156 },
    { id: 2, date: '2025-01-05', type: 'both', subject: 'Weekly Portfolio Recap', status: 'sent', recipients: 203 },
    { id: 3, date: '2024-12-20', type: 'sms', subject: 'Year-End Rebalance Alert', status: 'sent', recipients: 89 },
  ]);
  
  const [showComposer, setShowComposer] = useState(false);
  const [form, setForm] = useState({
    type: 'email',
    subject: '',
    content: '',
    sendNow: true
  });
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!form.subject || !form.content) return;
    
    setSending(true);
    
    // Simulate sending
    await new Promise(r => setTimeout(r, 1500));
    
    const newBroadcast = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      type: form.type,
      subject: form.subject,
      status: 'sent',
      recipients: Math.floor(Math.random() * 100) + 100
    };
    
    setBroadcasts([newBroadcast, ...broadcasts]);
    setForm({ type: 'email', subject: '', content: '', sendNow: true });
    setShowComposer(false);
    setSending(false);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'email': return '📧';
      case 'sms': return '📱';
      case 'both': return '📢';
      default: return '📧';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'email': return 'Email';
      case 'sms': return 'SMS';
      case 'both': return 'Email + SMS';
      default: return type;
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Broadcasts</h1>
          <p className="text-pb-text-muted">Send emails and SMS to your subscribers</p>
        </div>
        <button onClick={() => setShowComposer(true)} className="btn btn-primary">
          + New Broadcast
        </button>
      </div>

      {/* Integration Status */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="card">
          <div className="card-body flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-lg">📧</div>
            <div className="flex-1">
              <div className="font-semibold">Beehiiv Email</div>
              <div className="text-sm text-pb-text-muted">Email marketing integration</div>
            </div>
            <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400">Not Connected</span>
          </div>
        </div>
        <div className="card">
          <div className="card-body flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-lg">📱</div>
            <div className="flex-1">
              <div className="font-semibold">Twilio SMS</div>
              <div className="text-sm text-pb-text-muted">SMS alerts integration</div>
            </div>
            <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400">Not Connected</span>
          </div>
        </div>
      </div>

      {/* Composer */}
      {showComposer && (
        <div className="card mb-8">
          <div className="card-header flex items-center justify-between">
            <h3 className="font-semibold">Compose Broadcast</h3>
            <button onClick={() => setShowComposer(false)} className="text-pb-text-muted hover:text-white">×</button>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-pb-text-dim mb-1">Channel</label>
                <select
                  className="input"
                  value={form.type}
                  onChange={e => setForm({...form, type: e.target.value})}
                >
                  <option value="email">Email Only</option>
                  <option value="sms">SMS Only</option>
                  <option value="both">Email + SMS</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-pb-text-dim mb-1">Subject / Title</label>
                <input
                  className="input"
                  placeholder="Important Trade Alert..."
                  value={form.subject}
                  onChange={e => setForm({...form, subject: e.target.value})}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs text-pb-text-dim mb-1">Message Content</label>
              <textarea
                className="input min-h-[150px] resize-y"
                placeholder="Write your message here..."
                value={form.content}
                onChange={e => setForm({...form, content: e.target.value})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-pb-text-muted">
                {form.type === 'email' && '📧 Will send to all email subscribers'}
                {form.type === 'sms' && '📱 Will send to all SMS subscribers'}
                {form.type === 'both' && '📢 Will send to all subscribers via email and SMS'}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowComposer(false)} className="btn btn-secondary">Cancel</button>
                <button 
                  onClick={handleSend} 
                  className="btn btn-primary"
                  disabled={sending || !form.subject || !form.content}
                >
                  {sending ? 'Sending...' : 'Send Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast History */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h3 className="font-semibold">Broadcast History</h3>
          <span className="text-sm text-pb-text-dim">{broadcasts.length} broadcasts</span>
        </div>
        <div className="card-body p-0">
          {broadcasts.length === 0 ? (
            <div className="p-8 text-center text-pb-text-muted">No broadcasts sent yet</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Channel</th>
                  <th>Subject</th>
                  <th className="text-center">Status</th>
                  <th className="text-right">Recipients</th>
                </tr>
              </thead>
              <tbody>
                {broadcasts.map((broadcast) => (
                  <tr key={broadcast.id}>
                    <td className="font-mono text-pb-text-muted">{broadcast.date}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span>{getTypeIcon(broadcast.type)}</span>
                        <span className="text-sm">{getTypeLabel(broadcast.type)}</span>
                      </div>
                    </td>
                    <td className="font-medium">{broadcast.subject}</td>
                    <td className="text-center">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        broadcast.status === 'sent' 
                          ? 'bg-pb-green/20 text-pb-green' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {broadcast.status}
                      </span>
                    </td>
                    <td className="font-mono text-right">{broadcast.recipients}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="mt-8 p-4 bg-pb-bg-elevated rounded-lg border border-pb-border">
        <h4 className="font-semibold mb-2">📋 Setup Instructions</h4>
        <div className="text-sm text-pb-text-muted space-y-2">
          <p><strong>Beehiiv:</strong> Add your BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID to .env.local</p>
          <p><strong>Twilio:</strong> Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER to .env.local</p>
          <p>Once configured, broadcasts will be sent through those services automatically.</p>
        </div>
      </div>
    </div>
  );
}
