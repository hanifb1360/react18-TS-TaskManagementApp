import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import { AppDispatch, RootState } from '../app/store';
import { fetchListItems } from '../features/listItemsSlice';
import { addCollaborator, fetchCollaborators } from '../features/collaboratorsSlice';

interface ListDetailsModalProps {
  list: any;
  onClose: () => void;
}

const ListDetailsModal: React.FC<ListDetailsModalProps> = ({ list, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const listItems = useSelector((state: RootState) => state.listItems.items);
  const collaborators = useSelector((state: RootState) => state.collaborators.collaborators);
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');

  useEffect(() => {
    dispatch(fetchListItems(list.id));
    dispatch(fetchCollaborators(list.id));
  }, [dispatch, list.id]);

  const handleAddCollaborator = async () => {
    if (newCollaboratorEmail.trim()) {
      await dispatch(addCollaborator({ listId: list.id, email: newCollaboratorEmail.trim() }));
      setNewCollaboratorEmail('');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>
        <h2 className="text-3xl text-cyan-800 font-bold mb-4">{list.name}</h2>
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">List Items</h3>
          <ul className="list-disc list-inside">
            {listItems.map((item: any) => (
              <li key={item.id} className="py-2 px-4 border-b border-gray-300">
                {item.title}
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">Collaborators</h3>
          <ul className="list-disc list-inside mb-2">
            {collaborators.map((collaborator: any) => (
              <li key={collaborator.id} className="py-2 px-4 border-b border-gray-300">
                {collaborator.email}
              </li>
            ))}
          </ul>
          <input
            type="email"
            value={newCollaboratorEmail}
            onChange={(e) => setNewCollaboratorEmail(e.target.value)}
            placeholder="Add collaborator by email"
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddCollaborator}
          >
            Add Collaborator
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListDetailsModal;
