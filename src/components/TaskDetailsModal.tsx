import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { updateTask } from '../features/tasksSlice';
import { fetchLists } from '../features/listsSlice';
import { fetchListItems, addListItem } from '../features/listItemsSlice';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';

interface TaskDetailsModalProps {
  task: any;
  onClose: () => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const lists = useSelector((state: RootState) => state.lists.lists);
  const listItems = useSelector((state: RootState) => state.listItems.items);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editCategory, setEditCategory] = useState(task.category);
  const [editDueDate, setEditDueDate] = useState(task.due_date);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [selectedList, setSelectedList] = useState('');

  useEffect(() => {
    dispatch(fetchLists());
    dispatch(fetchListItems(task.id));
  }, [dispatch, task.id]);

  const handleSaveChanges = async () => {
    const updatedTask = {
      ...task,
      title: editTitle,
      category: editCategory,
      due_date: editDueDate,
      priority: editPriority,
    };
    await dispatch(updateTask(updatedTask));
    setEditMode(false);
  };

  const handleAddToList = async () => {
    if (selectedList) {
      await dispatch(addListItem({ listId: selectedList, taskId: task.id, title: task.title }));
    }
  };

  const relatedLists = lists.filter(list => listItems.some(item => item.list_id === list.id && item.title === task.title));

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
              <FaSave className="inline-block mr-2" />
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
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="list">
            Add to List
          </label>
          <select
            id="list"
            value={selectedList}
            onChange={(e) => setSelectedList(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
          >
            <option value="">Select List</option>
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
        {relatedLists.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xl font-bold">Related Lists</h3>
            <ul className="list-disc list-inside">
              {relatedLists.map(list => (
                <li key={list.id} className="py-2 px-4 border-b border-gray-300">
                  {list.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetailsModal;

