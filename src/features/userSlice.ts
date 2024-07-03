import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';

// Define the shape of the user state
interface UserState {
  user: {
    id: string;
    email: string;
  } | null; // The user can be null if not logged in
  loading: boolean;
  error: string | null; // Error message if any
}

// Initial state for the user slice
const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

// Async thunk for fetching the current user
export const fetchUser = createAsyncThunk<
  { id: string; email: string },
  void,
  { rejectValue: string }
>(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    // Call Supabase to get the current user
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return rejectWithValue('User not found');
    }
    const user = data.user;
    // Return the user data
    return {
      id: user.id,
      email: user.email || '',
    };
  }
);

// Async thunk for updating the user profile (email and password)
export const updateUserProfile = createAsyncThunk<
  { id: string; email: string },
  { email: string; password?: string },
  { rejectValue: string }
>(
  'user/updateUserProfile',
  async (profile, { rejectWithValue }) => {
    // Call Supabase to get the current user
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return rejectWithValue('User not authenticated');

    // Prepare the updates object
    const updates: { email: string; password?: string } = {
      email: profile.email,
    };
    if (profile.password) {
      updates.password = profile.password;
    }

    // Call Supabase to update the user
    const { error: updateError } = await supabase.auth.updateUser(updates);

    if (updateError) {
      return rejectWithValue(updateError.message);
    }

    // Return the updated user data
    return {
      id: data.user.id,
      email: profile.email,
    };
  }
);

// Create the user slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Action to clear the user state (e.g., on sign-out)
    clearUserState: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle pending state for fetchUser
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      // Handle fulfilled state for fetchUser
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      // Handle rejected state for fetchUser
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload as string;
      })
      // Handle pending state for updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      // Handle fulfilled state for updateUserProfile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      // Handle rejected state for updateUserProfile
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export the clearUserState action
export const { clearUserState } = userSlice.actions;

// Export the user reducer as the default export
export default userSlice.reducer;



