import { Eye, Edit2, Trash2 } from "lucide-react";
import { IconButton } from "@/components/ui";
import { useModalStore } from "@/stores/modalStore";
import type { User } from "@/types";

interface UserActionButtonsProps {
  user: User;
  variant?: "table" | "expanded";
}
// Domain-specific component: UserActionButtons
// - Only used in the User domain, not intended for general reuse
// - Could add props like `size` or `className` if needed in the future
// - Keeps the API simple to avoid unnecessary complexity
export const UserActionButtons = ({
  user,
  variant = "table",
}: UserActionButtonsProps) => {
  const { openModal } = useModalStore();

  const baseClasses =
    variant === "table"
      ? "flex items-center justify-center space-x-1"
      : "flex items-center space-x-2";

  return (
    <div
      role="group"
      aria-label={`Actions for ${user.name}`}
      className={baseClasses}
    >
      <IconButton
        onClick={() => openModal("userDetails", user)}
        variant="ghost"
        className="text-gray-400 hover:text-blue-600 hover:bg-blue-50"
        aria-label={`View details for ${user.name}`}
      >
        <Eye className="h-4 w-4" aria-hidden="true" />
      </IconButton>
      <IconButton
        onClick={() => openModal("editUser", user)}
        variant="ghost"
        className="text-gray-400 hover:text-blue-600 hover:bg-blue-50"
        aria-label={`Edit ${user.name}`}
      >
        <Edit2 className="h-4 w-4" aria-hidden="true" />
      </IconButton>
      <IconButton
        onClick={() => openModal("deleteUser", user)}
        variant="danger"
        aria-label={`Delete ${user.name}`}
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </IconButton>
    </div>
  );
};
