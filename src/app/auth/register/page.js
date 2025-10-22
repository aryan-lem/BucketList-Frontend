"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RegisterForm from '../../../components/auth/RegisterForm';
import { useUser } from '../../../context/UserContext';

export default function RegisterPage() {
  const { isAuthenticated, loading } = useUser();
  const router = useRouter();
  
  useEffect(() => {
    // If authenticated and not loading, redirect to dashboard
    if (isAuthenticated && !loading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  // Don't render register form if authenticated
  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <p>Already authenticated. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <RegisterForm />
    </div>
  );
}