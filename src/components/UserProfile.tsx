import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { updateUserProfile } from '../features/userSlice';
import { FaEdit, FaSave, FaUserCircle } from 'react-icons/fa';

const UserProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const dispatch = useDispatch<AppDispatch>();

  const [editMode, setEditMode] = useState(false);
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setEmail(user?.email || '');
  }, [user]);

  const handleSaveChanges = async () => {
    try {
      await dispatch(updateUserProfile({ email, password })).unwrap();
      setMessage('Profile updated successfully');
    } catch (error) {
      setMessage('Failed to update profile');
    }
    setEditMode(false);
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-center mb-4">
        <FaUserCircle size={96} className="text-gray-400" />
      </div>
      {editMode ? (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded mb-2"
            disabled
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
          <button
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2"
            onClick={handleSaveChanges}
          >
            <FaSave className="inline-block mr-2" />
            Save Changes
          </button>
          {message && <p className="text-center mt-4">{message}</p>}
        </>
      ) : (
        <>
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold">{email || 'User Email'}</h2>
          </div>
          <div className="text-center mb-4">
            <p><strong>Tasks Created:</strong> {tasks.length}</p>
            <p><strong>Completed Tasks:</strong> {completedTasks}</p>
            <p><strong>Pending Tasks:</strong> {pendingTasks}</p>
          </div>
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
            onClick={() => setEditMode(true)}
          >
            <FaEdit className="inline-block mr-2" />
            Edit Profile
          </button>
        </>
      )}
    </div>
  );
};

export default UserProfile;



