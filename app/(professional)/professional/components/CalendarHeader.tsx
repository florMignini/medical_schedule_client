import ArrowLeft from "./icons/ArrowLeft";
import ArrowRight from "./icons/ArrowRight";
import dayjs from "dayjs";

interface Props {
  currentMonth: number;
  currentYear: number;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
}

const CalendarHeader = ({
  currentMonth,
  currentYear,
  handlePrevMonth,
  handleNextMonth,
}: Props) => {
  const label = dayjs(`${currentYear}-${currentMonth + 1}`)
    .locale("es")
    .format("MMMM YYYY");

  const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);

  return (
    <div className="flex items-center justify-between mb-12 text-black">
      <h2 className="font-semibold text-lg w-1/3 text-left">{capitalizedLabel}</h2>
      <div className="flex items-center justify-center w-1/3 gap-4">
        <button onClick={handlePrevMonth} className="hover:text-gray-500">
          <ArrowLeft width={20} height={20} />
        </button>
        <button onClick={handleNextMonth} className="hover:text-gray-500">
          <ArrowRight width={20} height={20} />
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
