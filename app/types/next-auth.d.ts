// src/types/next-auth.d.ts

import "next-auth";

declare module "next-auth" {
  /**
   * Extends the built-in session.user type to include your custom properties.
   */
  interface User {
    // You can add any custom properties you want to the user object
    id: string; 
  }

  interface Session {
    user: User & {
      // And add them to the session.user object
      id: string;
    };
  }
}