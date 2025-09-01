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

  callbacks: {
  async session({ session, token }) {
    if (!session.user || !token.sub) return session;

    await dbConnect();
    const dbUser = await User.findById(token.sub)
      .select("_id name email image")
      .lean();

    if (dbUser) {
      session.user.id = dbUser._id.toString();
      session.user.name = dbUser.name || null;
      session.user.email = dbUser.email;
      session.user.image = dbUser.image || null;
    }

    return session;
  },

  async jwt({ token, user }) {
    if (user) {
      token.sub = user.id;
    }
    return token;
  },
},

};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
