"use client";

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../context/UserContext';
import RegisterForm from '../../../components/auth/RegisterForm';

function RegisterContent() {
  const { isAuthenticated, loading } = useUser();
  const router = useRouter();
  
  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

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

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[70vh]">Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}