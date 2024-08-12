import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { fetchLists, addList } from '../features/listsSlice';


interface ManageListsProps {
  onSelectList: (list: any) => void;
}

const ManageLists: React.FC<ManageListsProps> = ({ onSelectList }) => {
  const [newListName, setNewListName] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const lists = useSelector((state: RootState) => state.lists.lists);
  const loading = useSelector((state: RootState) => state.lists.loading);

  useEffect(() => {
    dispatch(fetchLists());
  }, [dispatch]);

  const handleAddList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      await dispatch(addList(newListName.trim()));
      setNewListName('');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Manage Lists</h2>
      <form onSubmit={handleAddList} className="mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newList">
            New List
          </label>
          <input
            type="text"
            id="newList"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="New list"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 text-white font-bold rounded ${loading ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-700'}`}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add List'}
        </button>
      </form>
      <ul className="list-disc list-inside">
        {lists.map((list) => (
          <li key={list.id} className="py-2 px-4 border-b border-gray-300 cursor-pointer" onClick={() => onSelectList(list)}>
            {list.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageLists;

