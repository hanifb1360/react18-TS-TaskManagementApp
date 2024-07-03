import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { addTask } from '../features/tasksSlice';
import { fetchCategories } from '../features/categoriesSlice';
import { fetchLists } from '../features/listsSlice';
import { addListItem } from '../features/listItemsSlice';

const AddTask: React.FC = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [selectedList, setSelectedList] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const categories = useSelector((state: RootState) => state.categories.categories);
  const lists = useSelector((state: RootState) => state.lists.lists);
  const loading = useSelector((state: RootState) => state.categories.loading);

  useEffect(() => {
    if (user) {
      dispatch(fetchCategories());
      dispatch(fetchLists());
    }
  }, [dispatch, user]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const task = {
        user_id: user.id,
        title,
        category,
        due_date: dueDate,
        priority,
      };
      const result = await dispatch(addTask(task));
      const newTask = result.payload as { id: string; title: string };
      if (selectedList && newTask.id) {
        await dispatch(addListItem({ listId: selectedList, taskId: newTask.id, title: newTask.title }));
      }
      setTitle('');
      setCategory('');
      setDueDate('');
      setPriority('Medium');
      setSelectedList(null);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Add Task</h2>
      <form onSubmit={handleAddTask}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Task Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dueDate">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="list">
            Add to List
          </label>
          <select
            id="list"
            value={selectedList || ''}
            onChange={(e) => setSelectedList(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select a list</option>
            {lists.map((list) => (
              <option key={list.id} value={list.id}>{list.name}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 text-white font-bold rounded ${loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700'}`}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
};

export default AddTask;









