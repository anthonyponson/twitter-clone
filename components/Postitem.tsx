// src/components/PostItem.tsx
import Image from 'next/image';
import { formatDistanceToNowStrict } from 'date-fns';
import { HydratedIPost } from '@app/model/Post';

interface PostItemProps {
  post: HydratedIPost;
}

const PostItem = ({ post }: PostItemProps) => {
  return (
    <div className="flex gap-4 border-b border-neutral-800 p-4">
      <Image
        src={post.author.image || '/default-avatar.png'}
        alt={`${post.author.name}'s avatar`}
        width={40} height={40} className="h-10 w-10 rounded-full"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-bold">{post.author.name}</p>
          <p className="text-sm text-neutral-500">@{post.author.email?.split('@')[0]}</p>
          <span className="text-sm text-neutral-500">·</span>
          <p className="text-sm text-neutral-500">
            {formatDistanceToNowStrict(new Date(post.createdAt))}
          </p>
        </div>
        <p className="mt-1 whitespace-pre-wrap">{post.content}</p>
        {/* You can add action buttons (like, comment, retweet) here later */}
      </div>
    </div>
  );
};

export default PostItem;