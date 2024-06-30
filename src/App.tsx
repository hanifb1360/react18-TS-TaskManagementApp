import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './app/store';
import { fetchUser } from './features/userSlice';
import { fetchTasks } from './features/tasksSlice';
import { fetchCategories } from './features/categoriesSlice';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';
import ManageCategories from './components/ManageCategories';
import Navbar from './components/Navbar';
import UserProfile from './components/UserProfile';
import { supabase } from './supabaseClient';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const [isSignUp, setIsSignUp] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchTasks());
      dispatch(fetchCategories());
    }
  }, [user, dispatch]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    dispatch({ type: 'user/signOut' });
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 pt-16 pb-4" style={{ paddingLeft: '5%', paddingRight: '5%' }}>
      {user ? (
        <>
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} handleSignOut={handleSignOut} />
          <div className="w-full max-w-2xl p-4 bg-white rounded shadow-md mb-4">
            {activeTab === 'tasks' && <TaskList />}
            {activeTab === 'add' && <AddTask />}
            {activeTab === 'categories' && <ManageCategories />}
            {activeTab === 'profile' && <UserProfile />}
          </div>
        </>
      ) : (
        <div className="w-full max-w-2xl p-4 bg-white rounded shadow-md">
          {isSignUp ? (
            <>
              <SignUp />
              <p className="mt-4 text-center">
                Already have an account?{" "}
                <button
                  className="text-blue-500 hover:underline"
                  onClick={toggleForm}
                >
                  Sign In
                </button>
              </p>
            </>
          ) : (
            <>
              <SignIn />
              <p className="mt-4 text-center">
                Don't have an account?{" "}
                <button
                  className="text-blue-500 hover:underline"
                  onClick={toggleForm}
                >
                  Sign Up
                </button>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
