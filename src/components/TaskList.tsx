import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  due_date: string;
  priority: string;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error fetching user', userError);
        return;
      }
      if (!user) return;

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Fetch tasks failed', error);
      } else {
        setTasks(data || []);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Task List</h1>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <span>{task.title}</span>
            <span>{task.category}</span>
            <span>{task.due_date}</span>
            <span>{task.priority}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;

