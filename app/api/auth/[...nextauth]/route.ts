// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from '@app/lib/Mongodb';
import User from '@app/model/User';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  // 1. ADAPTER
  // Use the MongoDBAdapter to connect Auth.js to your database.
  // It will automatically handle user creation, session management, etc.
  adapter: MongoDBAdapter(clientPromise),

  // 2. PROVIDERS
  // An array of authentication providers.
  providers: [
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
      // The authorize function is where you handle the login logic for credentials.
      async authorize(credentials) {
        // Basic validation
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        // Ensure the database connection is ready
        await clientPromise;
        
        // Find the user in your database by their email
        const user = await User.findOne({ email: credentials.email });

        // If no user is found OR if the user was created via OAuth (no password), reject login
        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error('Invalid credentials');
        }

        // If everything is correct, return the user object
        return user;
      },
    }),
  ],

  // 3. SESSION STRATEGY
  // Use JSON Web Tokens for session management.
  session: {
    strategy: 'jwt',
  },

  // 4. SECRET
  // A secret key for signing JWTs, read from your .env.local file.
  // This is mandatory for production.
  secret: process.env.AUTH_SECRET,
  
  // 5. PAGES
  // This is the crucial part that tells Auth.js to use your custom login page
  // instead of its default, auto-generated one.
  pages: {
    signIn: '/login',
    // You can also specify other pages like signOut, error, verifyRequest, etc.
    // error: '/auth/error', 
  },
};

// This creates the handler for the catch-all API route.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };