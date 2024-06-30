import React, { useState } from 'react';

interface ManageCategoriesProps {
  categories: string[];
  onAddCategory: (category: string) => void;
}

const ManageCategories: React.FC<ManageCategoriesProps> = ({ categories, onAddCategory }) => {
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim() !== '') {
      onAddCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  return (
    <div className="w-full max-w-md p-4 bg-white rounded shadow-md mb-4">
      <h2 className="text-xl font-bold mb-4">Manage Categories</h2>
      <ul className="mb-4">
        {categories.map((category, index) => (
          <li key={index} className="py-2 px-4 border-b">{category}</li>
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
