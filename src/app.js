import express from 'express';

const app = express();

app.use(express.json());

const tasks = [
  { id: 1, title: 'Buy milk', done: false },
  { id: 2, title: 'Write report', done: true },
  { id: 3, title: 'Call mom', done: false },
];

app.get('/describe', (req, res) => {
  return res.json({
    name: 'Describe API',
    version: '1.0',
    endpoints: '/health',
  });
});

app.get('/health', (req, res) => {
  return res.json({
    status: 'ok',
  });
});

app.get('/tasks', (req, res) => {
  return res.json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const taskId = Number(req.params.id);
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  return res.json(task);
});

app.post('/tasks', (req, res) => {
  const { title } = req.body || {};

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask = {
    id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
    title: title.trim(),
    done: false,
  };

  tasks.push(newTask);

  return res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
  const taskId = Number(req.params.id);
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  const { title, done } = req.body || {};
  const hasTitle = Object.prototype.hasOwnProperty.call(req.body || {}, 'title');
  const hasDone = Object.prototype.hasOwnProperty.call(req.body || {}, 'done');

  if (!hasTitle && !hasDone) {
    return res.status(400).json({ error: 'At least one field is required' });
  }

  if (hasTitle && (typeof title !== 'string' || title.trim() === '')) {
    return res.status(400).json({ error: 'Title must be a non-empty string' });
  }

  if (hasDone && typeof done !== 'boolean') {
    return res.status(400).json({ error: 'Done must be a boolean' });
  }

  if (hasTitle) {
    task.title = title.trim();
  }

  if (hasDone) {
    task.done = done;
  }

  return res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const taskId = Number(req.params.id);
  const taskIndex = tasks.findIndex((item) => item.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  tasks.splice(taskIndex, 1);

  return res.status(204).send();
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }

  return next(err);
});

export default app;