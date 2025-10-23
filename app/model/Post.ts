// src/models/Post.ts

import mongoose, { Schema, models, model, Document } from 'mongoose';
import { User } from 'next-auth'; // Assuming User type from next-auth

// Interface representing a document in MongoDB.
export interface IPost extends Document {
  content: string;
  author: Schema.Types.ObjectId | User; // Can be ObjectId or populated User object
  createdAt: Date;
  updatedAt: Date;
}

// A version of the interface for when the author is populated
export interface HydratedIPost extends Omit<IPost, 'author'> {
  author: User;
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
    ref: 'User', // This creates a reference to the User model
    required: true,
  },
}, { timestamps: true }); // timestamps adds createdAt and updatedAt automatically

const Post = models.Post || model<IPost>('Post', PostSchema);

export default Post;