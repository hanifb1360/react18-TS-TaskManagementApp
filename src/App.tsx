import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './app/store';
import { fetchUser } from './features/userSlice';
import { fetchTasks } from './features/tasksSlice';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';
import { supabase } from './supabaseClient';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchTasks());
    }
  }, [user, dispatch]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    dispatch(fetchUser()); // Fetch user again to update state
  };

  return (
    <div className="App">
      {user ? (
        <>
          <button onClick={handleSignOut}>Sign Out</button>
          <AddTask />
          <TaskList />
        </>
      ) : (
        <>
          <SignUp />
          <SignIn />
        </>
      )}
    </div>
  );
};

export default App;
