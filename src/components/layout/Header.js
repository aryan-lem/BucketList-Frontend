// components/layout/Header.js
"use client";

import Link from 'next/link';
import { useUser } from '../../context/UserContext';

export default function Header() {
  const { user, logout } = useUser();

  return (
    <header className="bg-white shadow">
      <div className="container flex items-center justify-between px-4 py-4 mx-auto">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          BucketList
        </Link>
        
        <nav>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Hi, {user.username}
              </span>
              <Link 
                href="/dashboard" 
                className="text-sm text-gray-700 hover:text-indigo-600"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="text-sm text-gray-700 hover:text-indigo-600"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link 
                href="/auth/login"
                className="text-sm text-gray-700 hover:text-indigo-600"
              >
                Sign in
              </Link>
              <Link 
                href="/auth/register"
                className="px-3 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}