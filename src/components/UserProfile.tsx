import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const UserProfile: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleUpdateProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      if (email) {
        const { error } = await supabase.auth.updateUser({ email });
        if (error) {
          alert(`Error updating email: ${error.message}`);
          return;
        }
      }
      if (password) {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
          alert(`Error updating password: ${error.message}`);
          return;
        }
      }
      alert('Profile updated successfully');
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <input
        type="email"
        placeholder="New email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <button
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleUpdateProfile}
      >
        Update Profile
      </button>
    </div>
  );
};

export default UserProfile;
