import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  due_date: string;
  priority: string;
  user_id: string;
  comments?: string[];
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

export const fetchTasks = createAsyncThunk<Task[], void, { rejectValue: string }>(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) return rejectWithValue(userError.message);
    if (!user) return rejectWithValue('User not authenticated');

    const { data, error } = await supabase.from('tasks').select('*').eq('user_id', user.id);
    if (error || !data) return rejectWithValue(error?.message || 'Error fetching tasks');

    return data;
  }
);

export const addTask = createAsyncThunk<Task, Partial<Task>, { rejectValue: string }>(
  'tasks/addTask',
  async (task, { rejectWithValue }) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) return rejectWithValue(userError.message);
    if (!user) return rejectWithValue('User not authenticated');

    task.user_id = user.id;

    const { data, error } = await supabase.from('tasks').insert([task]).select();
    if (error || !data) return rejectWithValue(error?.message || 'Error adding task');

    return data[0];
  }
);

export const updateTask = createAsyncThunk<Task, Partial<Task>, { rejectValue: string }>(
  'tasks/updateTask',
  async (task, { rejectWithValue }) => {
    if (!task.id) return rejectWithValue('Task ID is required');

    const { data, error } = await supabase.from('tasks').update(task).eq('id', task.id).select();
    if (error || !data) return rejectWithValue(error?.message || 'Error updating task');

    return data[0];
  }
);

export const deleteTask = createAsyncThunk<string, string, { rejectValue: string }>(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    if (error) return rejectWithValue(error.message);

    return taskId;
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
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
        state.loading = false;
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default tasksSlice.reducer;
