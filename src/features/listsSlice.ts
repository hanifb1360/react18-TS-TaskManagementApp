import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';

interface List {
  id: string;
  name: string;
  owner_id: string;
}

interface User {
  id: string;
  email: string;
}

interface ListsState {
  lists: List[];
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: ListsState = {
  lists: [],
  users: [],
  loading: false,
  error: null,
};

export const fetchLists = createAsyncThunk<List[], void, { rejectValue: string }>(
  'lists/fetchLists',
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase.from('lists').select('*');
    if (error) return rejectWithValue(error.message);
    return data;
  }
);

export const addList = createAsyncThunk<List, string, { rejectValue: string }>(
  'lists/addList',
  async (name, { rejectWithValue }) => {
    const { data, error } = await supabase.from('lists').insert({ name }).select();
    if (error) return rejectWithValue(error.message);
    return data[0];
  }
);

export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  'lists/fetchUsers',
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) return rejectWithValue(error.message);
    return data;
  }
);

export const addCollaborator = createAsyncThunk<void, { listId: string; email: string }, { rejectValue: string }>(
  'lists/addCollaborator',
  async ({ listId, email }, { rejectWithValue }) => {
    const { data, error } = await supabase.from('users').select('*').eq('email', email);
    if (error || data.length === 0) return rejectWithValue('User not found');

    const userId = data[0].id;
    const { error: insertError } = await supabase.from('list_collaborators').insert({ list_id: listId, user_id: userId });
    if (insertError) return rejectWithValue(insertError.message);
  }
);

const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLists.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLists.fulfilled, (state, action: PayloadAction<List[]>) => {
        state.lists = action.payload;
        state.loading = false;
      })
      .addCase(fetchLists.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(addList.fulfilled, (state, action: PayloadAction<List>) => {
        state.lists.push(action.payload);
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(addCollaborator.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default listsSlice.reducer;


