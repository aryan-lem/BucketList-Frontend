"use client";

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../context/UserContext';

// Create a client component that uses useSearchParams
function LoginContent() {
  const { isAuthenticated, loading } = useUser();
  const router = useRouter();
  
  useEffect(() => {
    // If authenticated and not loading, redirect to dashboard
    if (isAuthenticated && !loading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  // Don't render login form if authenticated
  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <p>Already authenticated. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Suspense fallback={<div>Loading form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

// Default export with Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[70vh]">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}