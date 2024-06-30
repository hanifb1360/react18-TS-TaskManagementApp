import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { addCategory } from '../features/categoriesSlice';

const ManageCategories: React.FC = () => {
  const categories = useSelector((state: RootState) => state.categories.categories);
  const dispatch = useDispatch<AppDispatch>();
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim() !== '') {
      dispatch(addCategory(newCategory.trim()));
      setNewCategory('');
    }
  };

  return (
    <div className="w-full max-w-md p-4 bg-white rounded shadow-md mb-4">
      <h2 className="text-xl font-bold mb-4">Manage Categories</h2>
      <ul className="mb-4">
        {categories.map((category: { name: string }, index: number) => (
          <li key={index} className="py-2 px-4 border-b">{category.name}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        placeholder="New Category"
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      <button
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleAddCategory}
      >
        Add Category
      </button>
    </div>
  );
};

export default ManageCategories;

