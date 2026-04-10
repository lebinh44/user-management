import { useForm } from "react-hook-form";
import { UserFormValues } from "../types";

interface Props {
  defaultValues?: UserFormValues;
  onSubmit: (data: UserFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
}

export default function UserForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<UserFormValues>({
    mode: "onChange",
    defaultValues,
    criteriaMode: "all", // Ensure all validation criteria are checked
  });
  const onSubmitSuccess = () => {
    alert("Form submitted successfully!");
  };

  const onSubmitError = () => {
    alert("Form submission failed. Please try again.");
  };

  const handleFormSubmit = async (data: UserFormValues) => {
    try {
      await onSubmit(data);
      onSubmitSuccess();
    } catch {
      onSubmitError();
    }
  };
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
      {/* Name */}
      <label className="block font-medium">Name</label>
      <input
        placeholder="Name*"
        {...register("name", {
          required: "Name is required",
          minLength: { value: 2, message: "Min 2 chars" },
        })}
        className="border p-2 w-full rounded"
        disabled={isSubmitting}
      />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      {/* Email */}
      <label className="block font-medium">Email</label>
      <input
        placeholder="Email*"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Invalid email",
          },
        })}
        className="border p-2 w-full rounded"
        disabled={isSubmitting}
      />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      {/* Phone */}
      <label className="block font-medium">Phone</label>
      <input
        placeholder="Phone"
        {...register("phone", {
          pattern: {
            value: /^[0-9+()\-\s]+$/,
            message: "Invalid phone number",
          },
        })}
        className="border p-2 w-full rounded"
        disabled={isSubmitting}
      />
      {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
      {/* Website */}
      <label className="block font-medium">Website</label>
      <input
        placeholder="Website"
        {...register("website", {
          pattern: {
            value: /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}$/i,
            message: "Invalid URL",
          },
        })}
        className="border p-2 w-full rounded"
        disabled={isSubmitting}
      />
      {errors.website && (
        <p className="text-red-500">{errors.website.message}</p>
      )}

      {/* Company */}
      <label className="block font-medium">Company</label>
      <input
        placeholder="Company*"
        {...register("companyName", {
          required: "Company is required",
          minLength: { value: 2, message: "Min 2 chars" },
        })}
        className="border p-2 w-full rounded"
        disabled={isSubmitting}
      />
      {errors.companyName && (
        <p className="text-red-500">{errors.companyName.message}</p>
      )}
      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="bg-primary text-black px-4 py-2 rounded disabled:opacity-50 hover:underline transition cursor-pointer"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
