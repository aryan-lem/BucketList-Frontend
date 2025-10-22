"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { loginUser } from '../../lib/api';
import { useUser } from '../../context/UserContext';

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);
  const { login, isAuthenticated } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (isAuthenticated) {
      router.push('/dashboard');
      return;
    }

    // Check if redirected due to expired session
  //   const expired = searchParams.get('expired') === 'true';
  //   if (expired) {
  //     setSessionExpired(true);
  //   }
  // }, [isAuthenticated, searchParams, router]);
  
  // Only try to access searchParams if it exists
    if (searchParams) {
      const expired = searchParams.get('expired') === 'true';
      if (expired) {
        setSessionExpired(true);
      }
    }
  }, [isAuthenticated, searchParams, router]);

  const onSubmit = async (data) => {
    // Double-check not already authenticated before making login request
    if (isAuthenticated) {
      router.push('/dashboard');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await loginUser({
        username: data.username,
        password: data.password
      });
      
      login({ username: data.username }, response);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Sign in to BucketList</h1>
        <p className="mt-2 text-gray-600">Manage your todos efficiently</p>
      </div>
      
      {sessionExpired && (
        <div className="p-3 text-sm text-amber-800 bg-amber-100 rounded-md">
          Your session has expired. Please sign in again.
        </div>
      )}
      
      {error && (
        <div className="p-3 text-sm text-red-800 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            id="username"
            type="text"
            {...register('username', { required: 'Username is required' })}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.username && (
            <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password', { required: 'Password is required' })}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}