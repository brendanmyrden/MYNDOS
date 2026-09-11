import { useCallback, useEffect, useRef, useState } from "react";

import {
  getMediaPosts,
  removeMediaPost,
  saveMediaPost,
  type StoredMediaPost,
} from "./mediaBoardStorage";

export type MediaBoardPost = Omit<StoredMediaPost, "blob"> & {
  url: string;
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong with media storage.";

export const useMediaBoard = (moduleName: string) => {
  const [posts, setPosts] = useState<MediaBoardPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const objectUrls = useRef<string[]>([]);
  const isMounted = useRef(true);
  const refreshVersion = useRef(0);

  const releaseObjectUrls = useCallback(() => {
    objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrls.current = [];
  }, []);

  const refresh = useCallback(async () => {
    if (!isMounted.current) return;
    const version = ++refreshVersion.current;
    setIsLoading(true);
    try {
      const storedPosts = await getMediaPosts(moduleName);
      if (!isMounted.current || version !== refreshVersion.current) return;
      const nextPosts = storedPosts.map(({ blob, ...post }) => ({
        ...post,
        url: URL.createObjectURL(blob),
      }));
      releaseObjectUrls();
      objectUrls.current = nextPosts.map((post) => post.url);
      setPosts(nextPosts);
      setError("");
    } catch (loadError) {
      if (isMounted.current && version === refreshVersion.current) {
        setError(getErrorMessage(loadError));
      }
    } finally {
      if (isMounted.current && version === refreshVersion.current) setIsLoading(false);
    }
  }, [moduleName, releaseObjectUrls]);

  useEffect(() => {
    isMounted.current = true;
    void refresh();
    return () => {
      isMounted.current = false;
      refreshVersion.current += 1;
      releaseObjectUrls();
    };
  }, [refresh, releaseObjectUrls]);

  const addPost = useCallback(
    async (file: File, caption: string) => {
      try {
        await saveMediaPost(moduleName, file, caption);
        await refresh();
      } catch (saveError) {
        const message = getErrorMessage(saveError);
        if (isMounted.current) setError(message);
        throw new Error(message);
      }
    },
    [moduleName, refresh]
  );

  const deletePost = useCallback(
    async (postId: string) => {
      try {
        await removeMediaPost(postId);
        await refresh();
      } catch (deleteError) {
        const message = getErrorMessage(deleteError);
        if (isMounted.current) setError(message);
        throw new Error(message);
      }
    },
    [refresh]
  );

  return {
    posts,
    isLoading,
    error,
    addPost,
    deletePost,
    clearError: () => setError(""),
  };
};
