import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error('Sign up failed', error);
      if (error.message === 'Email rate limit exceeded') {
        setError('Too many sign-up attempts. Please try again later.');
      } else {
        setError(error.message);
      }
    } else {
      console.log('Sign up successful');
    }
  };

  return (
    <div>
      <form onSubmit={handleSignUp}>
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
        <button type="submit">Sign Up</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SignUp;
