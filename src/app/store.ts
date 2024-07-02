
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from '../features/tasksSlice';
import userReducer from '../features/userSlice';
import categoriesReducer from '../features/categoriesSlice';

// Configuring the Redux store by combining the tasks, user, and categories reducers.
// The configureStore function automatically sets up the store with good default settings.
const store = configureStore({
  reducer: {
    
    tasks: tasksReducer,
    user: userReducer,
    categories: categoriesReducer,
  },
});

// Type definition for the root state of the Redux store.
// This helps in providing type safety and autocompletion in TypeScript.
export type RootState = ReturnType<typeof store.getState>;

// Type definition for the dispatch function of the Redux store.
// This helps in providing type safety and autocompletion when dispatching actions.
export type AppDispatch = typeof store.dispatch;

// Exporting the configured Redux store as the default export.
// This store will be provided to the React application using the Provider component.
export default store;

