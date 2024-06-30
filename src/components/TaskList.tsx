import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { deleteTask } from '../features/tasksSlice';
import TaskDetailsModal from './TaskDetailsModal';

const TaskList: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const loading = useSelector((state: RootState) => state.tasks.loading);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  const handleDelete = (taskId: string) => {
    dispatch(deleteTask(taskId));
  };

  const handleViewDetails = (task: any) => {
    setSelectedTask(task);
  };

  const closeModal = () => {
    setSelectedTask(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Task List</h1>
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Title</th>
                <th className="py-3 px-6 text-left">Due Date</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {tasks.map(task => (
                <tr key={task.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{task.title}</td>
                  <td className="py-3 px-6 text-left">{task.due_date}</td>
                  <td className="py-3 px-6 text-center flex justify-center space-x-4">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleViewDetails(task)}
                    >
                      View Details
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDelete(task.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No tasks found.</p>
      )}
      {selectedTask && <TaskDetailsModal task={selectedTask} onClose={closeModal} />}
    </div>
  );
};

export default TaskList;

