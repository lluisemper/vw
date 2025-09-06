import CreateUserModal from "./CreateUserModal";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";
import UserDetailsModal from "./UserDetailsModal";
import type { ModalType, User } from "@/types";

interface UserModalsProps {
  modalType: ModalType;
  modalData: unknown; // we’ll type check below
}

export function UserModals({ modalType, modalData }: UserModalsProps) {
  switch (modalType) {
    case "createUser":
      return <CreateUserModal />;
    case "editUser":
      return <EditUserModal user={modalData as User} />;
    case "deleteUser":
      return <DeleteUserModal user={modalData as User} />;
    case "userDetails":
      return <UserDetailsModal user={modalData as User} />;
    default:
      return null;
  }
}
