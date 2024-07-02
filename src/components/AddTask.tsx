import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { addTask } from '../features/tasksSlice';
import { fetchCategories } from '../features/categoriesSlice';

// React.FC includes the children prop, and it provides type checking for the props.
const AddTask: React.FC = () => {
  // Local state variables for task details
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Initialize the dispatch function for dispatching actions and sending to the Redux store. 
  const dispatch = useDispatch<AppDispatch>();
  
  // useSelector to access the Redux store state
  const user = useSelector((state: RootState) => state.user.user);
  const categories = useSelector((state: RootState) => state.categories.categories);
  const loading = useSelector((state: RootState) => state.categories.loading);

  // useEffect hook to fetch categories when the component mounts and user changes
  useEffect(() => {
    if (user) {
      dispatch(fetchCategories());
    }
  }, [dispatch, user]);

  // Function to handle form submission for adding a new task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const task = {
        user_id: user.id, // Set the user ID from the logged-in user
        title,
        category,
        due_date: dueDate,
      };
      // Dispatch the addTask action to add the task to the store
      await dispatch(addTask(task));
      // Clear the input fields after task is added
      setTitle('');
      setCategory('');
      setDueDate('');
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



