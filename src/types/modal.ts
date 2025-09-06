import type {
  UserModalType,
  UserModalDataMap,
} from "@/features/users/types/modals";

// If you add other feature modals, you can just union them
export type ModalType = UserModalType;

export type ModalDataMap = UserModalDataMap;
