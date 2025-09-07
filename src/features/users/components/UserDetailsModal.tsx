import { Modal } from "@/components/ui/modal/Modal";
import { useModalStore } from "@/stores/modalStore";
import type { User } from "@/types";
import { formatDate } from "@/utils/dateUtils";
import { User as UserIcon, Mail, Calendar, Clock } from "lucide-react";
import { Truncate } from "@/components/ui";

interface UserDetailsModalProps {
  user: User | null;
}

function UserDetailField({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | React.ReactNode;
}) {
  return (
    <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
      <div className="flex-shrink-0">
        <Icon className="h-5 w-5 text-gray-400 mt-0.5" />
      </div>
      <dl className="flex-1 min-w-0">
        <dt className="text-sm font-medium text-gray-500 mb-1">{label}</dt>
        <dd className="text-sm text-gray-900 break-words">{value}</dd>
      </dl>
    </div>
  );
}

function UserDetailsContent({ user }: { user: User }) {
  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
          <UserIcon className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            <Truncate
              maxWidth="max-w-[180px] sm:max-w-[300px] truncate"
              tooltipPosition="bottom"
            >
              {user.name}
            </Truncate>
          </h3>
          <p className="text-sm text-gray-500">User ID: {user.id}</p>
        </div>
      </div>

      <div className="space-y-4">
        <UserDetailField
          icon={Mail}
          label="Email Address"
          value={
            <Truncate
              maxWidth="max-w-[340px] truncate"
              tooltipPosition="bottom"
            >
              {user.email}
            </Truncate>
          }
        />
        <UserDetailField
          icon={Calendar}
          label="Created"
          value={formatDate(user.createdAt)}
        />
        <UserDetailField
          icon={Clock}
          label="Last Updated"
          value={formatDate(user.updatedAt)}
        />
      </div>
    </div>
  );
}

export default function UserDetailsModal({ user }: UserDetailsModalProps) {
  const { isOpen, closeModal } = useModalStore();

  if (!user) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      title="User Details"
      size="md"
    >
      <UserDetailsContent user={user} />
    </Modal>
  );
}
