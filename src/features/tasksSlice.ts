import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';

interface Task {
  id: string;
  title: string;
  category: string;
  due_date: string;
  priority: string;
  completed: boolean;
  comments: string[];
}

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

const fetchTasks = createAsyncThunk<Task[], void, { rejectValue: string }>(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase.from('tasks').select('*');
    if (error) return rejectWithValue(error.message);
    return data || [];
  }
);

const addTask = createAsyncThunk<Task, Partial<Task>, { rejectValue: string }>(
  'tasks/addTask',
  async (task, { rejectWithValue }) => {
    const { data, error } = await supabase.from('tasks').insert(task).select();
    if (error) return rejectWithValue(error.message);
    return data[0];
  }
);

const updateTask = createAsyncThunk<Task, Partial<Task>, { rejectValue: string }>(
  'tasks/updateTask',
  async (task, { rejectWithValue }) => {
    const { data, error } = await supabase.from('tasks').update(task).eq('id', task.id).select();
    if (error) return rejectWithValue(error.message);
    return data[0];
  }
);

const updateTaskCompletion = createAsyncThunk<Task, { id: string; completed: boolean }, { rejectValue: string }>(
  'tasks/updateTaskCompletion',
  async ({ id, completed }, { rejectWithValue }) => {
    const { data, error } = await supabase.from('tasks').update({ completed }).eq('id', id).select();
    if (error || !data) return rejectWithValue(error?.message || 'Error updating task completion');
    return data[0];
  }
);

const deleteTask = createAsyncThunk<string, string, { rejectValue: string }>(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) return rejectWithValue(error.message);
    return id;
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTaskCompletion.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index].completed = action.payload.completed;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;
export { fetchTasks, addTask, updateTask, updateTaskCompletion, deleteTask };
