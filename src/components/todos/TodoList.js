// components/todos/TodoList.js
"use client";

import { useEffect, useState } from 'react';
import { fetchTodos, updateTodo, deleteTodo } from '../../lib/api';
import { useUser } from '../../context/UserContext';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, accessToken, refreshUserToken } = useUser();

  useEffect(() => {
    if (user && accessToken) {
      loadTodos();
    }
  }, [user, accessToken]);

  const loadTodos = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await fetchTodos();
      setTodos(data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        const refreshed = await refreshUserToken();
        if (refreshed) {
          loadTodos();
          return;
        }
      }
      setError('Failed to load todos. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id, done) => {
    try {
      const todoToUpdate = todos.find(todo => todo.id === id);
      if (!todoToUpdate) return;
      
      const updatedTodo = { ...todoToUpdate, done };
      await updateTodo(id, updatedTodo);
      
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, done } : todo
      ));
    } catch (err) {
      console.error('Failed to update todo:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      console.error('Failed to delete todo:', err);
    }
  };

  const handleAdd = async (newTodo) => {
    setTodos([newTodo, ...todos]);
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading todos...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-800 bg-red-100 rounded-md">
        {error}
        <button 
          onClick={loadTodos} 
          className="block mx-auto mt-2 px-3 py-1 text-sm text-white bg-red-600 rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TodoForm onAdd={handleAdd} />
      
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Your Tasks</h2>
        
        {todos.length === 0 ? (
          <p className="text-center py-10 text-gray-500">
            No todos yet. Add one above!
          </p>
        ) : (
          <div>
            {todos.map(todo => (
              <TodoItem 
                key={todo.id} 
                todo={todo} 
                onToggle={handleToggle} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}