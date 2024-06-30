import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../supabaseClient';
import { signIn } from '../features/userSlice';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state

    const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Sign in failed', error);
      setError(error.message);
    } else {
      dispatch(signIn(user));
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div>
      <form onSubmit={handleSignIn} autoComplete="off" className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete="new-email"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="new-password"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Sign In
        </button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default SignIn;
