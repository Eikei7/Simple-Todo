document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    const apiUrl = 'http://localhost:3000/tasks';

    // Fetch and display tasks
    const fetchTasks = async () => {
        const response = await fetch(apiUrl);
        const tasks = await response.json();
        taskList.innerHTML = '';
        tasks.forEach(task => addTaskToDOM(task));
    };

    // Add task to the DOM
    const addTaskToDOM = (task) => {
        const li = document.createElement('li');
        li.className = `task${task.completed ? ' completed' : ''}`;
        li.dataset.id = task.id;

        const span = document.createElement('span');
        span.className = 'text';
        span.textContent = task.text;

        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.onclick = () => completeTask(task.id);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteTask(task.id);

        li.appendChild(span);
        li.appendChild(completeButton);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    };

    // Add new task
    taskForm.onsubmit = async (e) => {
        e.preventDefault();
        const taskText = taskInput.value;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: taskText })
        });
        const newTask = await response.json();
        addTaskToDOM(newTask);
        taskInput.value = '';
    };

    // Complete a task
    const completeTask = async (taskId) => {
        await fetch(`${apiUrl}/${taskId}`, { method: 'PUT' });
        fetchTasks();
    };

    // Delete a task
    const deleteTask = async (taskId) => {
        await fetch(`${apiUrl}/${taskId}`, { method: 'DELETE' });
        fetchTasks();
    };

    // Initial fetch of tasks
    fetchTasks();
});
