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

    const { data, error } = await supabase.from('tasks').insert([task]);
    if (error || !data) return rejectWithValue(error?.message || 'Error adding task');

    return data[0];
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
      });
  },
});

export default tasksSlice.reducer;

