import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { fetchCategories } from '../features/categoriesSlice';
import { updateTask } from '../features/tasksSlice';
import { FaMinus, FaCheck, FaTimes, FaEdit } from 'react-icons/fa'; // Import the icons

interface TaskDetailsModalProps {
  task: any;
  onClose: () => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector((state: RootState) => state.categories.categories);
  const [newComment, setNewComment] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editCategory, setEditCategory] = useState(task.category);
  const [editDueDate, setEditDueDate] = useState(task.due_date);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [comments, setComments] = useState(task.comments || []);

  useEffect(() => {
    setEditTitle(task.title);
    setEditCategory(task.category);
    setEditDueDate(task.due_date);
    setEditPriority(task.priority);
    setComments(task.comments || []);
    dispatch(fetchCategories()); // Fetch categories when the modal is opened
  }, [task, dispatch]);

  const handleAddComment = async () => {
    const updatedComments = [...comments, newComment];
    await dispatch(updateTask({ id: task.id, comments: updatedComments }));
    setComments(updatedComments);
    setNewComment('');
  };

  const handleDeleteComment = async (index: number) => {
    const updatedComments = comments.filter((_: string, i: number) => i !== index);
    await dispatch(updateTask({ id: task.id, comments: updatedComments }));
    setComments(updatedComments);
  };

  const handleSaveChanges = async () => {
    const updatedTask = {
      ...task, // Spread the task object to create a shallow copy
      title: editTitle,
      category: editCategory,
      due_date: editDueDate,
      priority: editPriority,
    };

    await dispatch(updateTask(updatedTask));
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>
        {editMode ? (
          <>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
              placeholder="Title"
            />
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{task.title}</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setEditMode(true)}
              >
                <FaEdit size={20} />
              </button>
            </div>
            <p className="mb-2"><strong>Category:</strong> {task.category}</p>
            <p className="mb-2"><strong>Due Date:</strong> {task.due_date}</p>
            <p className="mb-2"><strong>Priority:</strong> {task.priority}</p>
          </>
        )}
        <hr className="my-4" />
        <h3 className="text-xl font-bold mb-2">Comments</h3>
        <div className="mb-4 max-h-40 overflow-y-auto">
          {comments.map((comment: string, index: number) => (
            <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2">
              <p>{comment}</p>
              <button className="text-red-500 hover:underline" onClick={() => handleDeleteComment(index)}>
                <FaMinus />
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center mb-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            className="text-green-500 hover:text-green-700 ml-2"
            onClick={handleAddComment}
          >
            <FaCheck size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;

