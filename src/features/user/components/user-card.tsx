import { User } from "../types";
import { useNavigate } from "react-router-dom";

interface Props {
  user: User;
}

export default function UserCard({ user }: Props) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/users/${user.id}`)}
      className="p-4 border rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
    >
      <h2 className="text-lg font-semibold">{user.name}</h2>
      <p className="text-sm text-gray-500">{user.email}</p>

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
