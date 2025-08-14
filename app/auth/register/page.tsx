// src/app/(auth)/register/page.tsx
"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // API call to our new registration endpoint
    const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
        setError(data.message || 'Something went wrong.');
        return;
    }

    // Automatically sign in the user after successful registration
    const signInResult = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (signInResult?.ok) {
        router.push('/'); // Redirect to home page on success
    } else {
        setError('Registration successful, but auto-login failed. Please log in manually.');
        router.push('/login');
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg border border-neutral-800 bg-neutral-950 p-8">
      <h1 className="mb-6 text-center text-2xl font-bold text-white">Create your account</h1>
      
      {error && <p className="mb-4 rounded bg-red-500/20 p-3 text-center text-red-400">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required className="w-full rounded-md ..."/>
        </div>
        <div>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="w-full rounded-md ..."/>
        </div>
        <div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required minLength={6} className="w-full rounded-md ..."/>
        </div>
        <button type="submit" className="w-full rounded-full bg-white py-3 font-bold text-black ...">
          Sign Up
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-500">
        Already have an account?{' '}
        <Link href="/login" className="text-sky-500 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}