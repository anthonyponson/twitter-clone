// src/lib/mongoose.ts

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Augment the global NodeJS type to include our cached mongoose connection
declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // If we have a cached connection, return it immediately
  if (cached.conn) {
    return cached.conn;
  }

  // If there's no active promise, create a new one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // The mongoose.connect() function itself returns the promise we need
    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }
  
  try {
    // Await the promise to get the connection and cache it
    cached.conn = await cached.promise;
  } catch (e) {
    // If the connection fails, clear the promise so the next attempt can try again
    cached.promise = null;
    throw e;
  }

  // Return the now-established connection
  return cached.conn;
}

export default dbConnect;