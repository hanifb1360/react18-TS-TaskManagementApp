import React, { useState } from 'react';
import './TaskList.css';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  category: string;
}

interface Category {
  id: number;
  name: string;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: 'Work' },
    { id: 2, name: 'Personal' },
    { id: 3, name: 'Shopping' }
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const addTask = () => {
    if (!newTaskTitle || !selectedCategory) return;

    const newTask: Task = {
      id: Date.now(),
      title: newTaskTitle,
      completed: false,
      category: selectedCategory
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setSelectedCategory('');
  };

  const toggleTaskStatus = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="task-list">
      <h1>Task List</h1>
      <input
        type="text"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        placeholder="New task title"
      />
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        {categories.map(category => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <span
              style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
              onClick={() => toggleTaskStatus(task.id)}
            >
              {task.title} - {task.category}
            </span>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
