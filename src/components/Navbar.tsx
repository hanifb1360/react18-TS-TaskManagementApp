import React from 'react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleSignOut: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, handleSignOut }) => {
    return (
      <div className="bg-gray-800 text-white px-4 py-2 flex justify-between fixed w-full top-0 left-0 z-10">
        <div className="flex space-x-4">
          <button
            className={`py-2 px-4 ${activeTab === 'tasks' ? 'bg-gray-600' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            Task List
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'add' ? 'bg-gray-600' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            Add Task
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'categories' ? 'bg-gray-600' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            Manage Categories
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'profile' ? 'bg-gray-600' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
        </div>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
    );
  };
  

export default Navbar;
