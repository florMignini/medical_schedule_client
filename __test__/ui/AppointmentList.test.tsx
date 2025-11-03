import { fireEvent, render, screen } from "@testing-library/react";
import AppointmentsList from "../../app/(professional)/professional/appointments/components/AppointmentsList";
import { getTodayAppointments } from "@/utils/getTodayAppointments";
import { SelectedDateProvider } from "@/app/context/SeletedDateContext";

// ====== MOCKS ======

jest.mock("@/utils/getTodayAppointments", () => ({
  getTodayAppointments: jest.fn(),
}));

const mockedGetTodayAppointments = getTodayAppointments as jest.MockedFunction<
  typeof getTodayAppointments
>;

describe("AppointmentsList", () => {
  const mockedGetTodayAppointments = getTodayAppointments as jest.MockedFunction<
    typeof getTodayAppointments
  >;

  const baseProps = {
    appointments: [],
    patients: [],
    pastAppointmentPatientData: [],
  };

  // 1️⃣ - ya implementado: render de turno existente
  it("muestra datos de un turno cuando existe", () => {
    const appointmentsMock = [
      {
        appointment: {
          id: 1,
          schedule: "2025-01-01T10:00:00",
          notes: "Control mensual",
          reason: "Dolor lumbar",
        },
      },
    ];

    mockedGetTodayAppointments.mockReturnValue(appointmentsMock as any);

    render(
      <SelectedDateProvider>
        <AppointmentsList
          {...baseProps}
          appointments={appointmentsMock as any}
        />
      </SelectedDateProvider>
    );

    expect(screen.getByText("Control mensual")).toBeInTheDocument();
    expect(screen.getByText("Dolor lumbar")).toBeInTheDocument();
  });

  // 2️⃣ - muestra "agregar evento" y ejecuta callback al click
  it("muestra 'agregar evento' en slots vacíos y ejecuta onAddAppointment al hacer click", () => {
    const mockAdd = jest.fn();
    mockedGetTodayAppointments.mockReturnValue([]); // no hay turnos

    render(
      <SelectedDateProvider>
        <AppointmentsList
          {...baseProps}
          onAddAppointment={mockAdd}
        />
      </SelectedDateProvider>
    );

    const addButtons = screen.getAllByText("agregar evento");
    expect(addButtons.length).toBeGreaterThan(0);

    fireEvent.click(addButtons[0]);
    expect(mockAdd).toHaveBeenCalled();
  });

  // 3️⃣ - slots deshabilitados (día pasado o turno anterior)
  it("renderiza slots deshabilitados cuando la fecha es pasada", () => {
    const mockPastAppointments = [
      {
        appointment: {
          id: 1,
          schedule: "2023-01-01T10:00:00",
          notes: "Turno viejo",
          reason: "Chequeo",
        },
      },
    ];

    mockedGetTodayAppointments.mockReturnValue(mockPastAppointments as any);

    render(
      <SelectedDateProvider>
        <AppointmentsList
          {...baseProps}
          appointments={mockPastAppointments as any}
          pastAppointmentPatientData={[
            { pastAppointments: { id: 1 } },
          ]}
        />
      </SelectedDateProvider>
    );

    const disabledSlots = document.querySelectorAll(".cursor-not-allowed");
    expect(disabledSlots.length).toBeGreaterThan(0);
  });
});
