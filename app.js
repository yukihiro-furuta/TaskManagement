'use strict';

const COLS = [
  { id: 'todo',  label: '未着手' },
  { id: 'doing', label: '作業中' },
  { id: 'done',  label: '完了'   },
];

const STORAGE_KEY = 'kanban';
const PRIORITY_ICON  = { high: '🔴', mid: '🟡', low: '🟢' };
const PRIORITY_ORDER = { high: 0, mid: 1, low: 2 };

let data = {};
let drag = null; // { id, fromCol }

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
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [y, m, d] = due.split('-').map(Number);
  const dueDate = new Date(y, m - 1, d);
  const diff = Math.ceil((dueDate - today) / 86_400_000);
  const mm = String(m).padStart(2, '0'), dd = String(d).padStart(2, '0');
  if (diff < 0)   return { text: `期限超過 ${mm}/${dd}`, cls: 'due-over' };
  if (diff === 0) return { text: '今日', cls: 'due-today' };
  if (diff <= 3)  return { text: `📅 ${mm}/${dd}`, cls: 'due-soon' };
  return { text: `📅 ${mm}/${dd}`, cls: 'due-normal' };
}

// ── Sort ──────────────────────────────────────────────────

function sortCol(colId, by) {
  if (by === 'priority') {
    data[colId].sort((a, b) =>
      (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1)
    );
  } else if (by === 'due') {
    data[colId].sort((a, b) => {
      if (!a.due && !b.due) return 0;
      if (!a.due) return 1;
      if (!b.due) return -1;
      return a.due.localeCompare(b.due);
    });
  }
  saveData();
  renderBoard();
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
        <div class="col-sort">
          <button class="btn-sort" data-sort-col="${col.id}" data-sort-by="priority" title="優先度順に並び替え">優先度↓</button>
          <button class="btn-sort" data-sort-col="${col.id}" data-sort-by="due" title="期限順に並び替え">期限↓</button>
        </div>
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
  el.dataset.id  = card.id;
  el.dataset.col = colId;
  el.draggable   = true;

  const due = calcDue(card.due);
  el.innerHTML = `
    <div class="card-title">
      <span class="priority-dot">${PRIORITY_ICON[card.priority] || ''}</span>${esc(card.title)}
    </div>
    ${card.desc ? `<div class="card-desc">${esc(card.desc)}</div>` : ''}
    ${due ? `<div class="card-due ${due.cls}">${due.text}</div>` : ''}
    <div class="card-actions">
      <button class="btn btn-edit"   data-action="edit"   data-col="${colId}" data-id="${card.id}">編集</button>
      <button class="btn btn-delete" data-action="delete" data-col="${colId}" data-id="${card.id}">削除</button>
      ${colIdx > 0 ? `<button class="btn btn-move" data-action="prev" data-col="${colId}" data-id="${card.id}">←</button>` : ''}
      ${colIdx < COLS.length - 1 ? `<button class="btn btn-move" data-action="next" data-col="${colId}" data-id="${card.id}">→</button>` : ''}
    </div>
  `;
  return el;
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Modal ─────────────────────────────────────────────────

function openModal(colId, cardId = null) {
  document.getElementById('card-form').reset();
  clearError();
  document.getElementById('edit-col').value = colId;
  document.getElementById('edit-id').value  = cardId || '';
  document.getElementById('modal-title').textContent = cardId ? 'カードを編集' : 'カードを追加';

  if (cardId) {
    const c = data[colId].find(c => c.id === cardId);
    if (!c) return;
    document.getElementById('input-title').value    = c.title;
    document.getElementById('input-desc').value     = c.desc;
    document.getElementById('input-priority').value = c.priority;
    document.getElementById('input-due').value      = c.due;
  }

  document.getElementById('modal-overlay').hidden = false;
  document.getElementById('input-title').focus();
}

function closeModal() {
  document.getElementById('modal-overlay').hidden = true;
}

function clearError() {
  document.getElementById('error-title').hidden = true;
  const t = document.getElementById('input-title');
  t.style.borderColor = ''; t.style.boxShadow = '';
}

// ── CRUD ──────────────────────────────────────────────────

function saveCard(e) {
  e.preventDefault();
  const t = document.getElementById('input-title');
  const title = t.value.trim();

  if (!title) {
    document.getElementById('error-title').hidden = false;
    t.style.borderColor = '#ef4444';
    t.style.boxShadow   = '0 0 0 3px rgba(239,68,68,.15)';
    t.focus(); return;
  }

  const colId  = document.getElementById('edit-col').value;
  const cardId = document.getElementById('edit-id').value;
  const cd = {
    title,
    desc:     document.getElementById('input-desc').value.trim(),
    priority: document.getElementById('input-priority').value,
    due:      document.getElementById('input-due').value,
  };

  if (cardId) {
    const i = data[colId].findIndex(c => c.id === cardId);
    if (i !== -1) data[colId][i] = { id: cardId, ...cd };
  } else {
    data[colId].push({ id: genId(), ...cd });
  }

  saveData(); closeModal(); renderBoard();
}

function deleteCard(colId, cardId) {
  data[colId] = data[colId].filter(c => c.id !== cardId);
  saveData(); renderBoard();
}

function moveCard(colId, cardId, dir) {
  const ci = COLS.findIndex(c => c.id === colId);
  const ni = dir === 'next' ? ci + 1 : ci - 1;
  if (ni < 0 || ni >= COLS.length) return;

  const card = data[colId].find(c => c.id === cardId);
  if (!card) return;
  data[colId] = data[colId].filter(c => c.id !== cardId);
  data[COLS[ni].id].push(card);
  saveData(); renderBoard();
}

// ── Drag & Drop ───────────────────────────────────────────

function getDropIndex(e, area) {
  const cards = [...area.querySelectorAll('.card:not(.dragging)')];
  for (let i = 0; i < cards.length; i++) {
    const { top, height } = cards[i].getBoundingClientRect();
    if (e.clientY < top + height / 2) return i;
  }
  return cards.length;
}

function clearDragUi() {
  document.querySelectorAll('.card.dragging').forEach(c => c.classList.remove('dragging'));
  document.querySelectorAll('.drop-indicator').forEach(el => el.remove());
  document.querySelectorAll('.cards-area.drag-over').forEach(a => a.classList.remove('drag-over'));
}

document.addEventListener('dragstart', e => {
  const card = e.target.closest('.card');
  if (!card) return;
  drag = { id: card.dataset.id, fromCol: card.dataset.col };
  e.dataTransfer.effectAllowed = 'move';
  // Delay so the ghost image is captured before the opacity changes
  setTimeout(() => card.classList.add('dragging'), 0);
});

document.addEventListener('dragend', () => {
  clearDragUi();
  drag = null;
});

document.addEventListener('dragover', e => {
  const area = e.target.closest('.cards-area');
  if (!area || !drag) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';

  area.classList.add('drag-over');

  // Place drop indicator
  document.querySelectorAll('.drop-indicator').forEach(el => el.remove());
  const idx = getDropIndex(e, area);
  const cards = [...area.querySelectorAll('.card:not(.dragging)')];
  const indicator = document.createElement('div');
  indicator.className = 'drop-indicator';
  if (idx < cards.length) {
    area.insertBefore(indicator, cards[idx]);
  } else {
    area.appendChild(indicator);
  }
});

document.addEventListener('dragleave', e => {
  const area = e.target.closest('.cards-area');
  if (!area) return;
  if (!area.contains(e.relatedTarget)) {
    area.classList.remove('drag-over');
    area.querySelectorAll('.drop-indicator').forEach(el => el.remove());
  }
});

document.addEventListener('drop', e => {
  e.preventDefault();
  if (!drag) return;
  const area = e.target.closest('.cards-area');
  if (!area) return;

  const toCol = area.id.replace('cards-', '');
  const idx   = getDropIndex(e, area);
  const card  = data[drag.fromCol].find(c => c.id === drag.id);
  if (!card) return;

  data[drag.fromCol] = data[drag.fromCol].filter(c => c.id !== drag.id);
  data[toCol].splice(idx, 0, card);

  saveData(); renderBoard();
});

// ── Click events ──────────────────────────────────────────

document.addEventListener('click', e => {
  // Sort buttons
  const sortBtn = e.target.closest('[data-sort-col]');
  if (sortBtn) {
    sortCol(sortBtn.dataset.sortCol, sortBtn.dataset.sortBy);
    return;
  }

  // Add card
  const addBtn = e.target.closest('.btn-add-card');
  if (addBtn) { openModal(addBtn.dataset.col); return; }

  // Card actions
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
  if (e.key === 'Escape' && !document.getElementById('modal-overlay').hidden) closeModal();
});

// ── Init ──────────────────────────────────────────────────

loadData();
renderBoard();
