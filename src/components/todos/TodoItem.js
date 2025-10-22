// components/todos/TodoItem.js
"use client";

import { useState } from 'react';

export default function TodoItem({ todo, onToggle, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleToggle = () => {
    onToggle(todo.id, !todo.done);
  };
  
  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(todo.id);
    setIsDeleting(false);
  };

  return (
    <div className="flex items-center justify-between p-4 mb-2 bg-white rounded-lg shadow">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={Boolean(todo.done)}
          onChange={handleToggle}
          className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <span 
          className={`ml-3 ${todo.done ? 'line-through text-gray-500' : 'text-gray-800'}`}
        >
          {todo.title}
        </span>
      </div>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="px-2 py-1 text-sm text-red-600 hover:text-red-800 focus:outline-none"
      >
        {isDeleting ? '...' : 'Delete'}
      </button>
    </div>
  );
}