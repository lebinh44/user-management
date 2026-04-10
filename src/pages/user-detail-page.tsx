import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserDetail } from "@/features/user/hooks/use-user-detail";
import { useInfiniteUserPosts } from "@/features/user/hooks/use-infinite-user-posts";
import { useInfiniteUserAlbums } from "@/features/user/hooks/use-infinite-user-albums";
import { Post, Album } from "@/features/user/types";
import useIntersectionObserver from "@/features/user/hooks/use-intersection-observer";

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = Number(id);

  const { data: user, isLoading, error } = useUserDetail(userId);

  const {
    data: postsData,
    isLoading: postsLoading,
    isFetchingNextPage: postsFetchingMore,
    fetchNextPage: fetchMorePosts,
    hasNextPage: hasMorePosts,
  } = useInfiniteUserPosts(userId);

  const {
    data: albumsData,
    isLoading: albumsLoading,
    isFetchingNextPage: albumsFetchingMore,
    fetchNextPage: fetchMoreAlbums,
    hasNextPage: hasMoreAlbums,
  } = useInfiniteUserAlbums(userId);

  const postsBottomRef = useRef<HTMLDivElement>(null);
  const albumsBottomRef = useRef<HTMLDivElement>(null);

  useIntersectionObserver(
    postsBottomRef,
    fetchMorePosts,
    !!hasMorePosts && !postsFetchingMore
  );

  useIntersectionObserver(
    albumsBottomRef,
    fetchMoreAlbums,
    !!hasMoreAlbums && !albumsFetchingMore
  );

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error || !user) {
    return <div className="p-6 text-center text-red-500">User not found</div>;
  }

  const posts = postsData?.items ?? [];
  const albums = albumsData?.items ?? [];

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="text-primary hover:underline"
      >
        ← Back
      </button>

      <div className="border rounded-xl p-4 shadow-sm">
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-gray-500">{user.email}</p>

        <div className="mt-3 text-sm space-y-1">
          <p>
            <span className="font-medium">Phone:</span> {user.phone}
          </p>
          <p>
            <span className="font-medium">Website:</span> {user.website}
          </p>
          <p>
            <span className="font-medium">Company:</span> {user.company.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Posts column */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Posts</h2>
          {postsLoading ? (
            <div className="text-center text-gray-400 py-4">Loading...</div>
          ) : (
            <div className="space-y-2">
              {posts.map((post: Post) => (
                <div key={post.id} className="border p-3 rounded">
                  <p className="font-medium">{post.title}</p>
                </div>
              ))}
              <div ref={postsBottomRef} className="h-1" />
              {postsFetchingMore && (
                <div className="text-center text-gray-400 py-2 text-sm">
                  Loading more...
                </div>
              )}
              {!hasMorePosts && posts.length > 0 && (
                <div className="text-center text-gray-400 py-2 text-sm">
                  No more posts
                </div>
              )}
            </div>
          )}
        </div>

        {/* Albums column */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Albums</h2>
          {albumsLoading ? (
            <div className="text-center text-gray-400 py-4">Loading...</div>
          ) : (
            <div className="space-y-2">
              {albums.map((album: Album) => (
                <div key={album.id} className="border p-3 rounded">
                  {album.title}
                </div>
              ))}
              <div ref={albumsBottomRef} className="h-1" />
              {albumsFetchingMore && (
                <div className="text-center text-gray-400 py-2 text-sm">
                  Loading more...
                </div>
              )}
              {!hasMoreAlbums && albums.length > 0 && (
                <div className="text-center text-gray-400 py-2 text-sm">
                  No more albums
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
