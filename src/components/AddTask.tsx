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
    <form onSubmit={handleAddTask}>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
      <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="">Select Priority</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
};

export default AddTask;
