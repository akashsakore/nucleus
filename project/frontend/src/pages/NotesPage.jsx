import { useEffect, useState } from 'react';
import api from '../utils/api';

const NOTE_COLORS = ['#1e1e28', '#1a2a1a', '#1a1a2a', '#2a1a1a', '#1a2a28', '#2a261a', '#251a2a'];
const COLOR_BORDERS = ['rgba(255,255,255,0.07)', '#22c55e', '#7c6aff', '#ef4444', '#06b6d4', '#f59e0b', '#a855f7'];

function NoteModal({ note, onClose, onSave }) {
  const [form, setForm] = useState({
    title: note?.title || '',
    content: note?.content || '',
    color: note?.color || '#1e1e28',
    pinned: note?.pinned || false,
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">{note ? 'Edit Note' : 'New Note'}</h2>
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Note title" />
        </div>
        <div className="form-group">
          <label className="form-label">Content</label>
          <textarea className="form-textarea" style={{ minHeight: 130 }} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Write your note here…" />
        </div>
        <div className="form-group">
          <label className="form-label">Color</label>
          <div className="color-picker">
            {NOTE_COLORS.map((c, i) => (
              <div
                key={c}
                className={`color-dot ${form.color === c ? 'selected' : ''}`}
                style={{ background: c, border: `2px solid ${COLOR_BORDERS[i]}` }}
                onClick={() => setForm(f => ({ ...f, color: c }))}
              />
            ))}
          </div>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: 'var(--muted)' }}>
          <input type="checkbox" checked={form.pinned} onChange={e => setForm(f => ({ ...f, pinned: e.target.checked }))} style={{ accentColor: 'var(--accent)' }} />
          Pin this note
        </label>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{ width: 'auto', padding: '10px 24px' }} onClick={() => form.title && onSave(form)}>
            {note ? 'Save Changes' : 'Create Note'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notes').then(r => setNotes(r.data)).finally(() => setLoading(false));
  }, []);

  const saveNote = async (form) => {
    if (modal?.id) {
      const res = await api.put(`/notes/${modal.id}`, form);
      setNotes(ns => ns.map(n => n.id === modal.id ? res.data : n));
    } else {
      const res = await api.post('/notes', form);
      setNotes(ns => [res.data, ...ns]);
    }
    setModal(null);
  };

  const deleteNote = async (id) => {
    if (!confirm('Delete this note?')) return;
    await api.delete(`/notes/${id}`);
    setNotes(ns => ns.filter(n => n.id !== id));
  };

  const togglePin = async (note) => {
    const res = await api.put(`/notes/${note.id}`, { ...note, pinned: !note.pinned });
    setNotes(ns => ns.map(n => n.id === note.id ? res.data : n).sort((a,b) => b.pinned - a.pinned));
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Notes</h1>
          <p className="page-subtitle">Capture ideas and thoughts</p>
        </div>
        <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setModal('create')}>
          + New Note
        </button>
      </div>

      {loading && <div style={{ color: 'var(--muted)', padding: 32, textAlign: 'center' }}>Loading…</div>}

      {!loading && notes.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">◈</div>
          <div className="empty-title">No notes yet</div>
          <div className="empty-text">Create your first note to get started</div>
        </div>
      )}

      <div className="notes-grid">
        {notes.map((note, i) => (
          <div key={note.id} className="note-card" style={{ background: note.color, animationDelay: `${i * 50}ms` }}>
            <div className="note-card-title">{note.title}</div>
            <div className="note-card-body">{note.content || <em style={{ opacity: 0.4 }}>No content</em>}</div>
            <div className="note-card-footer">
              <span className="note-card-date">{new Date(note.created_at).toLocaleDateString()}</span>
              <div className="note-actions">
                <button className="btn btn-ghost btn-sm" style={{ padding: '5px 8px' }} title="Pin" onClick={() => togglePin(note)}>
                  {note.pinned ? '📌' : '📍'}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setModal(note)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => deleteNote(note.id)}>✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(modal === 'create' || (modal && modal.id)) && (
        <NoteModal
          note={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSave={saveNote}
        />
      )}
    </div>
  );
}
