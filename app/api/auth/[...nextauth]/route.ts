// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@app/lib/mongodb";
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
        await dbConnect();
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await User.findOne({ email: credentials.email });
        if (!user || !user.password) return null;
        
        const passwordsMatch = await bcrypt.compare(credentials.password, user.password);
        if (!passwordsMatch) return null;
        
        return user;
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

  // ============= THIS IS THE FINAL, CORRECT CALLBACKS LOGIC =============
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 1. On initial sign-in, the `user` object is available.
      // We persist the user's ID, name, email, and image to the token.
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }

      // 2. If the session is updated (e.g., profile picture change),
      // we refetch the user from the database to get the latest data.
      if (trigger === "update") {
        const refreshedUser = await User.findById(token.sub);
        if (refreshedUser) {
          token.name = refreshedUser.name;
          token.picture = refreshedUser.image;
        }
      }
      
      return token;
    },
    
    async session({ session, token }) {
      // 3. This callback runs for every session check.
      // We take the data from the token and apply it to the session object.
      // NO DATABASE CALLS ARE MADE HERE. It's fast and efficient.
      if (token && session.user) {
        session.user.id = token.sub;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
  },
  // ====================================================================
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };