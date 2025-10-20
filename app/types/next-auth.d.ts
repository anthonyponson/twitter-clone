// src/types/next-auth.d.ts

import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extends the built-in session.user type
   */
  interface Session {
    user: {
      id: string;
      name: string | null | undefined;
      email: string | null | undefined;
      image: string | null | undefined;
    };
  }

  /**
   * Extends the built-in user model type
   */
  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extends the built-in JWT token type
   */
  interface JWT {
    sub: string; // This is the user ID
    name: string | null | undefined;
    email: string | null | undefined;
    picture: string | null | undefined;
  }
}