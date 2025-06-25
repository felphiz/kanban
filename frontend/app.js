const API_URL = 'http://localhost:3000/api/tasks';
const form = document.getElementById('form');
const nome = document.getElementById('nome');
const descricao = document.getElementById('descricao');
const status = document.getElementById('status');

const statusFlow = {
  'a fazer': 'em execução',
  'em execução': 'feito',
};

const statusBackFlow = {
  'feito': 'em execução',
  'em execução': 'a fazer',
};

// Normaliza o nome do status para o id da coluna no DOM
function getColumnId(status) {
  return status
    .toLowerCase()
    .replace(/\s/g, '-')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// Carrega todas as tarefas
async function loadTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();

  document.querySelectorAll('.col .card')?.forEach(el => el.remove());

  tasks.forEach(task => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.setAttribute('draggable', 'true');
    div.setAttribute('data-id', task._id);
    div.setAttribute('data-status', task.status);

    div.innerHTML = `
      <h3>${task.nome}</h3>
      <p>${task.descricao}</p>
      <small>${task.status}</small>
      <div>
        <button data-id="${task._id}" class="delete">Excluir</button>
        <button data-id="${task._id}" data-nome="${task.nome}" data-descricao="${task.descricao}" class="edit">Editar</button>
        ${task.status !== 'a fazer' ? `<button data-id="${task._id}" data-status="${task.status}" class="prev">Voltar</button>` : ''}
        ${task.status !== 'feito' ? `<button data-id="${task._id}" data-status="${task.status}" class="next">Avançar</button>` : ''}
      </div>`;

    // Eventos de Drag
    div.addEventListener('dragstart', handleDragStart);

    const columnId = getColumnId(task.status);
    const column = document.getElementById(columnId);
    if (column) {
      column.appendChild(div);
    }
  });
}

async function addTask(taskData) {
  await fetch(API_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(taskData),
  });
}

async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
}

async function updateTask(id, updateData) {
  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(updateData),
  });
}

// Eventos principais
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const taskData = {
    nome: nome.value,
    descricao: descricao.value,
    status: status.value,
  };
  await addTask(taskData);
  form.reset();
  loadTasks();
});

document.getElementById('kanban').addEventListener('click', async (e) => {
  const id = e.target.getAttribute('data-id');

  if (e.target.classList.contains('delete')) {
    await deleteTask(id);
    loadTasks();
  }

  if (e.target.classList.contains('next')) {
    const currentStatus = e.target.getAttribute('data-status');
    const newStatus = statusFlow[currentStatus];
    if (newStatus) {
      await updateTask(id, { status: newStatus });
      loadTasks();
    }
  }

  if (e.target.classList.contains('prev')) {
    const currentStatus = e.target.getAttribute('data-status');
    const newStatus = statusBackFlow[currentStatus];
    if (newStatus) {
      await updateTask(id, { status: newStatus });
      loadTasks();
    }
  }

  if (e.target.classList.contains('edit')) {
    const currentNome = e.target.getAttribute('data-nome');
    const currentDescricao = e.target.getAttribute('data-descricao');

    const novoNome = prompt('Editar Nome:', currentNome);
    const novaDescricao = prompt('Editar Descrição:', currentDescricao);

    if (novoNome !== null && novaDescricao !== null) {
      await updateTask(id, { nome: novoNome, descricao: novaDescricao });
      loadTasks();
    }
  }
});

// DRAG AND DROP IMPLEMENTAÇÃO

let draggedCard = null;

function handleDragStart(e) {
  draggedCard = e.target;
}

document.querySelectorAll('.col').forEach(coluna => {
  coluna.addEventListener('dragover', e => {
    e.preventDefault();
    coluna.style.backgroundColor = '#f1f3f5';
  });

  coluna.addEventListener('dragleave', e => {
    coluna.style.backgroundColor = '';
  });

  coluna.addEventListener('drop', async e => {
    e.preventDefault();
    coluna.style.backgroundColor = '';

    const newColumnId = coluna.id;
    const newStatus = coluna.querySelector('h2').innerText.toLowerCase();

    if (draggedCard && newColumnId !== getColumnId(draggedCard.dataset.status)) {
      const id = draggedCard.dataset.id;
      await updateTask(id, { status: newStatus });
      loadTasks();
    }
  });
});

loadTasks();
