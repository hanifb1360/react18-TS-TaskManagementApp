import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from '../features/tasksSlice';
import userReducer from '../features/userSlice';
import categoriesReducer from '../features/categoriesSlice';
import listsReducer from '../features/listsSlice';
import listItemsReducer from '../features/listItemsSlice';
import collaboratorsReducer from '../features/collaboratorsSlice'; // Import the collaborators slice

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    user: userReducer,
    categories: categoriesReducer,
    lists: listsReducer,
    listItems: listItemsReducer,
    collaborators: collaboratorsReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

