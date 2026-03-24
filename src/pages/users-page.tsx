import UserCard from "../features/user/components/user-card";
import { useUsers } from "../features/user/hooks/use-users";

export default function UsersPage() {
  const { data, isLoading, error } = useUsers();

  // loading
  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500">Loading users...</div>
    );
  }

  // error
  if (error) {
    return (
      <div className="p-6 text-center text-red-500">Failed to load users</div>
    );
  }

  // empty
  if (!data || data.length === 0) {
    return <div className="p-6 text-center text-gray-500">No users found</div>;
  }

  return (
    <div className="p-6 space-y-4">
      {/* Title */}
      <h1 className="text-2xl font-bold">User Management</h1>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((data) => (
          <UserCard key={data.id} user={data} />
        ))}
      </div>
    </div>
  );
}
