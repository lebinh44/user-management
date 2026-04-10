import { useUserStore } from "@/store/user-store";
import { User } from "../types";
import { useNavigate } from "react-router-dom";
import { useDeleteUser } from "../hooks/use-user-mutation";

interface Props {
  user: User;
}

export default function UserCard({ user }: Props) {
  const navigate = useNavigate();
  const { openEdit } = useUserStore();
  const deleteMutation = useDeleteUser();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    const onSuccess = () => {
      alert("User deleted successfully");
    };
    const onError = () => {
      alert("Failed to delete user");
    };
    deleteMutation.mutate(user.id, { onSuccess, onError });
  };

  return (
    <div
      onClick={() => navigate(`/users/${user.id}`)}
      className="p-4 border dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer bg-white dark:bg-gray-900"
    >
      <div className="flex items-center">
        <h2 className="text-lg font-semibold">{user.name}</h2>
        <div className="flex justify-end gap-4 ml-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEdit(user.id);
            }}
            className="text-blue-500 hover:underline transition cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:underline transition cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>

      <div className="mt-2 text-sm">
        <p>
          <span className="font-medium">Company:</span> {user.company.name}
        </p>
        <p>
          <span className="font-medium">Website:</span> {user.website}
        </p>
      </div>
    </div>
  );
}
