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
    <div className="grid justify-start sm:grid-cols-3 gap-4 w-[75%] mx-auto">
      {data.map((stat) => (
        <div
          key={stat.label}
          className="shadow-xl rounded-lg p-1 flex flex-col items-center justify-center transition-transform hover:scale-[1.02]"
        >
          <span className="text-sm text-gray-800 dark:text-gray-100">
            {stat.label} totales
          </span>
          <div className="flex gap-2 items-center mx-auto">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </span>
            <div className="flex items-center h-5 ml-1">{iconMap[stat.label]}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
