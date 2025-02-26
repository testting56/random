class Task {
    constructor(id, name, completed = false) {
        this.id = id;
        this.name = name;
        this.completed = completed;
    }

    toggleCompletion() {
        this.completed = !this.completed;
    }
}

class TodoList {
    constructor() {
        this.tasks = this.loadTasks();
    }

    loadTasks() {
        const tasksJSON = localStorage.getItem('tasks');
        if (tasksJSON) {
            const tasksArray = JSON.parse(tasksJSON);
            return tasksArray.map(taskData => new Task(taskData.id, taskData.name, taskData.completed));
        }
        return [];
    }

    saveTasks() {
        const tasksJSON = JSON.stringify(this.tasks);
        localStorage.setItem('tasks', tasksJSON);
    }

    addTask(name) {
        const id = Date.now(); 
        const newTask = new Task(id, name);
        this.tasks.push(newTask);
        this.saveTasks();
    }

    editTask(id, newName) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.name = newName;
            this.saveTasks();
        }
    }

    toggleTaskCompletion(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.toggleCompletion();
            this.saveTasks();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
    }

    getTasks() {
        return this.tasks;
    }

    getTasksByStatus(completed) {
        return this.tasks.filter(task => task.completed === completed);
    }
}

class TodoApp {
    constructor() {
        this.todoList = new TodoList();
        this.init();
    }

    init() {
        this.displayTasks();
        this.attachEventListeners();
    }

    displayTasks() {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';

        const tasks = this.todoList.getTasks();
        tasks.forEach(task => {
            const taskElement = document.createElement('li');
            taskElement.setAttribute('data-id', task.id);
            taskElement.classList.add(task.completed ? 'completed' : 'pending');
            taskElement.innerHTML = `
                <span>${task.name}</span>
                <button class="toggle">Toggle</button>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            `;
            taskList.appendChild(taskElement);
        });
    }

    attachEventListeners() {
        document.getElementById('add-task-btn').addEventListener('click', () => this.addTask());
        document.getElementById('task-list').addEventListener('click', (event) => this.handleTaskClick(event));
    }

    addTask() {
        const taskName = document.getElementById('task-name').value;
        if (taskName) {
            this.todoList.addTask(taskName);
            this.displayTasks();
            document.getElementById('task-name').value = '';
        }
    }

    handleTaskClick(event) {
        const taskElement = event.target.closest('li');
        const taskId = parseInt(taskElement.getAttribute('data-id'));

        if (event.target.classList.contains('toggle')) {
            this.todoList.toggleTaskCompletion(taskId);
            this.displayTasks();
        }

        if (event.target.classList.contains('edit')) {
            const newName = prompt('Edit Task:', taskElement.querySelector('span').textContent);
            if (newName) {
                this.todoList.editTask(taskId, newName);
                this.displayTasks();
            }
        }

        if (event.target.classList.contains('delete')) {
            if (confirm('Are you sure you want to delete this task?')) {
                this.todoList.deleteTask(taskId);
                this.displayTasks();
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new TodoApp());
