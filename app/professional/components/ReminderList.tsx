import { Reminder, ReminderStatus } from "@/interfaces/reminder.interface";
import Link from "next/link";
export interface ReminderListProps {
  reminders: Reminder[];
  onDelete: (id: string) => void;
}

export const statusColors: Record<ReminderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  sent: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  canceled: "bg-gray-100 text-gray-800",
};


const ReminderList: React.FC<ReminderListProps> = ({ reminders, onDelete }) => {
  if (reminders.length === 0) {
    return <p className="text-gray-500">No hay recordatorios programados.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Tipo
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Mensaje
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Estado
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Programado para
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reminders.map((reminder) => (
            <tr key={reminder.id}>
              {/* <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <span className="text-xl">{typeIcons[reminder.type]}</span>
                  <span className="ml-2">{reminder.type}</span>
                </div>
              </td> */}
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{reminder.message}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    statusColors[reminder.status]
                  }`}
                >
                  {reminder.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {reminder.scheduledFor ? new Date(reminder.scheduledFor).toLocaleString() : "No programado"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link
                  href={`/reminders/${reminder.id}/edit`}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Editar
                </Link>
                <button
                  onClick={() => onDelete(reminder.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReminderList;
