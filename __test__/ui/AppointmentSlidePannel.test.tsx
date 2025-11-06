import { render, screen, fireEvent } from "@testing-library/react";
import dayjs from "dayjs";
import React from "react";
import AppointmentSlidePanel from "@/app/(professional)/professional/appointments/components/AppointmentSlidePannel";
import { AppointmentsIncluded, PatientsIncluded } from "@/interfaces";

/* -------------------------------------------------------------------------- */
/* 🧩 Mocks base                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Mock genérico para reemplazar los componentes de Framer Motion.
 * Mejora la performance del test eliminando animaciones.
 */
const MockMotionComponent = ({
  children,
  ...rest
}: React.PropsWithChildren<Record<string, unknown>>) => (
  <div {...rest}>{children}</div>
);

jest.mock("framer-motion", () => ({
  __esModule: true,
  motion: new Proxy({}, { get: () => MockMotionComponent }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

/**
 * Mock de AppointmentsList: renderiza una lista mínima y un botón para simular
 * la acción de programar desde la lista.
 */
jest.mock(
  "@/app/(professional)/professional/appointments/components/AppointmentsList",
  () => ({
    __esModule: true,
    default: ({
      appointments,
      onAddAppointment,
    }: {
      appointments: AppointmentsIncluded[];
      onAddAppointment: (date: Date) => void;
    }) => (
      <section>
        <p>Listado de turnos</p>
        <ul>
          {appointments.map((a) => (
            <li key={a.id}>{a.appointment.notes}</li>
          ))}
        </ul>
        <button
          type="button"
          aria-label="programar desde lista"
          onClick={() => onAddAppointment(new Date(2025, 10, 5, 11, 0))}
        >
          Programar desde lista
        </button>
      </section>
    ),
  })
);

/**
 * Mock de NewAppointmentForm: muestra la hora recibida por props.
 */
jest.mock("@/components/forms/NewAppointmentForm", () => {
  const React = require("react");

  const dayjs = require("dayjs");

  return {
    __esModule: true,
    default: ({ initialDateTime }: { initialDateTime: Date }) => (
      <div data-testid="mock-form">
        Formulario mock - {dayjs(initialDateTime).format("HH:mm")}
      </div>
    ),
  };
});

/* -------------------------------------------------------------------------- */
/* 🧩 Utilidades                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Generador de turnos (AppointmentsIncluded) para pruebas.
 */
const buildAppointment = (date: Date, notes: string): AppointmentsIncluded => ({
  id: `appointment-${date.getTime()}`,
  createdAt: date,
  updatedAt: date,
  appointment: {
    id: `app-${date.getTime()}`,
    schedule: dayjs(date).format("YYYY-MM-DDTHH:mm:ss"),
    reason: "Consulta",
    notes,
    cancellationReason: null,
    pastAppointment: null,
  },
});

type PanelProps = React.ComponentProps<typeof AppointmentSlidePanel>;

/**
 * Helper para montar el componente con props por defecto.
 */
const renderPanel = (override?: Partial<PanelProps>) => {
  const selectedDate = new Date(2025, 10, 5, 10, 30);
  const props: PanelProps = {
    isOpen: true,
    onClose: jest.fn(),
    selectedDate,
    appointments: [
      buildAppointment(selectedDate, "Chequeo de rutina"),
      buildAppointment(new Date(2025, 10, 6, 9, 0), "Control del día siguiente"),
    ],
    patientsList: [] as PatientsIncluded[],
    refetch: jest.fn(),
    ...override,
  };
  return { ...render(<AppointmentSlidePanel {...props} />), props };
};

/* -------------------------------------------------------------------------- */
/* 🧪 Tests                                                                   */
/* -------------------------------------------------------------------------- */

describe("🧩 AppointmentSlidePanel", () => {
  it("muestra encabezado y turnos del día seleccionado", () => {
    const { props } = renderPanel();

    expect(
      screen.getByText(`Turnos del ${dayjs(props.selectedDate).format("DD/MM/YYYY")}`)
    ).toBeInTheDocument();
    expect(screen.getByText("Chequeo de rutina")).toBeInTheDocument();
  });

  it("abre el formulario al presionar 'Agregar turno'", async () => {
    renderPanel();
    fireEvent.click(screen.getByTitle("Agregar turno"));
    expect(await screen.findByTestId("mock-form")).toBeInTheDocument();
  });

  it("pasa la hora seleccionada al formulario", async () => {
    renderPanel();
    fireEvent.click(screen.getByTitle("Agregar turno"));
    expect(await screen.findByTestId("mock-form")).toHaveTextContent("10:30");
  });

  it("llama a onClose al presionar el botón de cerrar", () => {
    const { props } = renderPanel();
    fireEvent.click(screen.getByRole("button", { name: /cerrar panel/i }));
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it("vuelve al listado al hacer click en 'Volver'", async () => {
    renderPanel();
    fireEvent.click(screen.getByTitle("Agregar turno"));
    await screen.findByTestId("mock-form");

    fireEvent.click(screen.getByRole("button", { name: /volver/i }));

    expect(screen.getByText(/Turnos del/i)).toBeInTheDocument();
  });

  it("actualiza la hora del formulario al seleccionar desde la lista", async () => {
    renderPanel();
    fireEvent.click(screen.getByRole("button", { name: /programar desde lista/i }));
    expect(await screen.findByTestId("mock-form")).toHaveTextContent("11:00");
  });
});
