'use strict';

const express = require('express');
const app = express();
app.use(express.json());

const widgets = [
  { id: 123, name: 'Demo Widget' }
];

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/widgets', (req, res) => {
  res.json(widgets);
});

app.post('/widgets', (req, res) => {
  const nextId =
    widgets.length > 0
      ? Math.max(...widgets.map(w => w.id)) + 1
      : 1;
  const widget = { id: nextId, ...req.body };
  widgets.push(widget);
  res.status(201).json(widget);
});

app.get('/widgets/:id', (req, res) => {
  const w = widgets.find(x => x.id === Number(req.params.id));
  if (!w) return res.status(404).json({ error: 'not found' });
  res.json(w);
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`widget-service running on port ${PORT}`);
  });
}

module.exports = app;
