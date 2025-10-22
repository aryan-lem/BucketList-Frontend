"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../context/UserContext';
import TodoList from '../../components/todos/TodoList';

export default function DashboardPage() {
  const { user, loading, isAuthenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If finished loading and not authenticated, redirect to login
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  // Don't render content if not authenticated - will redirect in useEffect
  if (!isAuthenticated) {
    return null;
  }

  // User is authenticated, show dashboard
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <p className="mb-4">Welcome, {user?.username}!</p>
      <TodoList />
    </div>
  );
}