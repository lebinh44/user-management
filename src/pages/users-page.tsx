import { useUsers } from "@/features/user/hooks/use-users";
import UserCard from "@/features/user/components/user-card";
import { SortType, useUserStore } from "@/store/user-store";
import { useUserFilter } from "@/features/user/hooks/use-user-filter";
import { useDebounce } from "@/features/user/hooks/use-debounce";
import { UserFormValues } from "@/features/user/types";
import {
  useCreateUser,
  useUpdateUser,
} from "@/features/user/hooks/use-user-mutation";
import Modal from "@/components/ui/modal";
import UserForm from "@/features/user/components/use-form";

export default function UsersPage() {
  const { data, isLoading, error } = useUsers();

  const { search, sort, setSearch, setSort } = useUserStore();

  const debouncedSearch = useDebounce(search, 300);

  const users = useUserFilter(data || [], debouncedSearch, sort);

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const { editingUserId, isOpenModal, closeModal, openCreate, openEdit } =
    useUserStore();
  const editingUser = data?.find((u) => u.id === editingUserId);

  const handleSubmit = (formData: UserFormValues) => {
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      website: formData.website,
      company: { name: formData.companyName },
    };
    if (editingUserId) {
      updateMutation.mutate({ id: editingUserId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
    closeModal();
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error</div>;
  }

  if (!users.length) {
    return <div className="p-6 text-center">No users found</div>;
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        {/* Search */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="border px-3 py-2 rounded w-full md:w-1/3"
        />

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortType)}
          className="border px-3 py-2 rounded"
        >
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="company">Company</option>
        </select>
      </div>
      <button
        onClick={() => openCreate()}
        className="bg-primary text-black px-4 py-2 rounded hover:underline transition cursor-pointer"
      >
        Create User
      </button>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
      <Modal isOpen={isOpenModal} onClose={closeModal}>
        <h2 className="text-lg font-semibold mb-3">
          {editingUserId ? "Edit User" : "Create User"}
        </h2>

        <UserForm
          defaultValues={
            editingUser
              ? {
                  name: editingUser.name,
                  email: editingUser.email,
                  phone: editingUser.phone,
                  website: editingUser.website,
                  companyName: editingUser.company.name,
                }
              : undefined
          }
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}
