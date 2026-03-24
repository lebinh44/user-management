import { useParams } from "react-router-dom";

export default function UserDetailPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-2">
      <h1 className="text-2xl font-bold text-primary">User Detail Page</h1>
      <p className="text-gray-500">User ID: {id}</p>
    </div>
  );
}
