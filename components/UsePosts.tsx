// src/hooks/usePosts.ts
"use client";

import useSWR, { KeyedMutator } from 'swr';
import { HydratedIPost } from '@app/model/Post';

// The fetcher function
const fetcher = (url: string) => fetch(url).then(res => res.json());

interface UsePostsReturn {
  posts: HydratedIPost[];
  isLoading: boolean;
  isError: any;
  mutate: KeyedMutator<HydratedIPost[]>; // The key to optimistic updates
}

export function usePosts(): UsePostsReturn {
  const { data, error, isLoading, mutate } = useSWR<HydratedIPost[]>('/api/posts', fetcher);

  return {
    posts: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}