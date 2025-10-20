const API_URL = 'http://localhost:3000/tasks';
        const taskForm = document.getElementById('task-form');
        const taskInput = document.getElementById('task-input');
        const taskList = document.getElementById('task-list');
        const errorContainer = document.getElementById('error-container');

        let tasks = [];

        const showError = (message) => {
            errorContainer.innerHTML = `<div class="error">${message}</div>`;
            setTimeout(() => {
                errorContainer.innerHTML = '';
            }, 5000);
        };

        const showLoading = () => {
            taskList.innerHTML = '<div class="loading">Loading tasks...</div>';
        };

        const fetchTasks = async () => {
            try {
                showLoading();
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error('Failed to load tasks');
                tasks = await response.json();
                renderTasks();
            } catch (error) {
                showError('Error loading tasks. Please refresh the page.');
                console.error('Fetch error:', error);
                taskList.innerHTML = '';
            }
        };

        const renderTasks = () => {
            if (tasks.length === 0) {
                taskList.innerHTML = '<div class="empty-state">No tasks yet. Add one to get started!</div>';
                return;
            }

            taskList.innerHTML = '';
            tasks.forEach(task => addTaskToDOM(task));
        };

        const addTaskToDOM = (task) => {
            const li = document.createElement('li');
            li.className = `task${task.completed ? ' completed' : ''}`;
            li.dataset.id = task.id;

            const span = document.createElement('span');
            span.className = 'text';
            span.textContent = task.text;

            const completeButton = document.createElement('button');
            completeButton.textContent = task.completed ? 'Undo' : 'Complete';
            completeButton.onclick = () => toggleTask(task.id);

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete';
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteTask(task.id);

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'task-actions';
            actionsDiv.appendChild(completeButton);
            actionsDiv.appendChild(deleteButton);

            li.appendChild(span);
            li.appendChild(actionsDiv);
            taskList.appendChild(li);
        };

        taskForm.onsubmit = async (e) => {
            e.preventDefault();
            const taskText = taskInput.value.trim();
            
            if (!taskText) {
                showError('Please enter a task.');
                return;
            }

            const submitButton = taskForm.querySelector('button');
            submitButton.disabled = true;

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: taskText })
                });
                if (!response.ok) throw new Error('Failed to add task');
                const newTask = await response.json();
                tasks.unshift(newTask);
                renderTasks();
                taskInput.value = '';
            } catch (error) {
                showError('Error adding task. Please try again.');
                console.error('Add task error:', error);
            } finally {
                submitButton.disabled = false;
            }
        };

        const toggleTask = async (taskId) => {
            try {
                const response = await fetch(`${API_URL}/${taskId}`, { method: 'PUT' });
                if (!response.ok) throw new Error('Failed to update task');
                const updatedTask = await response.json();
                const index = tasks.findIndex(t => t.id === taskId);
                if (index > -1) tasks[index] = updatedTask;
                renderTasks();
            } catch (error) {
                showError('Error updating task. Please try again.');
                console.error('Toggle task error:', error);
            }
        };

        const deleteTask = async (taskId) => {
            if (!confirm('Are you sure you want to delete this task?')) return;

            try {
                const response = await fetch(`${API_URL}/${taskId}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete task');
                tasks = tasks.filter(t => t.id !== taskId);
                renderTasks();
            } catch (error) {
                showError('Error deleting task. Please try again.');
                console.error('Delete task error:', error);
            }
        };

        fetchTasks();