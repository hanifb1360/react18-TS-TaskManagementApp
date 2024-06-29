import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Sign in failed', error);
      if (error.message === 'Email not confirmed') {
        setMessage('Sign in failed: Please confirm your email first.');
      } else {
        setMessage('Sign in failed: ' + error.message);
      }
    } else {
      console.log('Sign in successful', data.user);
      setMessage('Sign in successful!');
    }
  };

  return (
    <div>
      {message && <p>{message}</p>}
      <form onSubmit={handleSignIn}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;

