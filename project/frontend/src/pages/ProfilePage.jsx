import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', avatar_url: user?.avatar_url || '' });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setError(''); setSaved(false);
    try {
      await api.put('/auth/profile', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Failed to update profile.');
    }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const joined = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '';

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Manage your account details</p>
      </div>

      <div className="profile-grid">
        <div className="profile-avatar-section">
          <div className="profile-avatar-lg">{initials}</div>
          <div className="profile-name">{user?.name}</div>
          <div className="profile-email">{user?.email}</div>
          <div className="profile-since">Member since {joined}</div>
          <div style={{ marginTop: 16 }}>
            <span className="badge badge-todo" style={{ fontSize: 12, padding: '4px 12px' }}>{user?.role}</span>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 18, marginBottom: 24 }}>Edit Profile</h2>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Display Name</label>
              <input
                className="form-input"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Your name"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Avatar URL</label>
              <input
                className="form-input"
                value={form.avatar_url}
                onChange={e => setForm(f => ({ ...f, avatar_url: e.target.value }))}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" value={user?.email} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} />
              <span style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6, display: 'block' }}>Email cannot be changed</span>
            </div>

            {error && <p className="error-msg" style={{ marginBottom: 16 }}>{error}</p>}
            {saved && <p style={{ color: 'var(--green)', fontSize: 13, marginBottom: 16, textAlign: 'center', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, padding: '10px' }}>✓ Profile updated successfully</p>}

            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Changes</button>
            </div>
          </form>

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 15, marginBottom: 12, color: 'var(--red)' }}>Danger Zone</h3>
            <button className="btn btn-danger" onClick={() => { if (confirm('Are you sure you want to log out?')) logout(); }}>
              Sign out of all sessions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
