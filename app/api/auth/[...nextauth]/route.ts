// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

// ==================  THE CORRECTIONS ARE HERE ==================
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from '@app/lib/Mongodb';
// =============================================================

import User from '@app/model/User';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  // Use the new MongoDBAdapter
  adapter: MongoDBAdapter(clientPromise),
  
  providers: [
    // ... your providers (Google, Credentials) remain the same
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: 'Email', type: 'text' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Missing credentials');
          }
  
          await clientPromise;
          
          const user = await User.findOne({ email: credentials.email });
  
          if (!user || !user.password) {
            throw new Error('Invalid credentials');
          }
  
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
  
          if (!isPasswordCorrect) {
            throw new Error('Invalid credentials');
          }
  
          return user;
        },
      }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };