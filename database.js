'use strict';

const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'gamification.db');

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS habits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    points_per_completion INTEGER DEFAULT 10,
    daily_target INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS habit_completions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    habit_id INTEGER NOT NULL,
    completed_date TEXT NOT NULL,
    count INTEGER DEFAULT 1,
    notes TEXT,
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
    UNIQUE(habit_id, completed_date)
  );

  CREATE TABLE IF NOT EXISTS seasons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS season_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    season_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    points_per_completion INTEGER DEFAULT 15,
    frequency TEXT DEFAULT 'daily',
    FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS season_task_completions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    season_task_id INTEGER NOT NULL,
    completed_date TEXT NOT NULL,
    notes TEXT,
    FOREIGN KEY (season_task_id) REFERENCES season_tasks(id) ON DELETE CASCADE,
    UNIQUE(season_task_id, completed_date)
  );
`);

// Safe migrations for existing databases
try { db.exec('ALTER TABLE habits ADD COLUMN daily_target INTEGER DEFAULT 1'); } catch (_) {}
try { db.exec('ALTER TABLE habit_completions ADD COLUMN count INTEGER DEFAULT 1'); } catch (_) {}

module.exports = db;

