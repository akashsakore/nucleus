const { pool } = require('../db');

const getNotes = async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM notes WHERE user_id=$1 ORDER BY pinned DESC, created_at DESC',
    [req.user.id]
  );
  res.json(result.rows);
};

const createNote = async (req, res) => {
  const { title, content, color } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const result = await pool.query(
    'INSERT INTO notes (user_id, title, content, color) VALUES ($1,$2,$3,$4) RETURNING *',
    [req.user.id, title, content, color || '#ffffff']
  );
  res.status(201).json(result.rows[0]);
};

const updateNote = async (req, res) => {
  const { title, content, color, pinned } = req.body;
  const result = await pool.query(
    'UPDATE notes SET title=$1, content=$2, color=$3, pinned=$4, updated_at=NOW() WHERE id=$5 AND user_id=$6 RETURNING *',
    [title, content, color, pinned, req.params.id, req.user.id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Note not found' });
  res.json(result.rows[0]);
};

const deleteNote = async (req, res) => {
  const result = await pool.query('DELETE FROM notes WHERE id=$1 AND user_id=$2 RETURNING id', [req.params.id, req.user.id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Note not found' });
  res.json({ message: 'Note deleted' });
};

module.exports = { getNotes, createNote, updateNote, deleteNote };
