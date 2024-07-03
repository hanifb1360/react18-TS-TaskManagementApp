import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';

interface ListItem {
  id: string;
  list_id: string;
  task_id: string;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface ListItemsState {
  items: ListItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ListItemsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchListItems = createAsyncThunk<ListItem[], string, { rejectValue: string }>(
  'listItems/fetchListItems',
  async (listId, { rejectWithValue }) => {
    const { data, error } = await supabase.from('list_items').select('*').eq('list_id', listId);
    if (error) return rejectWithValue(error.message);
    return data;
  }
);

export const addListItem = createAsyncThunk<ListItem, { listId: string; taskId: string; title: string }, { rejectValue: string }>(
  'listItems/addListItem',
  async ({ listId, taskId, title }, { rejectWithValue }) => {
    // Check for duplicate task in the list
    const { data: existingItems, error: checkError } = await supabase
      .from('list_items')
      .select('*')
      .eq('list_id', listId)
      .eq('task_id', taskId);

    if (checkError) return rejectWithValue(checkError.message);
    if (existingItems.length > 0) return rejectWithValue('Task already exists in the list');

    // Add task if not duplicate
    const { data, error } = await supabase.from('list_items').insert([{ list_id: listId, task_id: taskId, title }]).select();
    if (error) return rejectWithValue(error.message);
    return data[0];
  }
);

const listItemsSlice = createSlice({
  name: 'listItems',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchListItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchListItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchListItems.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(addListItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default listItemsSlice.reducer;











