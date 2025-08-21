// src/lib/mongoose.ts

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * This function handles the database connection.
 * It checks Mongoose's internal connection state to avoid creating multiple connections.
 * This is the most robust pattern for Next.js/serverless environments.
 */
async function dbConnect() {
  // readyState is a number: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  // If we are already connected (readyState is 1), we can return immediately.
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  // If we're not connected, we establish a new connection.
  try {
    await mongoose.connect(MONGODB_URI, {
      // These options are recommended for modern Mongoose versions
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000, // Keep the longer timeout
    });
    console.log("DB connected successfully");
  } catch (e) {
    console.error("Error connecting to database:", e);
    throw new Error("Error connecting to database");
  }
}

export default dbConnect;