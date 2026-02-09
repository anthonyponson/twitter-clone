// src/app/model/Post.ts

import mongoose, { Schema, models, model, Document } from 'mongoose';

// A simple, plain type for a User object as the frontend will see it.
// This is what a populated 'author' will look like.
interface FrontendUser {
  _id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

// Interface representing a raw document in MongoDB.
// This defines the types as they are stored in the database (e.g., ObjectId).
export interface IPost extends Document {
  _id: mongoose.Types.ObjectId;
  content: string | null;
  image?: string; // Optional image URL
  author: mongoose.Types.ObjectId;
  parentPost?: mongoose.Types.ObjectId;
  comments: mongoose.Types.ObjectId[];
  likes: mongoose.Types.ObjectId[];
  repostedBy: mongoose.Types.ObjectId[];
  originalPost?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// A "Hydrated" post is a plain JavaScript object, not a Mongoose Document.
// This is the type that your API will send to the frontend components.
// All ObjectIds have been converted to strings, and references are populated.
export interface HydratedIPost {
  _id: string; // _id is now a string
  content: string | null;
  image?: string; // Optional image URL
  author: FrontendUser; // author is now a plain object with user details
  parentPost?: string;
  comments: HydratedIPost[]; // comments are also hydrated posts
  likes: string[];
  repostedBy: string[];
  originalPost?: HydratedIPost; // A repost can contain the full original post
  createdAt: string; // Dates are converted to strings when sent as JSON
  updatedAt: string;
}

// The Mongoose Schema uses the IPost interface for database-level types
const PostSchema = new Schema<IPost>({
  content: { 
    type: String, 
    trim: true, 
    maxlength: [280, 'Post content cannot exceed 280 characters.'], 
    default: null 
  },
  image: {
    type: String,
    default: null,
  },
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  parentPost: { 
    type: Schema.Types.ObjectId, 
    ref: 'Post', 
    default: null 
  },
  comments: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Post' 
  }],
  likes: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  repostedBy: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  originalPost: { 
    type: Schema.Types.ObjectId, 
    ref: 'Post', 
    default: null 
  },
}, { timestamps: true }); // `timestamps` automatically adds `createdAt` and `updatedAt` fields

// Create the model, preventing recompilation in Next.js's hot-reloading environment
const Post = models.Post || model<IPost>('Post', PostSchema);

export default Post;