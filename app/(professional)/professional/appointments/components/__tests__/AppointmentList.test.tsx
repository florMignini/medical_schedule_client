import { render, screen } from "@testing-library/react";
import AppointmentsList from "../AppointmentsList";
import { getTodayAppointments } from "@/utils/getTodayAppointments";
import { getAppointmentDetail } from "@/utils/getAppointmentDetail";
import { SelectedDateProvider } from "@/app/context/SeletedDateContext";

// ====== MOCKS ======

jest.mock("@/utils/getTodayAppointments", () => ({
  getTodayAppointments: jest.fn(),
}));

jest.mock("@/utils/getAppointmentDetail", () => ({
  getAppointmentDetail: jest.fn(),
}));

// =====================

const mockedGetTodayAppointments = getTodayAppointments as jest.MockedFunction<
  typeof getTodayAppointments
>;


describe("AppointmentsList", () => {
  it("muestra datos de un turno cuando existe", () => {
    const appointmentsMock = [
      {
        appointment: {
          id: 1,
          patientId: 10,
          schedule: "2025-01-01T10:00:00",
          notes: "Control mensual",
          reason: "Dolor lumbar",
          pastAppointment: null,
        },
      },
    ];

    const patientsMock = [
      {
        id: 10,
        firstname: "Juan",
        lastname: "Pérez",
      },
    ];

    mockedGetTodayAppointments.mockReturnValue(appointmentsMock as any);
    (getAppointmentDetail as jest.Mock).mockResolvedValue({
      patientsIncluded: [patientsMock[0]],
    });

    render(
      <SelectedDateProvider>
        <AppointmentsList
          appointments={appointmentsMock as any}
          patients={patientsMock as any}
          pastAppointmentPatientData={[]}
        />
      </SelectedDateProvider>
    );

    expect(screen.getByText("Control mensual")).toBeInTheDocument();
    expect(screen.getByText("Dolor lumbar")).toBeInTheDocument();
  });
});
