import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

const TaskList: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const loading = useSelector((state: RootState) => state.tasks.loading);

  return (
    <div>
      <h1>Task List</h1>
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length > 0 ? (
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              <span>{task.title}</span>
              <span>{task.category}</span>
              <span>{task.due_date}</span>
              <span>{task.priority}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks found.</p>
      )}
    </div>
  );
};

export default TaskList;
