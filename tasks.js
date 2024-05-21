const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'tasks.json');

// Load tasks from file
const loadTasks = () => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (e) {
        return [];
    }
};

// Save tasks to file
const saveTasks = (tasks) => {
    const dataJSON = JSON.stringify(tasks);
    fs.writeFileSync(filePath, dataJSON);
};

let tasks = loadTasks();

app.post('/tasks', (req, res) => {
    const task = { id: Date.now(), text: req.body.text, completed: false };
    tasks.push(task);
    saveTasks(tasks);
    res.status(201).json(task);
});
