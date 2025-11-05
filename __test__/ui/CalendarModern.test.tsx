import { render, screen, fireEvent } from "@testing-library/react";
import { SelectedDateProvider } from "@/app/context/SeletedDateContext";

import CalendarModern from "@/app/(professional)/professional/components/CalendarModern";
import { mockAppointment } from "@/__mock__/mockData";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

function renderCalendar(
  initialDate = new Date(2025, 0, 15),
  mockAppointmentResult = [mockAppointment()]
) {
  return render(
    <SelectedDateProvider>
      <CalendarModern appointments={mockAppointmentResult as any} />
    </SelectedDateProvider>
  );
}

describe("Calendar", () => {
  it("renderiza el mes actual", () => {
    renderCalendar();
    const currentMonth = dayjs().format("MMMM YYYY");
    expect(screen.getByText(new RegExp(currentMonth, "i"))).toBeInTheDocument();
  });

  it("navega al mes siguiente", () => {
    renderCalendar();
    const nextBtn = screen.getByLabelText(/mes siguiente/i);
    fireEvent.click(nextBtn);

    const nextMonth = dayjs().add(1, "month").format("MMMM YYYY");
    expect(screen.getByText(new RegExp(nextMonth, "i"))).toBeInTheDocument();
  });

  it("navega al mes anterior", () => {
    renderCalendar();
    const prevBtn = screen.getByLabelText(/mes anterior/i);
    fireEvent.click(prevBtn);

    const prevMonth = dayjs().subtract(1, "month").format("MMMM YYYY");
    expect(screen.getByText(new RegExp(prevMonth, "i"))).toBeInTheDocument();
  });
});
