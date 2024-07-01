import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { addCategory, fetchCategories } from '../features/categoriesSlice';

const ManageCategories: React.FC = () => {
  const [newCategory, setNewCategory] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector((state: RootState) => state.categories.categories);
  const loading = useSelector((state: RootState) => state.categories.loading);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      await dispatch(addCategory(newCategory.trim()));
      setNewCategory('');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Manage Categories</h2>
      <form onSubmit={handleAddCategory} className="mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newCategory">
            New Category
          </label>
          <input
            type="text"
            id="newCategory"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 text-white font-bold rounded ${loading ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-700'}`}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Category'}
        </button>
      </form>
      <ul className="list-disc list-inside">
        {categories.map((category) => (
          <li key={category.id} className="py-2 px-4 border-b border-gray-300">
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageCategories;


