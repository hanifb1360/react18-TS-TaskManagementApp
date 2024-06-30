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
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');

  useEffect(() => {
    setEmail(user?.email || '');
    setName(user?.name || '');
    setAvatarUrl(user?.avatarUrl || '');
  }, [user]);

  const handleSaveChanges = () => {
    dispatch(updateUserProfile({ email, name, password, avatarUrl }));
    setEditMode(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatarUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-center mb-4">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <FaUserCircle size={96} className="text-gray-400" />
        )}
      </div>
      {editMode ? (
        <>
          <div className="flex flex-col items-center mb-4">
            <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md">
              Upload Avatar
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
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
        </>
      ) : (
        <>
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold">{name || 'User Name'}</h2>
            <p className="text-gray-600">{email}</p>
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
