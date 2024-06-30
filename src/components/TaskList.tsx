import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { updateTask, deleteTask } from '../features/tasksSlice';

const TaskList: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const loading = useSelector((state: RootState) => state.tasks.loading);
  const dispatch = useDispatch<AppDispatch>();
  const [editTaskId, setEditTaskId] = useState<string | undefined>(undefined);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editPriority, setEditPriority] = useState('');
  const [newComment, setNewComment] = useState('');

  const handleEdit = (task: any) => {
    setEditTaskId(task.id);
    setEditTitle(task.title);
    setEditCategory(task.category);
    setEditDueDate(task.due_date);
    setEditPriority(task.priority);
  };

  const handleUpdate = () => {
    if (editTaskId) {
      dispatch(updateTask({ id: editTaskId, title: editTitle, category: editCategory, due_date: editDueDate, priority: editPriority }));
      setEditTaskId(undefined);
    }
  };

  const handleDelete = (taskId: string) => {
    dispatch(deleteTask(taskId));
  };

  const handleAddComment = (task: any) => {
    const updatedComments = [...(task.comments || []), newComment];
    dispatch(updateTask({ id: task.id, comments: updatedComments }));
    setNewComment('');
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Task List</h1>
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length > 0 ? (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Category</th>
              <th className="py-2 px-4 border-b">Due Date</th>
              <th className="py-2 px-4 border-b">Priority</th>
              <th className="py-2 px-4 border-b">Comments</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td className="py-2 px-4 border-b">
                  {editTaskId === task.id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  ) : (
                    task.title
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  {editTaskId === task.id ? (
                    <input
                      type="text"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  ) : (
                    task.category
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  {editTaskId === task.id ? (
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  ) : (
                    task.due_date
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  {editTaskId === task.id ? (
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  ) : (
                    task.priority
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  {task.comments?.map((comment, index) => (
                    <p key={index}>{comment}</p>
                  ))}
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mt-2"
                    onClick={() => handleAddComment(task)}
                  >
                    Add Comment
                  </button>
                </td>
                <td className="py-2 px-4 border-b">
                  {editTaskId === task.id ? (
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                      onClick={handleUpdate}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
                      onClick={() => handleEdit(task)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tasks found.</p>
      )}
    </div>
  );
};

export default TaskList;

