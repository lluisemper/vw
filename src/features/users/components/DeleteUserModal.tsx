import { UserMinus, AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/modal/Modal";
import { useDeleteUser } from "@/features/users/hooks/useDeleteUser";
import { useModalStore } from "@/stores/modalStore";
import { Button, Truncate } from "@/components/ui";
import type { User } from "@/types";

interface DeleteUserModalProps {
  user: User;
}

function DeleteUserModal({ user }: DeleteUserModalProps) {
  const { deleteUser, isLoading } = useDeleteUser();
  const { closeModal, isOpen } = useModalStore();
  const handleDelete = async () => {
    const success = await deleteUser(user);

    if (success) {
      closeModal();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      closeModal();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      title="Delete User"
      size="md"
      className="p-0"
    >
      <div className="p-6 space-y-6">
        {/* Warning Icon and Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Are you sure you want to delete this user?
            </h3>
            <p className="text-sm text-gray-600">
              This action cannot be undone.
            </p>
          </div>
        </div>

        {/* User Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gray-200 rounded-full hidden sm:flex items-center justify-center">
              <UserMinus className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                <Truncate
                  maxWidth="max-w-[190px] sm:max-w-[300px] truncate"
                  tooltipPosition="bottom"
                >
                  {user.name}
                </Truncate>
              </p>
              <p className="text-sm text-gray-600">
                <Truncate
                  maxWidth="max-w-[190px] sm:max-w-[300px] truncate"
                  tooltipPosition="bottom"
                >
                  {user.email}
                </Truncate>
              </p>
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <h4 className="text-sm font-medium text-red-800">Warning</h4>
              <p className="text-sm text-red-700 mt-1">
                Once you delete this user, all their data will be permanently
                removed from the system. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
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
            type="button"
            variant="danger"
            loading={isLoading}
            disabled={isLoading}
            onClick={handleDelete}
          >
            {isLoading ? (
              "Deleting..."
            ) : (
              <>
                <UserMinus className="h-4 w-4 mr-2" />
                Delete User
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteUserModal;
