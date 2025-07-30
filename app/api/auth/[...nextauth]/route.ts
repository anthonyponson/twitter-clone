// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { AuthOptions } from 'next-auth';

const handler = NextAuth(AuthOptions);

export { handler as GET, handler as POST };