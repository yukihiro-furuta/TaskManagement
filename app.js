'use strict';

const COLS = [
  { id: 'todo',  label: '未着手' },
  { id: 'doing', label: '作業中' },
  { id: 'done',  label: '完了'   },
];

const STORAGE_KEY = 'kanban';
const PRIORITY_ICON = { high: '🔴', mid: '🟡', low: '🟢' };

let data = {};

// ── Data ──────────────────────────────────────────────────

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = {};
  }
  COLS.forEach(c => {
    if (!Array.isArray(data[c.id])) data[c.id] = [];
  });
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    alert('保存に失敗しました');
  }
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ── Due date ──────────────────────────────────────────────

function calcDue(due) {
  if (!due) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parse as local date to avoid timezone offset issues
  const [y, m, d] = due.split('-').map(Number);
  const dueDate = new Date(y, m - 1, d);

  const diff = Math.ceil((dueDate - today) / 86_400_000);
  const mm = String(m).padStart(2, '0');
  const dd = String(d).padStart(2, '0');

  if (diff < 0)   return { text: `期限超過 ${mm}/${dd}`, cls: 'due-over' };
  if (diff === 0) return { text: '今日', cls: 'due-today' };
  if (diff <= 3)  return { text: `📅 ${mm}/${dd}`, cls: 'due-soon' };
  return { text: `📅 ${mm}/${dd}`, cls: 'due-normal' };
}

// ── Render ────────────────────────────────────────────────

function renderBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';

  let total = 0;
  COLS.forEach((col, colIdx) => {
    total += data[col.id].length;

    const colEl = document.createElement('div');
    colEl.className = 'column';
    colEl.innerHTML = `
      <div class="column-header">
        <span class="column-name">${col.label}</span>
        <span class="column-count">${data[col.id].length}</span>
      </div>
      <div class="cards-area" id="cards-${col.id}"></div>
      <button class="btn-add-card" data-col="${col.id}">＋ カードを追加</button>
    `;
    board.appendChild(colEl);

    const area = colEl.querySelector(`#cards-${col.id}`);
    data[col.id].forEach(card => {
      area.appendChild(buildCardEl(card, col.id, colIdx));
    });
  });

  document.getElementById('total-count').textContent = total;
}

function buildCardEl(card, colId, colIdx) {
  const el = document.createElement('div');
  el.className = 'card';
  el.dataset.priority = card.priority;

  const dueInfo = calcDue(card.due);
  const dueHtml = dueInfo
    ? `<div class="card-due ${dueInfo.cls}">${dueInfo.text}</div>`
    : '';
  const descHtml = card.desc
    ? `<div class="card-desc">${esc(card.desc)}</div>`
    : '';

  const prevBtn = colIdx > 0
    ? `<button class="btn btn-move" data-action="prev" data-col="${colId}" data-id="${card.id}">←</button>`
    : '';
  const nextBtn = colIdx < COLS.length - 1
    ? `<button class="btn btn-move" data-action="next" data-col="${colId}" data-id="${card.id}">→</button>`
    : '';

  el.innerHTML = `
    <div class="card-title">
      <span class="priority-dot">${PRIORITY_ICON[card.priority] || ''}</span>${esc(card.title)}
    </div>
    ${descHtml}
    ${dueHtml}
    <div class="card-actions">
      <button class="btn btn-edit"   data-action="edit"   data-col="${colId}" data-id="${card.id}">編集</button>
      <button class="btn btn-delete" data-action="delete" data-col="${colId}" data-id="${card.id}">削除</button>
      ${prevBtn}${nextBtn}
    </div>
  `;
  return el;
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Modal ─────────────────────────────────────────────────

function openModal(colId, cardId = null) {
  const overlay = document.getElementById('modal-overlay');
  document.getElementById('card-form').reset();
  clearError();

  document.getElementById('edit-col').value = colId;
  document.getElementById('edit-id').value = cardId || '';
  document.getElementById('modal-title').textContent =
    cardId ? 'カードを編集' : 'カードを追加';

  if (cardId) {
    const card = data[colId].find(c => c.id === cardId);
    if (!card) return;
    document.getElementById('input-title').value    = card.title;
    document.getElementById('input-desc').value     = card.desc;
    document.getElementById('input-priority').value = card.priority;
    document.getElementById('input-due').value      = card.due;
  }

  overlay.hidden = false;
  document.getElementById('input-title').focus();
}

function closeModal() {
  document.getElementById('modal-overlay').hidden = true;
}

function clearError() {
  document.getElementById('error-title').hidden = true;
  document.getElementById('input-title').style.borderColor = '';
  document.getElementById('input-title').style.boxShadow = '';
}

// ── CRUD ──────────────────────────────────────────────────

function saveCard(e) {
  e.preventDefault();

  const titleInput = document.getElementById('input-title');
  const title = titleInput.value.trim();

  if (!title) {
    document.getElementById('error-title').hidden = false;
    titleInput.style.borderColor = '#ef4444';
    titleInput.style.boxShadow = '0 0 0 3px rgba(239,68,68,.15)';
    titleInput.focus();
    return;
  }

  const colId  = document.getElementById('edit-col').value;
  const cardId = document.getElementById('edit-id').value;

  const cardData = {
    title,
    desc:     document.getElementById('input-desc').value.trim(),
    priority: document.getElementById('input-priority').value,
    due:      document.getElementById('input-due').value,
  };

  if (cardId) {
    const idx = data[colId].findIndex(c => c.id === cardId);
    if (idx !== -1) data[colId][idx] = { id: cardId, ...cardData };
  } else {
    data[colId].push({ id: genId(), ...cardData });
  }

  saveData();
  closeModal();
  renderBoard();
}

function deleteCard(colId, cardId) {
  data[colId] = data[colId].filter(c => c.id !== cardId);
  saveData();
  renderBoard();
}

function moveCard(colId, cardId, dir) {
  const colIdx = COLS.findIndex(c => c.id === colId);
  const newIdx = dir === 'next' ? colIdx + 1 : colIdx - 1;
  if (newIdx < 0 || newIdx >= COLS.length) return;

  const card = data[colId].find(c => c.id === cardId);
  if (!card) return;

  data[colId] = data[colId].filter(c => c.id !== cardId);
  data[COLS[newIdx].id].push(card);
  saveData();
  renderBoard();
}

// ── Events ────────────────────────────────────────────────

document.addEventListener('click', e => {
  const addBtn = e.target.closest('.btn-add-card');
  if (addBtn) { openModal(addBtn.dataset.col); return; }

  const actionBtn = e.target.closest('[data-action]');
  if (!actionBtn) return;

  const { action, col, id } = actionBtn.dataset;
  if (action === 'edit')   openModal(col, id);
  if (action === 'delete') deleteCard(col, id);
  if (action === 'prev')   moveCard(col, id, 'prev');
  if (action === 'next')   moveCard(col, id, 'next');
});

document.getElementById('card-form').addEventListener('submit', saveCard);
document.getElementById('btn-modal-close').addEventListener('click', closeModal);
document.getElementById('btn-cancel').addEventListener('click', closeModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !document.getElementById('modal-overlay').hidden) {
    closeModal();
  }
});

// ── Init ──────────────────────────────────────────────────

loadData();
renderBoard();
