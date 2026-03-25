import { useForm } from "react-hook-form";
import { UserFormValues } from "../types";

interface Props {
  defaultValues?: UserFormValues;
  onSubmit: (data: UserFormValues) => void;
}

export default function UserForm({ defaultValues, onSubmit }: Props) {
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
    } catch (error) {
      onSubmitError();
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {/* Name */}
      <input
        placeholder="Name*"
        {...register("name", {
          required: "Name is required",
          minLength: { value: 2, message: "Min 2 chars" },
        })}
        className="border p-2 w-full rounded"
      />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      {/* Email */}
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
      />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      {/* Phone */}
      <input
        placeholder="Phone"
        {...register("phone", {
          pattern: {
            value: /^[0-9+()\-\s]+$/,
            message: "Invalid phone number",
          },
        })}
        className="border p-2 w-full rounded"
      />
      {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
      {/* Website */}
      <input
        placeholder="Website"
        {...register("website", {
          pattern: {
            value: /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}$/i,
            message: "Invalid URL",
          },
        })}
        className="border p-2 w-full rounded"
      />
      {errors.website && (
        <p className="text-red-500">{errors.website.message}</p>
      )}

      {/* Company */}
      <input
        placeholder="Company*"
        {...register("companyName", {
          required: "Company is required",
          minLength: { value: 2, message: "Min 2 chars" },
        })}
        className="border p-2 w-full rounded"
      />
      {errors.companyName && (
        <p className="text-red-500">{errors.companyName.message}</p>
      )}
      <button
        type="submit"
        onClick={handleSubmit(handleFormSubmit)}
        disabled={!isValid}
        className="bg-primary text-black px-4 py-2 rounded disabled:opacity-50 hover:underline transition cursor-pointer"
      >
        Submit
      </button>
    </form>
  );
}
