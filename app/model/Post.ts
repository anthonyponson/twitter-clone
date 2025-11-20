// src/models/Post.ts

import mongoose, { Schema, models, model, Document } from 'mongoose';
import { User } from 'next-auth';

// Interface representing a document in MongoDB.
export interface IPost extends Document {
  content: string | null; // <-- Now optional
  author: Schema.Types.ObjectId | User;
  parentPost?: Schema.Types.ObjectId;
  comments: Schema.Types.ObjectId[];
  likes: Schema.Types.ObjectId[];
  repostedBy: Schema.Types.ObjectId[];
  originalPost?: Schema.Types.ObjectId; // <-- NEW FIELD for retweets/quotes
  createdAt: Date;
  updatedAt: Date;
}

// A version of the interface for when fields are populated
export interface HydratedIPost extends Omit<IPost, 'author' | 'comments' | 'originalPost'> {
  author: User;
  comments: IPost[];
  originalPost?: HydratedIPost; // <-- NEW FIELD (can be recursive)
}

const PostSchema = new Schema<IPost>({
  content: {
    type: String,
    trim: true,
    maxlength: [280, 'Post cannot be more than 280 characters.'],
    default: null, // <-- Changed from required to default null
  },
  author: { /* ... */ },
  parentPost: { /* ... */ },
  comments: [{ /* ... */ }],
  likes: [{ /* ... */ }],
  repostedBy: [{ /* ... */ }],
  originalPost: { // <-- NEW FIELD DEFINITION
    type: Schema.Types.ObjectId,
    ref: 'Post',
    default: null,
  },
}, { timestamps: true });

const Post = models.Post || model<IPost>('Post', PostSchema);

export default Post;