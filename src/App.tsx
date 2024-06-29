import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';
import './styles.css';

const App: React.FC = () => {
  const [user, setUser] = useState<null | any>(null);
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user', error);
      } else {
        setUser(user);
      }
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <div className="App">
      {user ? (
        <>
          <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
          <AddTask />
          <TaskList />
        </>
      ) : (
        <>
          {showSignIn ? (
            <SignIn />
          ) : (
            <SignUp />
          )}
          {!showSignIn && (
            <button onClick={() => setShowSignIn(true)}>Already have an account? Sign In</button>
          )}
        </>
      )}
    </div>
  );
};

export default App;