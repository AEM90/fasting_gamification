/* ===================== PRESETS ===================== */
const MAX_SHOP_QTY = 20;

const HABIT_PRESETS = [
  { name: 'Morning Prayer',        category: 'prayer',   icon: '🌅', xp: 10, desc: 'Start your day with prayer' },
  { name: 'Evening Prayer',        category: 'prayer',   icon: '🌙', xp: 10, desc: 'End your day in gratitude' },
  { name: 'Rosary',                category: 'prayer',   icon: '📿', xp: 20, desc: 'Meditate on the mysteries' },
  { name: 'Liturgy of the Hours',  category: 'prayer',   icon: '⏰', xp: 20, desc: 'Pray the Divine Office' },
  { name: 'Angelus',               category: 'prayer',   icon: '🔔', xp: 10, desc: 'Midday Marian prayer' },
  { name: 'Scripture Reading',     category: 'study',    icon: '📖', xp: 15, desc: 'Read and reflect on the Bible' },
  { name: 'Bible Study',           category: 'study',    icon: '✝️', xp: 20, desc: 'Deep study of scripture' },
  { name: 'Read a Christian Book', category: 'study',    icon: '📚', xp: 12, desc: 'Spiritual reading' },
  { name: 'Catechism Study',       category: 'study',    icon: '📜', xp: 15, desc: 'Study the faith' },
  { name: 'Fast from Meat',        category: 'fasting',  icon: '🥩', xp: 15, desc: 'Abstain from meat' },
  { name: 'Water Fast',            category: 'fasting',  icon: '💧', xp: 30, desc: 'Fast with water only' },
  { name: 'Fast from Social Media',category: 'fasting',  icon: '📵', xp: 15, desc: 'Digital detox' },
  { name: 'Intermittent Fast',     category: 'fasting',  icon: '🕐', xp: 20, desc: 'Skip a meal / fast window' },
  { name: 'Fast from Sweets',      category: 'fasting',  icon: '🍫', xp: 10, desc: 'No sugar today' },
  { name: 'Morning Walk',          category: 'health',   icon: '🚶', xp: 10, desc: '15+ minute walk' },
  { name: 'Exercise',              category: 'health',   icon: '💪', xp: 15, desc: 'Physical workout' },
  { name: 'Drink 8 Glasses Water', category: 'health',   icon: '🥤', xp:  8, desc: 'Stay hydrated' },
  { name: 'Sleep by 10 PM',        category: 'health',   icon: '😴', xp: 10, desc: 'Discipline your rest' },
  { name: 'Act of Kindness',       category: 'service',  icon: '❤️', xp: 15, desc: 'Do something kind' },
  { name: 'Give Alms',             category: 'service',  icon: '🕊️', xp: 25, desc: 'Give to those in need' },
  { name: 'Volunteer',             category: 'service',  icon: '🤝', xp: 20, desc: 'Serve your community' },
];

const SEASON_TASK_PRESETS = {
  Lent: [
    { name: 'Stations of the Cross',      icon: '✝️', xp: 20, freq: 'weekly' },
    { name: 'Abstain from Meat (Friday)', icon: '🥩', xp: 15, freq: 'weekly' },
    { name: 'Almsgiving',                 icon: '🕊️', xp: 25, freq: 'weekly' },
    { name: 'Lenten Devotional',          icon: '📖', xp: 15, freq: 'daily'  },
    { name: 'Fast from Sweets',           icon: '🍫', xp: 10, freq: 'daily'  },
    { name: 'Extra Rosary Decade',        icon: '📿', xp: 15, freq: 'daily'  },
    { name: 'Attend Mass',                icon: '⛪', xp: 30, freq: 'weekly' },
    { name: 'Confession',                 icon: '🙏', xp: 40, freq: 'once'   },
  ],
  Advent: [
    { name: 'Advent Wreath Prayer',  icon: '🕯', xp: 15, freq: 'daily'  },
    { name: 'Advent Devotional',     icon: '📖', xp: 15, freq: 'daily'  },
    { name: 'Fast on Wednesdays',    icon: '🤲', xp: 20, freq: 'weekly' },
    { name: 'Nativity Reflection',   icon: '⭐', xp: 15, freq: 'daily'  },
    { name: 'Act of Charity',        icon: '❤️', xp: 20, freq: 'weekly' },
  ],
  Easter: [
    { name: 'Divine Mercy Chaplet', icon: '🕊️', xp: 20, freq: 'daily' },
    { name: 'Regina Caeli Prayer',  icon: '🙏', xp: 10, freq: 'daily' },
    { name: 'Easter Novena',        icon: '✝️', xp: 25, freq: 'daily' },
    { name: 'Alleluia Reflection',  icon: '🌟', xp: 15, freq: 'daily' },
  ],
  Christmas: [
    { name: 'Christmas Novena',    icon: '⭐', xp: 20, freq: 'daily'  },
    { name: 'Attend Mass',         icon: '⛪', xp: 30, freq: 'weekly' },
    { name: 'Christmas Charity',   icon: '🎁', xp: 25, freq: 'once'   },
    { name: "O Antiphons Prayer",  icon: '🕯', xp: 15, freq: 'daily'  },
  ],
  'Ordinary Time': [
    { name: 'Sunday Mass',   icon: '⛪', xp: 30, freq: 'weekly' },
    { name: 'Daily Rosary',  icon: '📿', xp: 20, freq: 'daily'  },
    { name: 'Weekly Fast',   icon: '🤲', xp: 20, freq: 'weekly' },
    { name: 'Lectio Divina', icon: '📖', xp: 15, freq: 'daily'  },
  ],
  Other: [
    { name: 'Special Prayer',     icon: '🙏', xp: 15, freq: 'daily'  },
    { name: 'Fasting',            icon: '✝️', xp: 20, freq: 'daily'  },
    { name: 'Scripture Reading',  icon: '📖', xp: 15, freq: 'daily'  },
    { name: 'Acts of Charity',    icon: '❤️', xp: 20, freq: 'weekly' },
  ],
};

/* global state */
let habits = [];
let seasons = [];
let stats = { totalPoints: 0, level: 1, xpInLevel: 0 };
let shopFilter = 'all';
/* per-card quantity state for shop (keyed by preset index) */
const shopQty = {};

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
  const count = h.completions_today_count || 0;
  const target = h.daily_target || 1;
  const done = count >= target;
  card.className = 'habit-card' + (done ? ' completed' : '');
  card.dataset.habitId = h.id;

  let checkLabel;
  if (target === 1) {
    checkLabel = done ? '✓' : '';
  } else {
    checkLabel = done ? '✓' : `${count}`;
  }
  const progressBadge = target > 1
    ? `<span class="badge badge-progress ${done ? 'badge-progress-done' : ''}">${count} / ${target}</span>`
    : '';

  card.innerHTML = `
    <button class="check-btn" title="Log completion">${checkLabel}</button>
    <div class="habit-info">
      <div class="habit-name">${escHtml(h.name)}</div>
      <div class="habit-meta">${h.description ? escHtml(h.description) : ''}</div>
    </div>
    <div class="habit-badges">
      <span class="badge badge-cat">${categoryEmoji(h.category)} ${escHtml(h.category)}</span>
      <span class="badge badge-xp">⭐ ${h.points_per_completion} XP</span>
      ${progressBadge}
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
      <span class="badge badge-season">${freqIcon(t.frequency)} ${escHtml(t.frequency)}</span>
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

function freqIcon(freq) {
  return freq === 'daily' ? '📅' : freq === 'weekly' ? '📆' : '☑️';
}

async function toggleHabit(id, card) {
  try {
    const res = await apiFetch(`/api/habits/${id}/complete`, { method: 'POST', body: JSON.stringify({}) });
    const target = res.daily_target || 1;
    const count = res.count || 0;
    const done = res.completed;

    card.classList.toggle('completed', done);
    const btn = card.querySelector('.check-btn');
    if (target === 1) {
      btn.textContent = done ? '✓' : '';
    } else {
      btn.textContent = done ? '✓' : (count > 0 ? `${count}` : '');
    }
    // Update progress badge if present
    const pb = card.querySelector('.badge-progress');
    if (pb) {
      pb.textContent = `${count} / ${target}`;
      pb.classList.toggle('badge-progress-done', done);
    }

    if (res.points > 0) showToast(`+${res.points} XP! ${res.message}`, 'success');
    else if (res.count === 0) showToast('Reset ↺');
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
  renderShop();
  renderHabitsList();
}

/* ── Shop ── */
function renderShop() {
  const grid = document.getElementById('shop-grid');
  grid.innerHTML = '';
  // Iterate with original index to keep qty state stable across filter changes
  HABIT_PRESETS.forEach((preset, idx) => {
    if (shopFilter !== 'all' && preset.category !== shopFilter) return;
    if (!(idx in shopQty)) shopQty[idx] = 1;
    const card = document.createElement('div');
    card.className = 'shop-card';
    card.innerHTML = `
      <div class="shop-card-icon">${preset.icon}</div>
      <div class="shop-card-name">${escHtml(preset.name)}</div>
      <div class="shop-card-desc">${escHtml(preset.desc)}</div>
      <div class="shop-card-meta">
        <span class="badge badge-xp">⭐ ${preset.xp} XP</span>
        <span class="badge badge-cat">${categoryEmoji(preset.category)} ${escHtml(preset.category)}</span>
      </div>
      <div class="shop-card-footer">
        <div class="qty-stepper">
          <button class="qty-btn qty-minus" type="button">−</button>
          <span class="qty-val" id="qty-${idx}">${shopQty[idx]}</span>
          <button class="qty-btn qty-plus" type="button">＋</button>
        </div>
        <span class="qty-hint">per day</span>
        <button class="btn btn-primary shop-add-btn" type="button">＋ Add</button>
      </div>
    `;
    card.querySelector('.qty-minus').addEventListener('click', () => {
      if (shopQty[idx] > 1) { shopQty[idx]--; card.querySelector(`#qty-${idx}`).textContent = shopQty[idx]; }
    });
    card.querySelector('.qty-plus').addEventListener('click', () => {
      if (shopQty[idx] < MAX_SHOP_QTY) { shopQty[idx]++; card.querySelector(`#qty-${idx}`).textContent = shopQty[idx]; }
    });
    card.querySelector('.shop-add-btn').addEventListener('click', () => addPresetHabit(preset, shopQty[idx], card));
    grid.appendChild(card);
  });
}

/* filter pills */
document.getElementById('shop-filters').addEventListener('click', e => {
  const pill = e.target.closest('.pill');
  if (!pill) return;
  document.querySelectorAll('#shop-filters .pill').forEach(p => p.classList.remove('active'));
  pill.classList.add('active');
  shopFilter = pill.dataset.cat;
  renderShop();
});

async function addPresetHabit(preset, daily_target, card) {
  const btn = card.querySelector('.shop-add-btn');
  btn.disabled = true;
  try {
    await apiFetch('/api/habits', {
      method: 'POST',
      body: JSON.stringify({
        name: preset.name,
        description: preset.desc,
        category: preset.category,
        points_per_completion: preset.xp,
        daily_target,
      }),
    });
    btn.textContent = '✓ Added!';
    btn.style.background = '#2a8a50';
    showToast(`${preset.icon} ${preset.name} added!`, 'success');
    await loadHabits();
    setTimeout(() => { btn.textContent = '＋ Add'; btn.style.background = ''; btn.disabled = false; }, 1800);
  } catch (e) {
    showToast(e.message, 'error');
    btn.disabled = false;
  }
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
  const daily_target = Number(document.getElementById('habit-target').value) || 1;
  try {
    await apiFetch('/api/habits', {
      method: 'POST',
      body: JSON.stringify({ name, description, category, points_per_completion, daily_target }),
    });
    document.getElementById('habit-form').reset();
    document.getElementById('habit-points').value = 10;
    document.getElementById('habit-target').value = 1;
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
  renderSuggestedTasks(season);
  loadModalTasks(season.id);
  document.getElementById('task-modal').classList.remove('hidden');
  document.getElementById('modal-backdrop').classList.remove('hidden');
}

function renderSuggestedTasks(season) {
  const presets = SEASON_TASK_PRESETS[season.type] || SEASON_TASK_PRESETS['Other'];
  const grid = document.getElementById('suggested-tasks-grid');
  const section = document.getElementById('suggested-tasks-section');
  grid.innerHTML = '';
  if (!presets || presets.length === 0) { section.style.display = 'none'; return; }
  section.style.display = '';
  presets.forEach(p => {
    const chip = document.createElement('button');
    chip.className = 'suggest-chip';
    chip.type = 'button';
    chip.innerHTML = `${p.icon} ${escHtml(p.name)} <span class="chip-meta">${freqIcon(p.freq)} ⭐${p.xp}</span>`;
    chip.addEventListener('click', async () => {
      chip.disabled = true;
      chip.classList.add('chip-added');
      try {
        await apiFetch(`/api/seasons/${season.id}/tasks`, {
          method: 'POST',
          body: JSON.stringify({ name: p.name, description: null, frequency: p.freq, points_per_completion: p.xp }),
        });
        showToast(`${p.icon} ${p.name} added!`, 'success');
        chip.innerHTML = `✓ ${escHtml(p.name)}`;
        loadModalTasks(season.id);
      } catch (e) {
        showToast(e.message, 'error');
        chip.disabled = false;
        chip.classList.remove('chip-added');
      }
    });
    grid.appendChild(chip);
  });
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
