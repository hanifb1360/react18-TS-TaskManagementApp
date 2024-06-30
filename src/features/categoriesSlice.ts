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

export const fetchCategories = createAsyncThunk<Category[], void, { rejectValue: string }>(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) return rejectWithValue(userError.message);
    if (!user) return rejectWithValue('User not authenticated');

    const { data, error } = await supabase.from('categories').select('*').eq('user_id', user.id);
    if (error || !data) return rejectWithValue(error?.message || 'Error fetching categories');

    return data;
  }
);

export const addCategory = createAsyncThunk<Category, string, { rejectValue: string }>(
  'categories/addCategory',
  async (name, { rejectWithValue }) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) return rejectWithValue(userError.message);
    if (!user) return rejectWithValue('User not authenticated');

    const { data, error } = await supabase.from('categories').insert([{ name, user_id: user.id }]).select();
    if (error || !data) return rejectWithValue(error?.message || 'Error adding category');

    return data[0];
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.categories.push(action.payload);
        state.loading = false;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default categoriesSlice.reducer;
