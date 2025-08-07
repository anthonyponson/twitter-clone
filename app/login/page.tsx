// src/app/login/page.tsx
"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // This is the key call for credentials
      const result = await signIn('credentials', {
        redirect: false, // IMPORTANT: Do not redirect, we will handle it
        email,
        password,
      });

      if (result?.error) {
        // Handle errors, e.g., "Invalid credentials"
        setError('Invalid email or password. Please try again.');
        console.error('Sign-in error:', result.error);
      } else if (result?.ok) {
        // On success, redirect to the home page
        router.push('/');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="w-full max-w-md rounded-lg border border-neutral-800 bg-neutral-950 p-8">
        <h1 className="mb-6 text-center text-2xl font-bold text-white">Log in to X</h1>
        
        {error && <p className="mb-4 rounded bg-red-500/20 p-3 text-center text-red-400">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full rounded-md border border-neutral-700 bg-black p-3 text-white focus:border-sky-500 focus:outline-none"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full rounded-md border border-neutral-700 bg-black p-3 text-white focus:border-sky-500 focus:outline-none"
            />
          </div>
          <button type="submit" className="w-full rounded-full bg-white py-3 font-bold text-black hover:bg-neutral-200">
            Log In
          </button>
        </form>

        <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-neutral-700"></div>
            <span className="mx-4 flex-shrink text-neutral-500">or</span>
            <div className="flex-grow border-t border-neutral-700"></div>
        </div>

        <button 
          onClick={() => signIn('google')}
          className="w-full rounded-full border border-neutral-700 py-3 font-bold text-white hover:bg-neutral-800"
        >
          Sign in with Google
        </button>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-sky-500 hover:underline">
            Sign up
            </Link>
        </p>
      </div>
    </div>
  );
}