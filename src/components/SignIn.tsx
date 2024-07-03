import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../supabaseClient';
import { fetchUser } from '../features/userSlice';
import { AppDispatch } from '../app/store';
import { Link } from 'react-router-dom';

const SignIn: React.FC = () => {
  // Retrieve the last logged-in email from localStorage, default to an empty string if not found
  const lastEmail = localStorage.getItem('lastEmail') || '';

  // Initialize state for email and password, setting email to the last logged-in email
  const [email, setEmail] = useState(lastEmail);
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  // Handle sign-in form submission
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Sign in failed', error.message);
    } else {
      // Store the email in localStorage upon successful login
      localStorage.setItem('lastEmail', email);
      dispatch(fetchUser());
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <form onSubmit={handleSignIn}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign In
        </button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign up here</Link>.
      </p>
    </div>
  );
};

export default SignIn;






