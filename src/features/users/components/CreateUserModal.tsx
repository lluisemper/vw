import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import { FormModal } from "@/components/forms/FormModal";
import { FormField, TextInput } from "@/components/forms/FormField";
import { useCreateUser } from "@/features/users/hooks/useCreateUser";
import { useModalStore } from "@/stores/modalStore";
import { createUserSchema, type CreateUserInput } from "@/schemas/userSchema";
import { Button } from "@/components/ui";

interface FormErrors {
  name?: string;
  email?: string;
  submit?: string;
}

function CreateUserModal() {
  const [formData, setFormData] = useState<CreateUserInput>({
    name: "",
    email: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const { createUser, isLoading } = useCreateUser();
  const { closeModal } = useModalStore();

  const validateForm = (): boolean => {
    const result = createUserSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof CreateUserInput;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const user = await createUser(formData);

    if (user) {
      // Reset form and close modal on success
      setFormData({ name: "", email: "" });
      setErrors({});
      closeModal();
    }
  };

  const validateField = (
    field: keyof CreateUserInput,
    value: string
  ): string | undefined => {
    const tempData = { ...formData, [field]: value };
    const result = createUserSchema.safeParse(tempData);

    if (!result.success) {
      const fieldError = result.error.issues.find(
        (issue) => issue.path[0] === field
      );
      return fieldError?.message;
    }

    return undefined;
  };

  const handleInputChange = (field: keyof CreateUserInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field error immediately when field becomes empty
    if (value === "") {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } else {
      // Validate field in real-time and show error if invalid
      const fieldError = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: fieldError }));
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ name: "", email: "" });
      setErrors({});
      closeModal();
    }
  };

  return (
    <FormModal
      modalType="createUser"
      title="Create New User"
      size="md"
      isSubmitting={isLoading}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">
              Add a new user to your organization
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
          <Button type="submit" loading={isLoading} disabled={isLoading}>
            {isLoading ? (
              "Creating..."
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Create User
              </>
            )}
          </Button>
        </div>
      </form>
    </FormModal>
  );
}

export default CreateUserModal;
