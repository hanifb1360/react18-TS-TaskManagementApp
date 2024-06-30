import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../app/store';
import { updateTask } from '../features/tasksSlice';

interface TaskDetailsModalProps {
  task: any;
  onClose: () => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [newComment, setNewComment] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editCategory, setEditCategory] = useState(task.category);
  const [editDueDate, setEditDueDate] = useState(task.due_date);
  const [editPriority, setEditPriority] = useState(task.priority);

  const handleAddComment = () => {
    const updatedComments = [...(task.comments || []), newComment];
    dispatch(updateTask({ id: task.id, comments: updatedComments }));
    setNewComment('');
  };

  const handleSaveChanges = () => {
    dispatch(updateTask({
      id: task.id,
      title: editTitle,
      category: editCategory,
      due_date: editDueDate,
      priority: editPriority,
    }));
    setEditMode(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        {editMode ? (
          <>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <input
              type="text"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <button
              className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2"
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">{task.title}</h2>
            <p className="mb-2"><strong>Category:</strong> {task.category}</p>
            <p className="mb-2"><strong>Due Date:</strong> {task.due_date}</p>
            <p className="mb-2"><strong>Priority:</strong> {task.priority}</p>
            <button
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
              onClick={() => setEditMode(true)}
            >
              Edit Task
            </button>
          </>
        )}
        <h3 className="text-xl font-bold mb-2">Comments</h3>
        <div className="mb-4 max-h-40 overflow-y-auto">
          {task.comments?.map((comment: string, index: number) => (
            <p key={index} className="bg-gray-100 p-2 rounded mb-2">{comment}</p>
          ))}
        </div>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
        <button
          className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2"
          onClick={handleAddComment}
        >
          Add Comment
        </button>
        <button
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TaskDetailsModal;


