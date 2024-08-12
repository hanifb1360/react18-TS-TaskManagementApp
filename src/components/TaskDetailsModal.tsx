import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { updateTask } from '../features/tasksSlice';
import { fetchLists } from '../features/listsSlice';
import { fetchListItemsByTaskId, addListItem } from '../features/listItemsSlice';
import { FaEdit, FaTimes } from 'react-icons/fa';

interface TaskDetailsModalProps {
  task: any;
  onClose: () => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const lists = useSelector((state: RootState) => state.lists.lists);
  const listItems = useSelector((state: RootState) => state.listItems.items);
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editCategory, setEditCategory] = useState(task.category);
  const [editDueDate, setEditDueDate] = useState(task.due_date);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [comments, setComments] = useState<string[]>(task.comments || []);

  useEffect(() => {
    dispatch(fetchLists());
    dispatch(fetchListItemsByTaskId(task.id));
  }, [dispatch, task.id]);

  useEffect(() => {
    setEditTitle(task.title);
    setEditCategory(task.category);
    setEditDueDate(task.due_date);
    setEditPriority(task.priority);
    setComments(task.comments || []);
  }, [task]);

  const handleAddComment = async () => {
    const updatedComments = [...comments, newComment];
    await dispatch(updateTask({ id: task.id, comments: updatedComments }));
    setComments(updatedComments);
    setNewComment('');
  };

  const handleDeleteComment = async (index: number) => {
    const updatedComments = comments.filter((_, i: number) => i !== index);
    await dispatch(updateTask({ id: task.id, comments: updatedComments }));
    setComments(updatedComments);
  };

  const handleSaveChanges = async () => {
    const updatedTask = {
      ...task,
      title: editTitle,
      category: editCategory,
      due_date: editDueDate,
      priority: editPriority,
    };
    await dispatch(updateTask(updatedTask));
    onClose();
  };

  const handleAddToList = async () => {
    if (selectedList) {
      await dispatch(addListItem({ listId: selectedList, taskId: task.id, title: task.title }));
    }
  };

  const relatedList = lists.find(list => listItems.some(item => item.list_id === list.id));

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
            <input
              type="text"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
              placeholder="Category"
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
            {relatedList && <p className="mb-2"><strong>List:</strong> {relatedList.name}</p>}
          </>
        )}
        <hr className="my-4" />
        <h3 className="text-xl font-bold mb-2">Comments</h3>
        <div className="mb-4 max-h-40 overflow-y-auto">
          {comments.map((comment: string, index: number) => (
            <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2">
              <p>{comment}</p>
              <button className="text-red-500 hover:underline" onClick={() => handleDeleteComment(index)}>
                <FaTimes />
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
            <FaEdit size={20} />
          </button>
        </div>
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Add to List</label>
          <select
            value={selectedList || ''}
            onChange={(e) => setSelectedList(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
          >
            <option value="">Select a list</option>
            {lists.map((list) => (
              <option key={list.id} value={list.id}>{list.name}</option>
            ))}
          </select>
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddToList}
          >
            Add to List
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
