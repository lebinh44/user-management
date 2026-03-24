import { useParams, useNavigate } from "react-router-dom";
import { useUserDetail } from "@/features/user/hooks/use-user-detail";
import { useUserPosts } from "@/features/user/hooks/use-user-posts";
import { useUserAlbums } from "@/features/user/hooks/use-user-albums";
import { Album, Post } from "@/features/user/types";

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const userId = Number(id);

  const { data: user, isLoading, error } = useUserDetail(userId);
  const { data: posts } = useUserPosts(userId);
  const { data: albums } = useUserAlbums(userId);

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error || !user) {
    return <div className="p-6 text-center text-red-500">User not found</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="text-primary hover:underline"
      >
        ← Back
      </button>

      {/* User Info */}
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

      {/* Posts */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Posts</h2>
        <div className="space-y-2">
          {posts?.slice(0, 5).map((post: Post) => (
            <div key={post.id} className="border p-3 rounded">
              <p className="font-medium">{post.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Albums */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Albums</h2>
        <div className="space-y-2">
          {albums?.slice(0, 5).map((album: Album) => (
            <div key={album.id} className="border p-3 rounded">
              {album.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
