import { useEffect, useState } from 'react';
import api from '../utils/api';

const STATUSES = ['all', 'todo', 'in_progress', 'done'];
const PRIORITIES = ['all', 'low', 'medium', 'high'];
const COLORS = { todo: 'badge-todo', in_progress: 'badge-inprogress', done: 'badge-done' };
const LABELS = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' };

function TaskModal({ task, onClose, onSave }) {
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
    due_date: task?.due_date?.split('T')[0] || '',
  });

  const update = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">{task ? 'Edit Task' : 'New Task'}</h2>
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input className="form-input" value={form.title} onChange={update('title')} placeholder="Task title" required />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" value={form.description} onChange={update('description')} placeholder="Optional description" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={update('status')}>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select className="form-select" value={form.priority} onChange={update('priority')}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Due Date</label>
          <input className="form-input" type="date" value={form.due_date} onChange={update('due_date')} />
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{ width: 'auto', padding: '10px 24px' }} onClick={() => form.title && onSave(form)}>
            {task ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [modal, setModal] = useState(null); // null | 'create' | task object
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tasks').then(r => setTasks(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = tasks.filter(t => {
    const s = filter === 'all' || t.status === filter;
    const p = priorityFilter === 'all' || t.priority === priorityFilter;
    return s && p;
  });

  const toggleStatus = async (task) => {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    const res = await api.put(`/tasks/${task.id}`, { ...task, status: newStatus });
    setTasks(ts => ts.map(t => t.id === task.id ? res.data : t));
  };

  const saveTask = async (form) => {
    if (modal?.id) {
      const res = await api.put(`/tasks/${modal.id}`, form);
      setTasks(ts => ts.map(t => t.id === modal.id ? res.data : t));
    } else {
      const res = await api.post('/tasks', form);
      setTasks(ts => [res.data, ...ts]);
    }
    setModal(null);
  };

  const deleteTask = async (id) => {
    if (!confirm('Delete this task?')) return;
    await api.delete(`/tasks/${id}`);
    setTasks(ts => ts.filter(t => t.id !== id));
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Tasks</h1>
        <p className="page-subtitle">Manage and track your work</p>
      </div>

      <div className="tasks-header">
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6, fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase' }}>Status</div>
            <div className="filter-bar">
              {STATUSES.map(s => (
                <button key={s} className={`filter-btn ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
                  {s === 'all' ? 'All' : LABELS[s] || s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6, fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase' }}>Priority</div>
            <div className="filter-bar">
              {PRIORITIES.map(p => (
                <button key={p} className={`filter-btn ${priorityFilter === p ? 'active' : ''}`} onClick={() => setPriorityFilter(p)}>
                  {p === 'all' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setModal('create')}>
          + New Task
        </button>
      </div>

      {loading && <div style={{ color: 'var(--muted)', padding: 32, textAlign: 'center' }}>Loading…</div>}

      {!loading && filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">✓</div>
          <div className="empty-title">No tasks found</div>
          <div className="empty-text">Try changing filters or create a new task</div>
        </div>
      )}

      {filtered.map((task, i) => (
        <div key={task.id} className="task-item" style={{ animationDelay: `${i * 40}ms` }}>
          <div
            className={`task-check ${task.status === 'done' ? 'done' : ''}`}
            onClick={() => toggleStatus(task)}
          />
          <div className="task-info">
            <div className={`task-title ${task.status === 'done' ? 'done' : ''}`}>{task.title}</div>
            {task.description && <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3 }}>{task.description}</div>}
            <div className="task-meta">
              <span className={`badge ${COLORS[task.status]}`}>{LABELS[task.status]}</span>
              <span className={`badge badge-${task.priority}`}>{task.priority}</span>
              {task.due_date && <span style={{ fontSize: 12, color: 'var(--muted)' }}>Due {new Date(task.due_date).toLocaleDateString()}</span>}
            </div>
          </div>
          <div className="task-actions">
            <button className="btn btn-ghost btn-sm" onClick={() => setModal(task)}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={() => deleteTask(task.id)}>✕</button>
          </div>
        </div>
      ))}

      {(modal === 'create' || (modal && modal.id)) && (
        <TaskModal
          task={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSave={saveTask}
        />
      )}
    </div>
  );
}
