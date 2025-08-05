// src/lib/mongodb.ts

import mongoose from 'mongoose'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI

let clientPromise: Promise<mongoose.Mongoose>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongoose = global as typeof globalThis & {
    mongoose: any;
  };
  
  if (!globalWithMongoose.mongoose) {
    globalWithMongoose.mongoose = { conn: null, promise: null }
  }
  if (!globalWithMongoose.mongoose.promise) {
    globalWithMongoose.mongoose.promise = mongoose.connect(uri).then((mongoose) => {
      return mongoose
    })
  }
  clientPromise = globalWithMongoose.mongoose.promise
} else {
  // In production mode, it's best to not use a global variable.
  clientPromise = mongoose.connect(uri)
}

export default clientPromise