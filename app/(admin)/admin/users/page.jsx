'use client';

import { useState } from 'react';

// Sample user data
const SAMPLE_USERS = [
  { id: 1, email: 'john@example.com', phone: '+1234567890', name: 'John Smith', status: 'active', following: 'HRGP', joined: '2024-01-15', lastActive: '2025-01-10' },
  { id: 2, email: 'jane@example.com', phone: '+1987654321', name: 'Jane Doe', status: 'active', following: 'SFGP', joined: '2024-03-20', lastActive: '2025-01-09' },
  { id: 3, email: 'bob@example.com', phone: null, name: 'Bob Wilson', status: 'active', following: 'BOTH', joined: '2024-06-10', lastActive: '2025-01-08' },
  { id: 4, email: 'alice@example.com', phone: '+1555555555', name: 'Alice Brown', status: 'expired', following: 'HRGP', joined: '2023-12-01', lastActive: '2024-11-15' },
  { id: 5, email: 'charlie@example.com', phone: '+1666666666', name: 'Charlie Davis', status: 'suspended', following: 'SFGP', joined: '2024-02-28', lastActive: '2024-10-01' },
];

export default function UsersPage() {
  const [users, setUsers] = useState(SAMPLE_USERS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAddUser, setShowAddUser] = useState(false);
  const [form, setForm] = useState({ email: '', phone: '', name: '', following: 'HRGP' });

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || user.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleAddUser = () => {
    if (!form.email) return;
    
    const newUser = {
      id: Date.now(),
      email: form.email,
      phone: form.phone || null,
      name: form.name,
      status: 'active',
      following: form.following,
      joined: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0]
    };
    
    setUsers([newUser, ...users]);
    setForm({ email: '', phone: '', name: '', following: 'HRGP' });
    setShowAddUser(false);
  };

  const handleStatusChange = (userId, newStatus) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, status: newStatus } : u
    ));
  };

  const handleDelete = (userId) => {
    if (confirm('Delete this user?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleExport = () => {
    const csv = [
      ['Email', 'Phone', 'Name', 'Status', 'Following', 'Joined', 'Last Active'].join(','),
      ...users.map(u => [u.email, u.phone || '', u.name, u.status, u.following, u.joined, u.lastActive].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    expired: users.filter(u => u.status === 'expired').length,
    suspended: users.filter(u => u.status === 'suspended').length
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-0.5 rounded text-xs bg-pb-green/20 text-pb-green">Active</span>;
      case 'expired':
        return <span className="px-2 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-400">Expired</span>;
      case 'suspended':
        return <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400">Suspended</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs bg-gray-500/20 text-gray-400">{status}</span>;
    }
  };

  const getFollowingBadge = (following) => {
    if (following === 'HRGP') return <span className="px-2 py-0.5 rounded text-xs bg-pb-green/20 text-pb-green font-mono">HRGP</span>;
    if (following === 'SFGP') return <span className="px-2 py-0.5 rounded text-xs bg-pb-orange/20 text-pb-orange font-mono">SFGP</span>;
    return <span className="px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-400 font-mono">BOTH</span>;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Users</h1>
          <p className="text-pb-text-muted">Manage subscribers and members</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="btn btn-secondary">Export CSV</button>
          <button onClick={() => setShowAddUser(true)} className="btn btn-primary">+ Add User</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="card-body">
            <div className="text-sm text-pb-text-dim">Total Users</div>
            <div className="text-2xl font-bold font-mono">{stats.total}</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="text-sm text-pb-text-dim">Active</div>
            <div className="text-2xl font-bold font-mono text-pb-green">{stats.active}</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="text-sm text-pb-text-dim">Expired</div>
            <div className="text-2xl font-bold font-mono text-yellow-400">{stats.expired}</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="text-sm text-pb-text-dim">Suspended</div>
            <div className="text-2xl font-bold font-mono text-red-400">{stats.suspended}</div>
          </div>
        </div>
      </div>

      {/* Add User Form */}
      {showAddUser && (
        <div className="card mb-6">
          <div className="card-header flex items-center justify-between">
            <h3 className="font-semibold">Add User</h3>
            <button onClick={() => setShowAddUser(false)} className="text-pb-text-muted hover:text-white">×</button>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs text-pb-text-dim mb-1">Email *</label>
                <input
                  type="email"
                  className="input"
                  placeholder="user@example.com"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs text-pb-text-dim mb-1">Phone</label>
                <input
                  type="tel"
                  className="input font-mono"
                  placeholder="+1234567890"
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs text-pb-text-dim mb-1">Name</label>
                <input
                  className="input"
                  placeholder="John Smith"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs text-pb-text-dim mb-1">Following</label>
                <select
                  className="input"
                  value={form.following}
                  onChange={e => setForm({...form, following: e.target.value})}
                >
                  <option value="HRGP">HRGP</option>
                  <option value="SFGP">SFGP</option>
                  <option value="BOTH">BOTH</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleAddUser} className="btn btn-primary">Add User</button>
              <button onClick={() => setShowAddUser(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input
            className="input"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input w-40"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h3 className="font-semibold">All Users</h3>
          <span className="text-sm text-pb-text-dim">{filteredUsers.length} users</span>
        </div>
        <div className="card-body p-0">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-pb-text-muted">No users found</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Following</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Last Active</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="font-medium">{user.name || '—'}</td>
                    <td className="text-pb-text-muted">{user.email}</td>
                    <td className="font-mono text-sm text-pb-text-muted">{user.phone || '—'}</td>
                    <td>{getFollowingBadge(user.following)}</td>
                    <td>{getStatusBadge(user.status)}</td>
                    <td className="font-mono text-sm text-pb-text-muted">{user.joined}</td>
                    <td className="font-mono text-sm text-pb-text-muted">{user.lastActive}</td>
                    <td>
                      <div className="flex gap-1">
                        <select
                          className="input text-xs py-1 px-2 w-24"
                          value={user.status}
                          onChange={e => handleStatusChange(user.id, e.target.value)}
                        >
                          <option value="active">Active</option>
                          <option value="expired">Expired</option>
                          <option value="suspended">Suspended</option>
                        </select>
                        <button 
                          onClick={() => handleDelete(user.id)} 
                          className="btn btn-danger text-xs px-2 py-1"
                        >
                          ×
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-8 p-4 bg-pb-bg-elevated rounded-lg border border-pb-border">
        <h4 className="font-semibold mb-2">📋 Note</h4>
        <p className="text-sm text-pb-text-muted">
          This is using sample data. Once Supabase is connected, users will be synced with the database 
          and authentication will be handled through Supabase Auth (email/phone OTP).
        </p>
      </div>
    </div>
  );
}
