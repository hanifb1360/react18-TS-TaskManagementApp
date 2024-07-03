import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../supabaseClient';
import { fetchUser } from '../features/userSlice';
import { AppDispatch } from '../app/store';
import { Link } from 'react-router-dom';

const SignUp: React.FC = () => {
  // Local states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch<AppDispatch>();

  // Handle the sign-up process
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error('Sign up failed', error.message);
    } else {
      dispatch(fetchUser());
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      {/* Sign-up form */}
      <form onSubmit={handleSignUp}>
        {/* Input field for email */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
        {/* Input field for password */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
        {/* Submit button for sign-up */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign Up
        </button>
      </form>
      {/* Link to sign in if the user already has an account */}
      <p className="mt-4">
        Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Sign in here</Link>.
      </p>
    </div>
  );
};

export default SignUp;
