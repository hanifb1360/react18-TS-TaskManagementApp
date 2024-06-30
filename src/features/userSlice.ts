import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';

interface UserState {
  user: {
    id: string;
    email: string;
    name: string;
    avatarUrl: string;
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
  { id: string; email: string; name: string; avatarUrl: string },
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
      name: user.user_metadata?.name || '',
      avatarUrl: user.user_metadata?.avatarUrl || '',
    };
  }
);

export const updateUserProfile = createAsyncThunk<
  { id: string; email: string; name: string; avatarUrl: string },
  { email: string; name: string; password: string; avatarUrl: string },
  { rejectValue: string }
>(
  'user/updateUserProfile',
  async (profile, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return rejectWithValue('User not authenticated');

    const updates = {
      email: profile.email,
      password: profile.password || undefined,
      data: {
        name: profile.name,
        avatarUrl: profile.avatarUrl,
      },
    };

    const { error: updateError } = await supabase.auth.updateUser(updates);

    if (updateError) {
      return rejectWithValue(updateError.message);
    }

    return {
      id: data.user.id,
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
    };
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
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

export default userSlice.reducer;
