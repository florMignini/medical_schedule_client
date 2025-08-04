import { FC } from "react";
import { Users, CalendarCheck, Repeat } from "lucide-react";
type Stat = {
  label: string;
  value: number;
  icon?: React.ReactNode;
};

interface StatsCardsProps {
  data: Stat[];
}

const iconMap: Record<string, JSX.Element> = {
  Pacientes: <Users className="text-blue-500 w-6 h-6" />,
  Turnos: <CalendarCheck className="text-green-500 w-6 h-6" />,
  Seguimientos: <Repeat className="text-purple-500 w-6 h-6" />,
};

const StatsCards: FC<StatsCardsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-4">
      {data.map((stat) => (
        <div
          key={stat.label}
          className="bg-white/30 backdrop-blur-md shadow-lg rounded-2xl p-4 flex items-center justify-between border border-white/20 transition-transform hover:scale-[1.02]"
        >
          <div className="flex flex-col">
            <span className="text-sm text-gray-800 dark:text-gray-100">
              {stat.label}
            </span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </span>
          </div>
          <div className="ml-4">{iconMap[stat.label]}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
