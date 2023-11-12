const express = require('express');
const { join, resolve } = require('path');
const taskService = require('./service')(
  join(resolve(__dirname), 'tasks.json')
);

const PORT = process.env.PORT || 8080;

express()
  .use(express.static(join(resolve('..'), 'client')))
  .use(express.json())
  .get('/tasks', (request, response) => {
    const tasksByStatus = taskService.getTasksByStatus();
    if (tasksByStatus && Object.keys(tasksByStatus).length > 0) {
      response.json(tasksByStatus);
    } else {
      response.status(204).send();
    }
  })
  .put('/tasks', (request, response) => {
    const { task, oldStatus, newStatus } = request.query;

    if (task && oldStatus && newStatus) {
      const success = taskService.changeTaskStatus(task, oldStatus, newStatus);

      if (success) {
        response.status(204).send();
      } else {
        response.status(404).send('Task not found or invalid status.');
      }
    } else {
      response.status(400).send('Invalid parameters.');
    }
  })
  .listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
