// src/app/model/Post.ts

import mongoose, { Schema, models, model, Document } from 'mongoose';

// A simple, plain type for a User object as the frontend will see it
interface FrontendUser {
  _id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

// Interface representing a raw document in MongoDB.
export interface IPost extends Document {
  _id: mongoose.Types.ObjectId;
  content: string | null;
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
export interface HydratedIPost {
  _id: string;
  content: string | null;
  author: FrontendUser;
  parentPost?: string;
  comments: HydratedIPost[];
  likes: string[];
  repostedBy: string[];
  originalPost?: HydratedIPost;
  createdAt: string;
  updatedAt: string;
}

// The Schema uses the IPost interface for database-level types
const PostSchema = new Schema<IPost>({
  content: { 
    type: String, 
    trim: true, 
    // ============= THIS IS THE FIX =============
    // Correctly provide both the number and the error message in the array
    maxlength: [280, 'Post content cannot exceed 280 characters.'], 
    // ===========================================
    default: null 
  },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  parentPost: { type: Schema.Types.ObjectId, ref: 'Post', default: null },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  repostedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  originalPost: { type: Schema.Types.ObjectId, ref: 'Post', default: null },
}, { timestamps: true });

const Post = models.Post || model<IPost>('Post', PostSchema);

export default Post;