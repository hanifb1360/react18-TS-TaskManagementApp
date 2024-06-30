import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '../features/tasksSlice';
import { RootState, AppDispatch } from '../app/store';

const AddTask: React.FC = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const categories = useSelector((state: RootState) => state.categories.categories);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user) {
      dispatch(addTask({ title, category, due_date: dueDate, priority }));
      setTitle('');
      setCategory('');
      setDueDate('');
      setPriority('');
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Add Task</h1>
      <form onSubmit={handleAddTask} autoComplete="off" className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          autoComplete="off"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Select Category</option>
          {categories.map((cat: { name: string }, idx: number) => (
            <option key={idx} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Select Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTask;
