/* global state */
let habits = [];
let seasons = [];
let stats = { totalPoints: 0, level: 1, xpInLevel: 0 };

/* ===================== UTILS ===================== */
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast' + (type ? ' ' + type : '');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.add('hidden'), 2800);
}

async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function categoryEmoji(cat) {
  const map = { prayer: '🙏', fasting: '✝️', health: '💪', study: '📖', service: '🤝', general: '📌', other: '💡' };
  return map[cat] || '📌';
}

function seasonTypeClass(type) {
  const safe = type ? type.replace(/\s+/g, '') : 'Other';
  const allowed = ['Lent', 'Advent', 'Easter', 'Christmas', 'OrdinaryTime', 'Other'];
  return allowed.includes(safe) ? 'type-' + safe : 'type-Other';
}

/* ===================== TABS ===================== */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    if (btn.dataset.tab === 'dashboard') loadDashboard();
    if (btn.dataset.tab === 'habits') loadHabits();
    if (btn.dataset.tab === 'seasons') loadSeasons();
  });
});

/* ===================== DASHBOARD ===================== */
async function loadDashboard() {
  const [habitsData, statsData, seasonsData] = await Promise.all([
    apiFetch('/api/habits'),
    apiFetch('/api/habits/stats/summary'),
    apiFetch('/api/seasons'),
  ]);
  habits = habitsData;
  stats = statsData;

  document.getElementById('stat-points').textContent = stats.totalPoints;
  document.getElementById('stat-level').textContent = stats.level;
  document.getElementById('bar-level').textContent = stats.level;
  document.getElementById('bar-xp').textContent = stats.xpInLevel;
  document.getElementById('level-bar').style.width = stats.xpInLevel + '%';

  const completedToday = habits.filter(h => h.completed_today).length;
  document.getElementById('stat-today').textContent = completedToday;

  // Best streak
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.completions_last_30 || 0), 0);
  document.getElementById('stat-streak').textContent = bestStreak;

  // Render today's habits
  const habitsEl = document.getElementById('dashboard-habits');
  habitsEl.innerHTML = '';
  if (habits.length === 0) {
    habitsEl.innerHTML = '<div class="empty-state"><div class="empty-icon">📋</div>No habits yet — add some in the Habits tab!</div>';
  } else {
    habits.forEach(h => habitsEl.appendChild(buildHabitCard(h, false)));
  }

  // Active season tasks
  const today = new Date().toISOString().split('T')[0];
  const activeSeasons = seasonsData.filter(s => s.is_active);
  const taskContainer = document.getElementById('dashboard-season-tasks');
  taskContainer.innerHTML = '';

  if (activeSeasons.length === 0) {
    taskContainer.innerHTML = '<div class="empty-state"><div class="empty-icon">🕯</div>No active seasons — add one in the Seasons tab!</div>';
  } else {
    for (const season of activeSeasons) {
      const tasks = await apiFetch(`/api/seasons/${season.id}/tasks`);
      if (tasks.length === 0) continue;
      const header = document.createElement('p');
      header.style.cssText = 'font-size:0.82rem;color:#888;margin-bottom:0.4rem;';
      header.textContent = `${season.name} (${season.type})`;
      taskContainer.appendChild(header);
      tasks.forEach(t => taskContainer.appendChild(buildTaskCard(t, season.id)));
    }
    if (taskContainer.children.length === 0) {
      taskContainer.innerHTML = '<div class="empty-state"><div class="empty-icon">✝️</div>Active season has no tasks yet.</div>';
    }
  }
}

function buildHabitCard(h, showDelete = true) {
  const card = document.createElement('div');
  card.className = 'habit-card' + (h.completed_today ? ' completed' : '');
  card.dataset.habitId = h.id;

  card.innerHTML = `
    <button class="check-btn" title="Toggle complete">${h.completed_today ? '✓' : ''}</button>
    <div class="habit-info">
      <div class="habit-name">${escHtml(h.name)}</div>
      <div class="habit-meta">${h.description ? escHtml(h.description) : ''}</div>
    </div>
    <div class="habit-badges">
      <span class="badge badge-cat">${categoryEmoji(h.category)} ${escHtml(h.category)}</span>
      <span class="badge badge-xp">⭐ ${h.points_per_completion} XP</span>
      <span class="badge badge-streak">🔥 ${h.completions_last_30 || 0}d</span>
    </div>
    ${showDelete ? `<button class="delete-btn" title="Delete habit">🗑</button>` : ''}
  `;

  card.querySelector('.check-btn').addEventListener('click', () => toggleHabit(h.id, card));
  if (showDelete) {
    card.querySelector('.delete-btn').addEventListener('click', () => deleteHabit(h.id));
  }
  return card;
}

function buildTaskCard(t, seasonId) {
  const card = document.createElement('div');
  card.className = 'habit-card' + (t.completed_today ? ' completed' : '');
  card.dataset.taskId = t.id;

  card.innerHTML = `
    <button class="check-btn" title="Toggle complete">${t.completed_today ? '✓' : ''}</button>
    <div class="habit-info">
      <div class="habit-name">${escHtml(t.name)}</div>
      <div class="habit-meta">${t.description ? escHtml(t.description) : ''}</div>
    </div>
    <div class="habit-badges">
      <span class="badge badge-season">${t.frequency === 'daily' ? '📅' : t.frequency === 'weekly' ? '📆' : '☑️'} ${escHtml(t.frequency)}</span>
      <span class="badge badge-xp">⭐ ${t.points_per_completion} XP</span>
    </div>
    <button class="delete-btn" title="Delete task">🗑</button>
  `;

  card.querySelector('.check-btn').addEventListener('click', () => toggleTask(t.id, seasonId, card));
  card.querySelector('.delete-btn').addEventListener('click', () => deleteTask(seasonId, t.id));
  return card;
}

function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function toggleHabit(id, card) {
  try {
    const res = await apiFetch(`/api/habits/${id}/complete`, { method: 'POST', body: JSON.stringify({}) });
    if (res.completed) {
      card.classList.add('completed');
      card.querySelector('.check-btn').textContent = '✓';
      showToast(`+${res.points} XP! ${res.message}`, 'success');
    } else {
      card.classList.remove('completed');
      card.querySelector('.check-btn').textContent = '';
    }
    refreshStats();
  } catch (e) {
    showToast(e.message, 'error');
  }
}

async function toggleTask(taskId, seasonId, card) {
  try {
    const res = await apiFetch(`/api/seasons/${seasonId}/tasks/${taskId}/complete`, { method: 'POST', body: JSON.stringify({}) });
    if (res.completed) {
      card.classList.add('completed');
      card.querySelector('.check-btn').textContent = '✓';
      showToast(`+${res.points} XP! ${res.message}`, 'success');
    } else {
      card.classList.remove('completed');
      card.querySelector('.check-btn').textContent = '';
    }
    refreshStats();
  } catch (e) {
    showToast(e.message, 'error');
  }
}

async function refreshStats() {
  try {
    stats = await apiFetch('/api/habits/stats/summary');
    document.getElementById('stat-points').textContent = stats.totalPoints;
    document.getElementById('stat-level').textContent = stats.level;
    document.getElementById('bar-level').textContent = stats.level;
    document.getElementById('bar-xp').textContent = stats.xpInLevel;
    document.getElementById('level-bar').style.width = stats.xpInLevel + '%';
  } catch (_) {}
}

/* ===================== HABITS ===================== */
async function loadHabits() {
  habits = await apiFetch('/api/habits');
  renderHabitsList();
}

function renderHabitsList() {
  const list = document.getElementById('habits-list');
  list.innerHTML = '';
  if (habits.length === 0) {
    list.innerHTML = '<div class="empty-state"><div class="empty-icon">🌱</div>No habits yet. Add your first habit above!</div>';
    return;
  }
  habits.forEach(h => list.appendChild(buildHabitCard(h, true)));
}

document.getElementById('habit-form').addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('habit-name').value.trim();
  const description = document.getElementById('habit-desc').value.trim();
  const category = document.getElementById('habit-category').value;
  const points_per_completion = Number(document.getElementById('habit-points').value) || 10;
  try {
    await apiFetch('/api/habits', {
      method: 'POST',
      body: JSON.stringify({ name, description, category, points_per_completion }),
    });
    document.getElementById('habit-form').reset();
    document.getElementById('habit-points').value = 10;
    showToast('Habit added!', 'success');
    loadHabits();
  } catch (e) {
    showToast(e.message, 'error');
  }
});

async function deleteHabit(id) {
  if (!confirm('Delete this habit and all its history?')) return;
  try {
    await apiFetch(`/api/habits/${id}`, { method: 'DELETE' });
    showToast('Habit deleted.');
    loadHabits();
  } catch (e) {
    showToast(e.message, 'error');
  }
}

/* ===================== SEASONS ===================== */
async function loadSeasons() {
  seasons = await apiFetch('/api/seasons');
  renderSeasonsList();
}

function renderSeasonsList() {
  const list = document.getElementById('seasons-list');
  list.innerHTML = '';
  if (seasons.length === 0) {
    list.innerHTML = '<div class="empty-state"><div class="empty-icon">🕯</div>No seasons yet. Add a Christian fasting season above!</div>';
    return;
  }
  seasons.forEach(s => list.appendChild(buildSeasonCard(s)));
}

function buildSeasonCard(s) {
  const card = document.createElement('div');
  card.className = 'season-card';
  const tc = seasonTypeClass(s.type);

  card.innerHTML = `
    <div class="season-header">
      <span class="season-badge ${tc}">${escHtml(s.type)}</span>
      ${s.is_active ? '<span class="season-active-badge">● Active</span>' : ''}
      <div class="season-info">
        <div class="season-name">${escHtml(s.name)}</div>
        <div class="season-dates">${formatDate(s.start_date)} – ${formatDate(s.end_date)}${s.description ? ' · ' + escHtml(s.description) : ''}</div>
      </div>
      <div class="season-actions">
        <button class="btn btn-secondary open-tasks-btn">🗂 Tasks (${s.task_count})</button>
        <button class="delete-btn delete-season-btn" title="Delete season">🗑</button>
      </div>
    </div>
    <div class="season-tasks-section hidden-tasks" style="display:none">
      <button class="add-task-btn">＋ Add Task</button>
      <div class="season-task-list"></div>
    </div>
  `;

  card.querySelector('.open-tasks-btn').addEventListener('click', () => {
    const section = card.querySelector('.season-tasks-section');
    const isOpen = section.style.display !== 'none';
    section.style.display = isOpen ? 'none' : 'block';
    if (!isOpen) loadSeasonTasksInCard(s.id, card);
  });

  card.querySelector('.add-task-btn').addEventListener('click', () => openTaskModal(s));
  card.querySelector('.delete-season-btn').addEventListener('click', () => deleteSeason(s.id));
  return card;
}

async function loadSeasonTasksInCard(seasonId, card) {
  const list = card.querySelector('.season-task-list');
  list.innerHTML = '<div style="color:#555;font-size:0.85rem;padding:0.5rem">Loading…</div>';
  const tasks = await apiFetch(`/api/seasons/${seasonId}/tasks`);
  list.innerHTML = '';
  if (tasks.length === 0) {
    list.innerHTML = '<div class="empty-state" style="padding:1rem"><div class="empty-icon" style="font-size:1.5rem">✝️</div>No tasks yet.</div>';
    return;
  }
  tasks.forEach(t => list.appendChild(buildTaskCard(t, seasonId)));
}

document.getElementById('season-form').addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('season-name').value.trim();
  const type = document.getElementById('season-type').value;
  const description = document.getElementById('season-desc').value.trim();
  const start_date = document.getElementById('season-start').value;
  const end_date = document.getElementById('season-end').value;
  try {
    await apiFetch('/api/seasons', {
      method: 'POST',
      body: JSON.stringify({ name, type, description, start_date, end_date }),
    });
    document.getElementById('season-form').reset();
    showToast('Season added!', 'success');
    loadSeasons();
  } catch (e) {
    showToast(e.message, 'error');
  }
});

async function deleteSeason(id) {
  if (!confirm('Delete this season and all its tasks?')) return;
  try {
    await apiFetch(`/api/seasons/${id}`, { method: 'DELETE' });
    showToast('Season deleted.');
    loadSeasons();
  } catch (e) {
    showToast(e.message, 'error');
  }
}

/* ===================== TASK MODAL ===================== */
let _modalSeasonId = null;

function openTaskModal(season) {
  _modalSeasonId = season.id;
  document.getElementById('modal-season-name').textContent = season.name;
  document.getElementById('task-season-id').value = season.id;
  document.getElementById('task-form').reset();
  document.getElementById('task-points').value = 15;
  loadModalTasks(season.id);
  document.getElementById('task-modal').classList.remove('hidden');
  document.getElementById('modal-backdrop').classList.remove('hidden');
}

function closeTaskModal() {
  document.getElementById('task-modal').classList.add('hidden');
  document.getElementById('modal-backdrop').classList.add('hidden');
  _modalSeasonId = null;
  loadSeasons();
}

document.getElementById('modal-close').addEventListener('click', closeTaskModal);
document.getElementById('modal-backdrop').addEventListener('click', closeTaskModal);

async function loadModalTasks(seasonId) {
  const list = document.getElementById('task-list-modal');
  const tasks = await apiFetch(`/api/seasons/${seasonId}/tasks`);
  list.innerHTML = '';
  if (tasks.length === 0) {
    list.innerHTML = '<div style="color:#555;font-size:0.85rem;padding:0.5rem 0">No tasks yet.</div>';
    return;
  }
  tasks.forEach(t => {
    const row = document.createElement('div');
    row.className = 'habit-card';
    row.style.padding = '0.6rem 0.9rem';
    row.innerHTML = `
      <div class="habit-info">
        <div class="habit-name" style="font-size:0.9rem">${escHtml(t.name)}</div>
        <div class="habit-meta">${escHtml(t.frequency)} · ⭐ ${t.points_per_completion} XP</div>
      </div>
      <button class="delete-btn" title="Delete task">🗑</button>
    `;
    row.querySelector('.delete-btn').addEventListener('click', async () => {
      await deleteTask(seasonId, t.id, false);
      loadModalTasks(seasonId);
    });
    list.appendChild(row);
  });
}

document.getElementById('task-form').addEventListener('submit', async e => {
  e.preventDefault();
  const seasonId = document.getElementById('task-season-id').value;
  const name = document.getElementById('task-name').value.trim();
  const description = document.getElementById('task-desc').value.trim();
  const frequency = document.getElementById('task-frequency').value;
  const points_per_completion = Number(document.getElementById('task-points').value) || 15;
  try {
    await apiFetch(`/api/seasons/${seasonId}/tasks`, {
      method: 'POST',
      body: JSON.stringify({ name, description, frequency, points_per_completion }),
    });
    document.getElementById('task-form').reset();
    document.getElementById('task-points').value = 15;
    showToast('Task added!', 'success');
    loadModalTasks(seasonId);
  } catch (e) {
    showToast(e.message, 'error');
  }
});

async function deleteTask(seasonId, taskId, confirmFirst = true) {
  if (confirmFirst && !confirm('Delete this task and its history?')) return;
  try {
    await apiFetch(`/api/seasons/${seasonId}/tasks/${taskId}`, { method: 'DELETE' });
    if (confirmFirst) showToast('Task deleted.');
  } catch (e) {
    showToast(e.message, 'error');
  }
}

/* ===================== INIT ===================== */
loadDashboard();
