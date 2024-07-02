import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';

interface UserState {
  user: {
    id: string;
    email: string;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

export const fetchUser = createAsyncThunk<
  { id: string; email: string },
  void,
  { rejectValue: string }
>(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return rejectWithValue('User not found');
    }
    const user = data.user;
    return {
      id: user.id,
      email: user.email || '',
    };
  }
);

export const updateUserProfile = createAsyncThunk<
  { id: string; email: string },
  { email: string; password?: string },
  { rejectValue: string }
>(
  'user/updateUserProfile',
  async (profile, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return rejectWithValue('User not authenticated');

    const updates: { email: string; password?: string } = {
      email: profile.email,
    };
    if (profile.password) {
      updates.password = profile.password;
    }

    const { error: updateError } = await supabase.auth.updateUser(updates);

    if (updateError) {
      return rejectWithValue(updateError.message);
    }

    return {
      id: data.user.id,
      email: profile.email,
    };
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserState: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload as string;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUserState } = userSlice.actions;

export default userSlice.reducer;




