// app/page.js
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Welcome to BucketList
      </h1>
      <p className="text-xl text-gray-600 max-w-lg mb-8">
        A simple and intuitive todo application to help you stay organized and productive.
      </p>
      <div className="flex gap-4">
        <Link href="/auth/register" 
          className="px-6 py-3 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Get Started
        </Link>
        <Link href="/auth/login"
          className="px-6 py-3 text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Sign In
        </Link>
      </div>
    </div>
  );
}