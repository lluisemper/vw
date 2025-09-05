import React, { useState, useEffect } from "react";
import { UserPen, Loader2 } from "lucide-react";
import { FormModal } from "@/components/forms/FormModal";
import { FormField, TextInput } from "@/components/forms/FormField";
import { useUpdateUser } from "@/features/users/hooks/useUpdateUser";
import { useModalStore } from "@/stores/modalStore";
import { updateUserSchema, type UpdateUserInput } from "@/schemas/userSchema";
import type { User } from "@/types";

interface FormErrors {
  name?: string;
  email?: string;
  submit?: string;
}

interface EditUserModalProps {
  user: User;
}

function EditUserModal({ user }: EditUserModalProps) {
  const [formData, setFormData] = useState<UpdateUserInput>({
    id: Number(user.id),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const { updateUser, isLoading } = useUpdateUser();
  const { closeModal } = useModalStore();

  // Reset form data when user changes (if modal is reused)
  useEffect(() => {
    setFormData({
      id: Number(user.id),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
    setErrors({});
  }, [user.id, user.name, user.email, user.createdAt]);

  const validateForm = (): boolean => {
    const result = updateUserSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof UpdateUserInput;
        if (field !== "id") {
          fieldErrors[field as keyof FormErrors] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const validateField = (
    field: keyof Omit<UpdateUserInput, "id">,
    value: string
  ): string | undefined => {
    const tempData = { ...formData, [field]: value };
    const result = updateUserSchema.safeParse(tempData);

    if (!result.success) {
      const fieldError = result.error.issues.find(
        (issue) => issue.path[0] === field
      );
      return fieldError?.message;
    }

    return undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const updatedUser = await updateUser(formData);

    if (updatedUser) {
      // Close modal on success
      closeModal();
    }
  };

  const handleInputChange = (
    field: keyof Omit<UpdateUserInput, "id">,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Always validate field in real-time and show/clear errors as appropriate
    const fieldError = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: fieldError }));
  };

  const handleClose = () => {
    if (!isLoading) {
      // Reset form to original user data on close
      setFormData({
        id: Number(user.id),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      });
      setErrors({});
      closeModal();
    }
  };

  const hasChanges =
    formData.name !== user.name || formData.email !== user.email;

  return (
    <FormModal
      modalType="edit"
      title="Edit User"
      size="md"
      isSubmitting={isLoading}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
            <UserPen className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">
              Update user information for {user.name}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <FormField
            label="Full Name"
            error={errors.name}
            required
            htmlFor="name"
          >
            <TextInput
              id="name"
              type="text"
              placeholder="Enter user's full name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={!!errors.name}
              disabled={isLoading}
              autoFocus
            />
          </FormField>

          <FormField
            label="Email Address"
            error={errors.email}
            required
            htmlFor="email"
          >
            <TextInput
              id="email"
              type="email"
              placeholder="Enter user's email address"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={!!errors.email}
              disabled={isLoading}
            />
          </FormField>
        </div>

        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !hasChanges}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <UserPen className="h-4 w-4 mr-2" />
                Update User
              </>
            )}
          </button>
        </div>
      </form>
    </FormModal>
  );
}

export default EditUserModal;
