import React, { useState, useEffect } from "react";
import { UserPen } from "lucide-react";
import { FormModal } from "@/components/forms/FormModal";
import { FormField, TextInput } from "@/components/forms/FormField";
import { useUpdateUser } from "@/features/users/hooks/useUpdateUser";
import { useModalStore } from "@/stores/modalStore";
import { updateUserSchema, type UpdateUserInput } from "@/schemas/userSchema";
import type { User } from "@/types";
import { Button } from "@/components/ui";

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
    id: user.id,
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
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
    setErrors({});
  }, [user.id, user.name, user.email, user.createdAt]);

  const validateForm = (): boolean => {
    try {
      updateUserSchema.validateSync(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error: unknown) {
      const fieldErrors: FormErrors = {};
      if (
        error &&
        typeof error === "object" &&
        "inner" in error &&
        Array.isArray(error.inner)
      ) {
        error.inner.forEach((err: { path: string; message: string }) => {
          const field = err.path as keyof UpdateUserInput;
          if (field !== "id") {
            fieldErrors[field as keyof FormErrors] = err.message;
          }
        });
      }
      setErrors(fieldErrors);
      return false;
    }
  };

  const validateField = (
    field: keyof Omit<UpdateUserInput, "id">,
    value: string
  ): string | undefined => {
    const tempData = { ...formData, [field]: value };
    try {
      updateUserSchema.validateSync(tempData, { abortEarly: false });
      return undefined;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "inner" in error &&
        Array.isArray(error.inner)
      ) {
        const fieldError = error.inner.find(
          (err: { path: string; message: string }) => err.path === field
        );
        return fieldError?.message;
      }
      return undefined;
    }
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
        id: user.id,
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
      modalType="editUser"
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
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading || !hasChanges}
          >
            {isLoading ? (
              "Updating..."
            ) : (
              <>
                <UserPen className="h-4 w-4 mr-2" />
                Update User
              </>
            )}
          </Button>
        </div>
      </form>
    </FormModal>
  );
}

export default EditUserModal;
