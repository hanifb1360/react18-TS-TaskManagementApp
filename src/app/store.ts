import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from '../features/tasksSlice';
import userReducer from '../features/userSlice';
import categoriesReducer from '../features/categoriesSlice';

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    user: userReducer,
    categories: categoriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
