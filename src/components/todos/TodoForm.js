// components/todos/TodoForm.js
"use client";

import { useState } from 'react';
import { createTodo } from '../../lib/api';
import { useUser } from '../../context/UserContext';

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const newTodo = {
        id: `todo-${Date.now()}`, // Generate a temporary ID
        userId: user.username,
        title: title.trim(),
        done: false
      };
      
      const createdTodo = await createTodo(newTodo);
      onAdd(createdTodo || newTodo);
      setTitle('');
    } catch (err) {
      console.error('Failed to create todo:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={!title.trim() || isSubmitting}
          className="px-4 py-2 font-medium text-white bg-indigo-600 border border-transparent rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
        >
          {isSubmitting ? '...' : 'Add'}
        </button>
      </div>
    </form>
  );
}