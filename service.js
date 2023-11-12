const { existsSync, readFileSync, writeFileSync } = require('fs');

module.exports = function (path) {
  class TaskService {
    constructor(filePath) {
      this.filePath = filePath;
    }

    getTasksByStatus() {
      return this.loadTasks();
    }

    changeTaskStatus(task, oldStatus, newStatus) {
      const tasks = this.loadTasks();

      if (tasks[oldStatus] && tasks[newStatus]) {
        const taskIndex = tasks[oldStatus].indexOf(task);

        if (taskIndex !== -1) {
          tasks[oldStatus].splice(taskIndex, 1);
          tasks[newStatus].push(task);
          this.saveTasks(tasks);
          return true;
        }
      }

      return false;
    }

    loadTasks() {
      if (existsSync(this.filePath)) {
        try {
          const fileContent = readFileSync(this.filePath, 'utf8');
          return JSON.parse(fileContent);
        } catch (error) {
          console.error('Error reading tasks file:', error);
        }
      }
      return {};
    }

    saveTasks(tasks) {
      try {
        writeFileSync(this.filePath, JSON.stringify(tasks, null, 2));
      } catch (error) {
        console.error('Error writing tasks file:', error);
      }
    }
  }

  return new TaskService(path);
};
