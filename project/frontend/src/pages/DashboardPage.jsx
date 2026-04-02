import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/tasks'), api.get('/notes')])
      .then(([t, n]) => { setTasks(t.data); setNotes(n.data); })
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const done = tasks.filter(t => t.status === 'done').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const todo = tasks.filter(t => t.status === 'todo').length;
  const pinned = notes.filter(n => n.pinned).length;

  const stats = [
    { icon: '✓', label: 'Completed', value: done, desc: 'tasks finished', color: '#22c55e' },
    { icon: '◑', label: 'In Progress', value: inProgress, desc: 'tasks ongoing', color: '#06b6d4' },
    { icon: '○', label: 'To Do', value: todo, desc: 'tasks pending', color: '#7c6aff' },
    { icon: '◈', label: 'Notes', value: notes.length, desc: `${pinned} pinned`, color: '#f59e0b' },
  ];

  const recentTasks = tasks.slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{greeting}, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="page-subtitle">Here's what's happening in your workspace</p>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={s.label} className="stat-card fade-up" style={{ animationDelay: `${i * 60}ms`, '--accent-color': s.color }}>
            <span className="stat-icon" style={{ color: s.color }}>{s.icon}</span>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.color }}>{loading ? '—' : s.value}</div>
            <div className="stat-desc">{s.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card">
          <div className="section-header">
            <span className="section-title">Recent Tasks</span>
            <Link to="/tasks"><button className="btn btn-ghost btn-sm">View all</button></Link>
          </div>
          {recentTasks.length === 0 && !loading && (
            <div className="empty-state" style={{ padding: 32 }}>
              <div className="empty-icon">✓</div>
              <div className="empty-text">No tasks yet. <Link to="/tasks" style={{ color: 'var(--accent2)' }}>Create one</Link></div>
            </div>
          )}
          {recentTasks.map(task => (
            <div key={task.id} className="task-item" style={{ marginBottom: 8 }}>
              <div className={`task-check ${task.status === 'done' ? 'done' : ''}`} />
              <div className="task-info">
                <div className={`task-title ${task.status === 'done' ? 'done' : ''}`}>{task.title}</div>
                <div className="task-meta">
                  <span className={`badge badge-${task.status === 'in_progress' ? 'inprogress' : task.status}`}>
                    {task.status === 'in_progress' ? 'In Progress' : task.status === 'todo' ? 'To Do' : 'Done'}
                  </span>
                  <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="section-header">
            <span className="section-title">Recent Notes</span>
            <Link to="/notes"><button className="btn btn-ghost btn-sm">View all</button></Link>
          </div>
          {notes.length === 0 && !loading && (
            <div className="empty-state" style={{ padding: 32 }}>
              <div className="empty-icon">◈</div>
              <div className="empty-text">No notes yet. <Link to="/notes" style={{ color: 'var(--accent2)' }}>Create one</Link></div>
            </div>
          )}
          {notes.slice(0, 4).map(note => (
            <div key={note.id} style={{ padding: '12px 16px', background: 'var(--bg3)', borderRadius: 10, marginBottom: 8, borderLeft: `3px solid ${note.color === '#ffffff' ? 'var(--border2)' : note.color}` }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                {note.title} {note.pinned && <span style={{ fontSize: 12 }}>📌</span>}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {note.content || 'No content'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
