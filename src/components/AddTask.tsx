import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const AddTask: React.FC = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Error fetching user', userError);
      return;
    }
    if (!user) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title, category, due_date: dueDate, priority, user_id: user.id }]);

    if (error) {
      console.error('Add task failed', error);
    } else {
      console.log('Task added', data);
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
