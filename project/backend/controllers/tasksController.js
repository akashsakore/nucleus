const { pool } = require('../db');

const getTasks = async (req, res) => {
  const { status, priority } = req.query;
  let query = 'SELECT * FROM tasks WHERE user_id=$1';
  const params = [req.user.id];
  if (status) { query += ` AND status=$${params.length + 1}`; params.push(status); }
  if (priority) { query += ` AND priority=$${params.length + 1}`; params.push(priority); }
  query += ' ORDER BY created_at DESC';
  const result = await pool.query(query, params);
  res.json(result.rows);
};

const createTask = async (req, res) => {
  const { title, description, status, priority, due_date } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const result = await pool.query(
    'INSERT INTO tasks (user_id, title, description, status, priority, due_date) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [req.user.id, title, description, status || 'todo', priority || 'medium', due_date || null]
  );
  res.status(201).json(result.rows[0]);
};

const updateTask = async (req, res) => {
  const { title, description, status, priority, due_date } = req.body;
  const result = await pool.query(
    'UPDATE tasks SET title=$1, description=$2, status=$3, priority=$4, due_date=$5, updated_at=NOW() WHERE id=$6 AND user_id=$7 RETURNING *',
    [title, description, status, priority, due_date, req.params.id, req.user.id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
  res.json(result.rows[0]);
};

const deleteTask = async (req, res) => {
  const result = await pool.query('DELETE FROM tasks WHERE id=$1 AND user_id=$2 RETURNING id', [req.params.id, req.user.id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
  res.json({ message: 'Task deleted' });
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
