const express = require('express'); 
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));    // Serve static files from the public directory

let tasks = [];

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const task = { id: Date.now(), text: req.body.text, completed: false }; // Create a new task object
    tasks.push(task);
    res.status(201).json(task);
});

app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id); // Convert the id to a number
    const task = tasks.find(t => t.id === taskId);  // Find the task with the given id
    if (task) {
        task.completed = true;
        res.json(task);
    } else {
        res.status(404).send('Task not found'); // If the task is not found, return a 404 status code
    }
});

app.delete('/tasks/:id', (req, res) => {
    tasks = tasks.filter(t => t.id !== parseInt(req.params.id)); // Filter out the task with the given id
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`To-Do app listening at http://localhost:${port}`); // Log a message when the server is started
});
