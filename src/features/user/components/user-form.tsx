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
      <label htmlFor="name" className="block font-medium dark:text-gray-100">
        Name
      </label>
      <input
        id="name"
        placeholder="Name*"
        {...register("name", {
          required: "Name is required",
          minLength: { value: 2, message: "Min 2 chars" },
        })}
        className="border dark:border-gray-600 p-2 w-full rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
      />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      {/* Email */}
      <label htmlFor="email" className="block font-medium dark:text-gray-100">
        Email
      </label>
      <input
        id="email"
        placeholder="Email*"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Invalid email",
          },
        })}
        className="border dark:border-gray-600 p-2 w-full rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
      />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      {/* Phone */}
      <label htmlFor="Phone" className="block font-medium dark:text-gray-100">
        Phone
      </label>
      <input
        id="Phone"
        placeholder="Phone"
        {...register("phone", {
          pattern: {
            value: /^[0-9+()\-\s]+$/,
            message: "Invalid phone number",
          },
        })}
        className="border dark:border-gray-600 p-2 w-full rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
      />
      {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
      {/* Website */}
      <label htmlFor="website" className="block font-medium dark:text-gray-100">
        Website
      </label>
      <input
        id="website"
        placeholder="Website"
        {...register("website", {
          pattern: {
            value: /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}$/i,
            message: "Invalid URL",
          },
        })}
        className="border dark:border-gray-600 p-2 w-full rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
      />
      {errors.website && (
        <p className="text-red-500">{errors.website.message}</p>
      )}

      {/* Company */}
      <label htmlFor="company" className="block font-medium dark:text-gray-100">
        Company
      </label>
      <input
        id="company"
        placeholder="Company*"
        {...register("companyName", {
          required: "Company is required",
          minLength: { value: 2, message: "Min 2 chars" },
        })}
        className="border dark:border-gray-600 p-2 w-full rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
      />
      {errors.companyName && (
        <p className="text-red-500">{errors.companyName.message}</p>
      )}
      <button
        type="submit"
        className="bg-primary text-black px-4 py-2 rounded disabled:opacity-50 hover:underline transition cursor-pointer"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
