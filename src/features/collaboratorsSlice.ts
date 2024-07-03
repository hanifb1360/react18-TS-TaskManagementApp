import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';

interface Collaborator {
  id: string;
  list_id: string;
  email: string;
}

interface CollaboratorsState {
  collaborators: Collaborator[];
  loading: boolean;
  error: string | null;
}

const initialState: CollaboratorsState = {
  collaborators: [],
  loading: false,
  error: null,
};

export const fetchCollaborators = createAsyncThunk<Collaborator[], string, { rejectValue: string }>(
  'collaborators/fetchCollaborators',
  async (listId, { rejectWithValue }) => {
    const { data, error } = await supabase.from('list_collaborators').select('*').eq('list_id', listId);
    if (error) return rejectWithValue(error.message);
    return data;
  }
);

export const addCollaborator = createAsyncThunk<Collaborator, { listId: string; email: string }, { rejectValue: string }>(
  'collaborators/addCollaborator',
  async ({ listId, email }, { rejectWithValue }) => {
    const { data, error } = await supabase.from('list_collaborators').insert([{ list_id: listId, email }]).select();
    if (error) return rejectWithValue(error.message);
    return data[0];
  }
);

const collaboratorsSlice = createSlice({
  name: 'collaborators',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollaborators.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCollaborators.fulfilled, (state, action: PayloadAction<Collaborator[]>) => {
        state.collaborators = action.payload;
        state.loading = false;
      })
      .addCase(fetchCollaborators.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(addCollaborator.fulfilled, (state, action: PayloadAction<Collaborator>) => {
        state.collaborators.push(action.payload);
      });
  },
});

export default collaboratorsSlice.reducer;
export {};

