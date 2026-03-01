'use strict';

const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all habits with today's completion status and streak
router.get('/', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const habits = db.prepare(`
    SELECT h.*,
      CASE WHEN hc.id IS NOT NULL THEN 1 ELSE 0 END AS completed_today,
      (
        SELECT COUNT(DISTINCT hc2.completed_date)
        FROM habit_completions hc2
        WHERE hc2.habit_id = h.id
          AND hc2.completed_date >= date('now', '-29 days')
      ) AS completions_last_30,
      (
        SELECT COUNT(*) FROM habit_completions hc3
        WHERE hc3.habit_id = h.id
      ) AS total_completions
    FROM habits h
    LEFT JOIN habit_completions hc ON hc.habit_id = h.id AND hc.completed_date = ?
    ORDER BY h.created_at DESC
  `).all(today);

  res.json(habits);
});

// POST create a habit
router.post('/', (req, res) => {
  const { name, description, category, points_per_completion } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Habit name is required' });
  }
  const numPoints = Number(points_per_completion);
  const points = Number.isInteger(numPoints) && numPoints > 0 ? numPoints : 10;

  const result = db.prepare(
    'INSERT INTO habits (name, description, category, points_per_completion) VALUES (?, ?, ?, ?)'
  ).run(name.trim(), description || null, category || 'general', points);

  const habit = db.prepare('SELECT * FROM habits WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(habit);
});

// DELETE a habit
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid habit id' });
  }
  const habit = db.prepare('SELECT id FROM habits WHERE id = ?').get(id);
  if (!habit) return res.status(404).json({ error: 'Habit not found' });
  db.prepare('DELETE FROM habits WHERE id = ?').run(id);
  res.json({ success: true });
});

// POST toggle habit completion for a given date (defaults to today)
router.post('/:id/complete', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid habit id' });
  }
  const habit = db.prepare('SELECT * FROM habits WHERE id = ?').get(id);
  if (!habit) return res.status(404).json({ error: 'Habit not found' });

  const date = req.body.date || new Date().toISOString().split('T')[0];
  const notes = req.body.notes || null;

  const existing = db.prepare(
    'SELECT id FROM habit_completions WHERE habit_id = ? AND completed_date = ?'
  ).get(id, date);

  if (existing) {
    db.prepare('DELETE FROM habit_completions WHERE habit_id = ? AND completed_date = ?').run(id, date);
    res.json({ completed: false, message: 'Habit unchecked' });
  } else {
    db.prepare(
      'INSERT INTO habit_completions (habit_id, completed_date, notes) VALUES (?, ?, ?)'
    ).run(id, date, notes);
    res.json({ completed: true, message: 'Habit completed!', points: habit.points_per_completion });
  }
});

// GET streak for a habit
router.get('/:id/streak', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid habit id' });
  }
  const completions = db.prepare(
    'SELECT completed_date FROM habit_completions WHERE habit_id = ? ORDER BY completed_date DESC'
  ).all(id);

  let streak = 0;
  if (completions.length > 0) {
    const today = new Date().toISOString().split('T')[0];
    let checkDate = new Date(today);
    for (const c of completions) {
      const d = c.completed_date;
      const expected = checkDate.toISOString().split('T')[0];
      if (d === expected) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (d < expected) {
        // Allow for yesterday's completion to count as streak start
        if (streak === 0 && d === new Date(Date.now() - 86400000).toISOString().split('T')[0]) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 2);
        } else {
          break;
        }
      }
    }
  }
  res.json({ streak });
});

// GET stats (total points, level, breakdown)
router.get('/stats/summary', (req, res) => {
  const totalPoints = db.prepare(`
    SELECT COALESCE(SUM(h.points_per_completion), 0) AS total
    FROM habit_completions hc
    JOIN habits h ON h.id = hc.habit_id
  `).get().total;

  const seasonPoints = db.prepare(`
    SELECT COALESCE(SUM(st.points_per_completion), 0) AS total
    FROM season_task_completions stc
    JOIN season_tasks st ON st.id = stc.season_task_id
  `).get().total;

  const grandTotal = totalPoints + seasonPoints;
  const level = Math.floor(grandTotal / 100) + 1;
  const xpInLevel = grandTotal % 100;

  res.json({ totalPoints: grandTotal, habitPoints: totalPoints, seasonPoints, level, xpInLevel });
});

module.exports = router;
