import React, { Suspense } from "react";
import { useModalStore } from "@/stores/modalStore";
import { LoadingSpinner } from "@/components/ui";
import type { User } from "@/types";

const UserDetailsModal = React.lazy(
  () => import("@/features/users/components/UserDetailsModal")
);

const CreateUserModal = React.lazy(
  () => import("@/features/users/components/CreateUserModal")
);

const EditUserModal = React.lazy(
  () => import("@/features/users/components/EditUserModal")
);

export function ModalShell() {
  const { modalData, modalType } = useModalStore();

  // Early return if no modal should be displayed
  if (!modalType) return null;
  // Do not block the UI while the modal is loading
  const fallback = (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 shadow">
        <LoadingSpinner size="md" />
      </div>
    </div>
  );

  return (
    <Suspense fallback={fallback}>
      {modalType === "createUser" && <CreateUserModal />}
      {modalType === "userDetails" && (
        <UserDetailsModal user={modalData as User} />
      )}
      {modalType === "edit" && (
        <EditUserModal user={modalData as User} />
      )}
    </Suspense>
  );
}
