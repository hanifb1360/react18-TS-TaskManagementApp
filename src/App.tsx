import React, { useState } from 'react';
import TaskList from './components/TaskList';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import axios from 'axios';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  const handleSignIn = (token: string) => {
    setToken(token);
  };

  const handleSignOut = () => {
    setToken(null);
  };

  return (
    <div className="App">
      {token ? (
        <>
          <button onClick={handleSignOut}>Sign Out</button>
          <TaskList token={token} />
        </>
      ) : (
        <>
          <SignIn onSignIn={handleSignIn} />
          <SignUp />
        </>
      )}
    </div>
  );
};

export default App;

