import { ErrorMessage } from "@/components/ui/ErrorMessage";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  columns: number;
}

export function ErrorState({ message, onRetry, columns }: ErrorStateProps) {
  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white">
            <tr>
              <td colSpan={columns} className="px-6 py-20 text-center">
                <ErrorMessage message={message} onRetry={onRetry} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
