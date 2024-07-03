import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { RootState, AppDispatch } from './app/store';
import { fetchUser } from './features/userSlice';
import Navbar from './components/Navbar';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';
import ManageCategories from './components/ManageCategories';
import UserProfile from './components/UserProfile';
import ManageLists from './components/ManageLists';
import ListDetailsModal from './components/ListDetailsModal'; // Import the ListDetailsModal

import { supabase } from './supabaseClient';
import './styles.css';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [selectedList, setSelectedList] = useState<any | null>(null); // State for selected list
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    dispatch(fetchUser());
  };

  const openListDetails = (list: any) => {
    setSelectedList(list);
  };

  const closeListDetails = () => {
    setSelectedList(null);
  };

  return (
    <Router>
      {user ? (
        <>
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} handleSignOut={handleSignOut} />
          <div className="pt-16 max-w-4xl mx-auto">
            <Routes>
              <Route path="/tasks" element={<TaskList />} />
              <Route path="/add" element={<AddTask />} />
              <Route path="/categories" element={<ManageCategories />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/lists" element={<ManageLists onSelectList={openListDetails} />} /> {/* Route for ManageLists */}
              <Route path="*" element={<Navigate to="/tasks" replace />} />
            </Routes>
          </div>
          {selectedList && <ListDetailsModal list={selectedList} onClose={closeListDetails} />} {/* Modal for list details */}
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;



