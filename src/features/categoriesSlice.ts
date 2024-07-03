import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';

interface Category {
  id: string;
  name: string;
  user_id: string;
}

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

// Async thunk for fetching categories
export const fetchCategories = createAsyncThunk<Category[], void, { rejectValue: string }>(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    // Get the current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) return rejectWithValue(userError.message);
    if (!user) return rejectWithValue('User not authenticated');

    // Fetch categories for the authenticated user
    const { data, error } = await supabase.from('categories').select('*').eq('user_id', user.id);
    if (error || !data) return rejectWithValue(error?.message || 'Error fetching categories');

    return data;
  }
);

// Async thunk for adding a new category
export const addCategory = createAsyncThunk<Category, string, { rejectValue: string }>(
  'categories/addCategory',
  async (name, { rejectWithValue }) => {
    // Get the current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) return rejectWithValue(userError.message);
    if (!user) return rejectWithValue('User not authenticated');

    // Add a new category for the authenticated user
    const { data, error } = await supabase.from('categories').insert([{ name, user_id: user.id }]).select();
    if (error || !data) return rejectWithValue(error?.message || 'Error adding category');

    return data[0];
  }
);

// Create the categories slice
const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle pending state for fetchCategories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle fulfilled state for fetchCategories
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.categories = action.payload;
        state.loading = false;
      })
      // Handle rejected state for fetchCategories
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle pending state for addCategory
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle fulfilled state for addCategory
      .addCase(addCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.categories.push(action.payload);
        state.loading = false;
      })
      // Handle rejected state for addCategory
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export the categories reducer as the default export
export default categoriesSlice.reducer;

