'use strict';

const express = require('express');
const router = express.Router();
const db = require('../database');

const SEASON_TYPES = ['Lent', 'Advent', 'Ordinary Time', 'Easter', 'Christmas', 'Other'];

// GET all seasons
router.get('/', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const seasons = db.prepare(`
    SELECT s.*,
      CASE WHEN ? BETWEEN s.start_date AND s.end_date THEN 1 ELSE 0 END AS is_active,
      (SELECT COUNT(*) FROM season_tasks WHERE season_id = s.id) AS task_count
    FROM seasons s
    ORDER BY s.start_date DESC
  `).all(today);
  res.json(seasons);
});

// POST create a season
router.post('/', (req, res) => {
  const { name, type, description, start_date, end_date } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Season name is required' });
  }
  if (!start_date || !end_date) {
    return res.status(400).json({ error: 'start_date and end_date are required' });
  }
  if (start_date >= end_date) {
    return res.status(400).json({ error: 'end_date must be after start_date' });
  }
  const seasonType = SEASON_TYPES.includes(type) ? type : 'Other';

  const result = db.prepare(
    'INSERT INTO seasons (name, type, description, start_date, end_date) VALUES (?, ?, ?, ?, ?)'
  ).run(name.trim(), seasonType, description || null, start_date, end_date);

  const season = db.prepare('SELECT * FROM seasons WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(season);
});

// DELETE a season
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid season id' });
  }
  const season = db.prepare('SELECT id FROM seasons WHERE id = ?').get(id);
  if (!season) return res.status(404).json({ error: 'Season not found' });
  db.prepare('DELETE FROM seasons WHERE id = ?').run(id);
  res.json({ success: true });
});

// GET tasks for a season
router.get('/:id/tasks', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid season id' });
  }
  const today = new Date().toISOString().split('T')[0];
  const tasks = db.prepare(`
    SELECT st.*,
      CASE WHEN stc.id IS NOT NULL THEN 1 ELSE 0 END AS completed_today,
      (SELECT COUNT(*) FROM season_task_completions WHERE season_task_id = st.id) AS total_completions
    FROM season_tasks st
    LEFT JOIN season_task_completions stc
      ON stc.season_task_id = st.id AND stc.completed_date = ?
    WHERE st.season_id = ?
    ORDER BY st.id ASC
  `).all(today, id);
  res.json(tasks);
});

// POST add a task to a season
router.post('/:id/tasks', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid season id' });
  }
  const season = db.prepare('SELECT id FROM seasons WHERE id = ?').get(id);
  if (!season) return res.status(404).json({ error: 'Season not found' });

  const { name, description, points_per_completion, frequency } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Task name is required' });
  }
  const numPoints = Number(points_per_completion);
  const points = Number.isInteger(numPoints) && numPoints > 0 ? numPoints : 15;
  const freq = ['daily', 'once', 'weekly'].includes(frequency) ? frequency : 'daily';

  const result = db.prepare(
    'INSERT INTO season_tasks (season_id, name, description, points_per_completion, frequency) VALUES (?, ?, ?, ?, ?)'
  ).run(id, name.trim(), description || null, points, freq);

  const task = db.prepare('SELECT * FROM season_tasks WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(task);
});

// DELETE a season task
router.delete('/:seasonId/tasks/:taskId', (req, res) => {
  const taskId = Number(req.params.taskId);
  if (!Number.isInteger(taskId) || taskId < 1) {
    return res.status(400).json({ error: 'Invalid task id' });
  }
  const task = db.prepare('SELECT id FROM season_tasks WHERE id = ?').get(taskId);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  db.prepare('DELETE FROM season_tasks WHERE id = ?').run(taskId);
  res.json({ success: true });
});

// POST toggle season task completion
router.post('/:seasonId/tasks/:taskId/complete', (req, res) => {
  const taskId = Number(req.params.taskId);
  if (!Number.isInteger(taskId) || taskId < 1) {
    return res.status(400).json({ error: 'Invalid task id' });
  }
  const task = db.prepare('SELECT * FROM season_tasks WHERE id = ?').get(taskId);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const date = req.body.date || new Date().toISOString().split('T')[0];
  const notes = req.body.notes || null;

  const existing = db.prepare(
    'SELECT id FROM season_task_completions WHERE season_task_id = ? AND completed_date = ?'
  ).get(taskId, date);

  if (existing) {
    db.prepare(
      'DELETE FROM season_task_completions WHERE season_task_id = ? AND completed_date = ?'
    ).run(taskId, date);
    res.json({ completed: false, message: 'Task unchecked' });
  } else {
    db.prepare(
      'INSERT INTO season_task_completions (season_task_id, completed_date, notes) VALUES (?, ?, ?)'
    ).run(taskId, date, notes);
    res.json({ completed: true, message: 'Task completed!', points: task.points_per_completion });
  }
});

module.exports = router;
