let tasks = [];
let editId = null;
let nextId = 1; // Biến để sinh ID tăng dần từ 1

function renderTable(filter = 'all') {
  const tbody = document.getElementById('task-table-body');
  tbody.innerHTML = '';
  let filteredTasks = tasks;

  if (filter === 'active') {
    filteredTasks = tasks.filter(task => !task.isDone);
  } else if (filter === 'completed') {
    filteredTasks = tasks.filter(task => task.isDone);
  }

  filteredTasks.forEach(task => {
    const row = document.createElement('tr');
    row.setAttribute('data-id', task.id);
    row.innerHTML = `
      <td>${task.id}</td>
      <td class="${task.isDone ? 'completed' : ''}">${task.text}</td>
      <td>
        <select class="status-select" onchange="updateStatus(${task.id}, this.value)">
          <option value="false" ${!task.isDone ? 'selected' : ''}>Chưa hoàn thành</option>
          <option value="true" ${task.isDone ? 'selected' : ''}>Hoàn thành</option>
        </select>
      </td>
      <td class="action">
        <button class="edit" onclick="editTask(${task.id})">Sửa</button>
        <button class="delete" onclick="deleteTask(${task.id})">Xóa</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function saveTasksToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('nextId', nextId); // Lưu nextId vào localStorage
}

function loadTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem('tasks');
  const storedNextId = localStorage.getItem('nextId');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  }
  if (storedNextId) {
    nextId = parseInt(storedNextId);
  }
  renderTable();
}

function addTask() {
  const taskText = document.getElementById('task-text').value.trim();
  if (!taskText) {
    alert('Vui lòng nhập nội dung công việc!');
    return;
  }

  if (editId) {
    tasks = tasks.map(task => task.id === editId ? { ...task, text: taskText } : task);
    editId = null;
  } else {
    tasks.push({ id: nextId++, text: taskText, isDone: false });
  }

  saveTasksToLocalStorage();
  renderTable();
  document.getElementById('modal').style.display = 'none';
  document.getElementById('task-text').value = '';
}

function editTask(id) {
  editId = id;
  const task = tasks.find(task => task.id === id);
  document.getElementById('modal-title').textContent = 'Sửa Công Việc';
  document.getElementById('task-text').value = task.text;
  document.getElementById('modal').style.display = 'block';
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasksToLocalStorage();
  renderTable();
}

function updateStatus(id, status) {
  tasks = tasks.map(task => task.id === id ? { ...task, isDone: status === 'true' } : task);
  saveTasksToLocalStorage();
  renderTable();
}

function filterTasks(type) {
  renderTable(type);
}

document.querySelector('.add-btn').addEventListener('click', () => {
  editId = null;
  document.getElementById('modal-title').textContent = 'Thêm Công Việc';
  document.getElementById('task-text').value = '';
  document.getElementById('modal').style.display = 'block';
});

document.querySelector('.close').addEventListener('click', () => {
  document.getElementById('modal').style.display = 'none';
});

document.getElementById('cancel-btn').addEventListener('click', () => {
  document.getElementById('modal').style.display = 'none';
});

document.getElementById('save-btn').addEventListener('click', addTask);

document.getElementById('search-btn').addEventListener('click', () => {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(searchTerm));
  renderTable(filteredTasks);
});

document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);