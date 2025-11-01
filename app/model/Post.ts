// src/models/Post.ts

import mongoose, { Schema, models, model, Document } from 'mongoose';
import { User } from 'next-auth';

// Interface representing a document in MongoDB.
export interface IPost extends Document {
  content: string;
  author: Schema.Types.ObjectId | User;
  parentPost?: Schema.Types.ObjectId; // For comments
  comments: Schema.Types.ObjectId[]; // Array of comment post IDs
  likes: Schema.Types.ObjectId[]; // Array of user IDs
  repostedBy: Schema.Types.ObjectId[]; // Array of user IDs
  createdAt: Date;
  updatedAt: Date;
}

// A version of the interface for when author/comments are populated
export interface HydratedIPost extends Omit<IPost, 'author' | 'comments'> {
  author: User; // Author is now a full User object
  comments: IPost[]; // Comments are now full Post objects
}

const PostSchema = new Schema<IPost>({
  content: {
    type: String,
    required: [true, 'Post content is required.'],
    trim: true,
    maxlength: [280, 'Post cannot be more than 280 characters.'],
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // --- NEW FIELDS ---
  parentPost: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    default: null,
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
  // --- END NEW FIELDS ---
}, { timestamps: true });

const Post = models.Post || model<IPost>('Post', PostSchema);

export default Post;