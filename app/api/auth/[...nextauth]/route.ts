// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from '@app/lib/Mongodb';
import dbConnect from '@app/lib/mongoose';
import User from '@app/model/User';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // ============= START DEBUGGING =============
        console.log("--- Authorize Function Started ---");
        
        if (!credentials?.email || !credentials?.password) {
          console.log("DEBUG: Missing credentials.");
          return null;
        }
        
        console.log(`DEBUG: Attempting to log in with email: ${credentials.email}`);

        try {
          await dbConnect();
          console.log("DEBUG: Database connected.");

          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            console.log("DEBUG: No user found with that email.");
            return null;
          }
          console.log("DEBUG: User found in DB:", user);

          if (!user.password) {
            console.log("DEBUG: User found, but they have no password (likely an OAuth account).");
            return null;
          }
          console.log("DEBUG: User has a password hash in the DB.");
          
          console.log(`DEBUG: Comparing submitted password "${credentials.password}" with stored hash "${user.password}"`);

          const passwordsMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );
          
          console.log(`DEBUG: bcrypt.compare result: ${passwordsMatch}`);
          
          if (!passwordsMatch) {
            console.log("DEBUG: Passwords do not match.");
            return null;
          }
          
          console.log("--- Authorization Successful! ---");
          return user;

        } catch (error) {
          console.log("DEBUG: An error occurred in the authorize function:", error);
          return null;
        }
        // ============= END DEBUGGING =============
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };