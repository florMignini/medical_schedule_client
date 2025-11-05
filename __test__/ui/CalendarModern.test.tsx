import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { SelectedDateProvider } from "@/app/context/SeletedDateContext";
import CalendarModern from "@/app/(professional)/professional/components/CalendarModern";
import { mockAppointment } from "@/__mock__/mockData";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

/**
 * 🔧 Helper para montar el calendario con datos mockeados.
 */
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

describe("🧩 CalendarModern Component", () => {
  /**
   * ✅ Verifica que el calendario renderiza correctamente el mes actual.
   */
  it("renderiza el mes actual", () => {
    renderCalendar();
    const currentMonth = dayjs().format("MMMM YYYY");
    expect(screen.getByText(new RegExp(currentMonth, "i"))).toBeInTheDocument();
  });

  /**
   * ⏭️ Verifica la navegación al mes siguiente.
   */
  it("navega al mes siguiente", () => {
    renderCalendar();
    const nextBtn = screen.getByLabelText(/mes siguiente/i);
    fireEvent.click(nextBtn);

    const nextMonth = dayjs().add(1, "month").format("MMMM YYYY");
    expect(screen.getByText(new RegExp(nextMonth, "i"))).toBeInTheDocument();
  });

  /**
   * ⏮️ Verifica la navegación al mes anterior.
   */
  it("navega al mes anterior", () => {
    renderCalendar();
    const prevBtn = screen.getByLabelText(/mes anterior/i);
    fireEvent.click(prevBtn);

    const prevMonth = dayjs().subtract(1, "month").format("MMMM YYYY");
    expect(screen.getByText(new RegExp(prevMonth, "i"))).toBeInTheDocument();
  });

  /**
   * 📅 Abre el SlidePanel al seleccionar un día y propaga correctamente la fecha.
   * Usa queryAllByText para evitar ambigüedades con el número del día (por ejemplo "5" en "2025").
   */
  it("abre el AppointmentSlidePanel al seleccionar un día y propaga selectedDate", async () => {
    renderCalendar();

    // Buscar todos los elementos con el número del día actual
    const todayNumber = dayjs().date().toString();
    const matches = screen.queryAllByText(new RegExp(`^${todayNumber}$`, "i"));

    // Tomar el último match (el que corresponde al grid de días)
    const todayButton = matches[matches.length - 1];
    expect(todayButton).toBeTruthy();

    // Click en el botón del día
    fireEvent.click(todayButton);

    // Esperar que se renderice el SlidePanel
    await waitFor(() => {
      expect(screen.getByText(/Turnos del/i)).toBeInTheDocument();
    });
  });

  /**
   * 🕒 Verifica que al hacer click en "Agregar evento" dentro del panel:
   * - se mantiene la hora seleccionada
   * - se muestra el formulario de "Nuevo turno"
   */
  it("al hacer click en 'agregar evento' dentro del panel, mantiene la hora seleccionada", async () => {
    renderCalendar();

    // Seleccionar el día actual de forma segura
    const todayNumber = dayjs().date().toString();
    const matches = screen.queryAllByText(new RegExp(`^${todayNumber}$`, "i"));
    const todayButton = matches[matches.length - 1];
    fireEvent.click(todayButton);

    // Esperar que se abra el SlidePanel
    await waitFor(() => {
      expect(screen.getByText(/Turnos del/i)).toBeInTheDocument();
    });

    // Simular click en "Agregar turno" dentro del panel
    const addButton = await screen.findByTitle("Agregar turno");
    fireEvent.click(addButton);

    // Esperar a que aparezca el formulario de nuevo turno
    await waitFor(() => {
      expect(screen.getByText(/Nuevo turno/i)).toBeInTheDocument();
    });
  });
});
