import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useDispatch } from 'react-redux';
import { fetchUser } from '../features/userSlice';
import { AppDispatch } from '../app/store';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    dispatch(fetchUser());
    navigate('/login'); // Redirect to login after signing out
  };

  return (
    <nav className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center fixed w-full top-0 left-0 z-10 h-12">
      <div className="flex space-x-4">
        <Link to="/tasks" className="py-2 px-4">
          Task List
        </Link>
        <Link to="/add" className="py-2 px-4">
          Add Task
        </Link>
        <Link to="/categories" className="py-2 px-4">
          Manage Categories
        </Link>
        <Link to="/profile" className="py-2 px-4">
          Profile
        </Link>
      </div>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
        onClick={handleSignOut}
      >
        Sign Out
      </button>
    </nav>
  );
};

export default Navbar;






