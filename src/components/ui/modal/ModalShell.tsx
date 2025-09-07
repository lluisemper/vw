import React, { Suspense } from "react";
import { useModalStore } from "@/stores/modalStore";
import { LoadingSpinner } from "@/components/ui";
import type { ModalType, User } from "@/types";

const UserModals = React.lazy(() =>
  import("@/features/users/components/UserModals").then((m) => ({
    default: m.UserModals,
  }))
);

export function ModalShell() {
  const { modalData, modalType } = useModalStore();

  if (!modalType) return null;

  const fallback = (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 shadow">
        <LoadingSpinner size="md" />
      </div>
    </div>
  );

  return (
    <Suspense fallback={fallback}>
      <UserModals
        modalType={modalType as ModalType}
        modalData={modalData as User}
      />
    </Suspense>
  );
}
