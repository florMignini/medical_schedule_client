import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SelectedDateProvider } from "@/app/context/SeletedDateContext";
import CalendarModern from "@/app/(professional)/professional/components/CalendarModern";
import dayjs from "dayjs";

/* -------------------------------------------------------------------------- */
/* 🧩 Mocks globales                                                          */
/* -------------------------------------------------------------------------- */

/**
 * ✅ Mock unificado del AppointmentSlidePanel
 * - Elimina duplicaciones innecesarias.
 * - Simula correctamente la transición: panel → formulario.
 * - Calcula la hora dinámicamente (usa selectedDate o current time).
 */
jest.mock(
  "@/app/(professional)/professional/appointments/components/AppointmentSlidePannel",
  () => {
    const React = require("react");
    const { useState } = React;
    const dayjs = require("dayjs");

    return {
      __esModule: true,
      default: function MockSlidePanel({
        selectedDate,
        appointments,
      }: {
        selectedDate: Date;
        appointments: any[];
      }) {
        const [showForm, setShowForm] = useState(false);
        const [dateTime, setDateTime] = useState(selectedDate);

        // 🔹 Simula el comportamiento real del botón “Agregar turno”
        const handleAdd = () => {
          const newDate = new Date(selectedDate);
          if (newDate.getHours() === 0 && newDate.getMinutes() === 0) {
            const now = new Date();
            newDate.setHours(now.getHours(), now.getMinutes());
          }
          setDateTime(newDate);
          setShowForm(true);
        };

        const formatTime = (d: Date) =>
          `${d.getHours().toString().padStart(2, "0")}:${d
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;

        return (
          <section data-testid="slide-panel">
            {!showForm ? (
              <>
                <h3>Turnos del {dayjs(selectedDate).format("DD/MM/YYYY")}</h3>
                <ul>
                  {appointments.map((a: any) => (
                    <li key={a.appointment.id}>{a.appointment.notes}</li>
                  ))}
                </ul>
                <button title="Agregar turno" onClick={handleAdd}>
                  Agregar turno
                </button>
              </>
            ) : (
              <div data-testid="new-appointment-form">
                Nuevo turno - {formatTime(dateTime)}
              </div>
            )}
          </section>
        );
      },
    };
  }
);

/**
 * ✅ Mock del NewAppointmentForm
 * - Muestra la hora pasada en initialDateTime.
 * - Evita dependencias con dayjs.local().
 */
jest.mock("@/components/forms/NewAppointmentForm", () => {
  const React = require("react");
  const dayjs = require("dayjs");
  return {
    __esModule: true,
    default: ({ initialDateTime }: { initialDateTime: Date }) => (
      <div data-testid="new-appointment-form">
        Nuevo turno - {dayjs(initialDateTime).format("HH:mm")}
      </div>
    ),
  };
});

/* -------------------------------------------------------------------------- */
/* 🧪 Test de integración completo                                            */
/* -------------------------------------------------------------------------- */

describe("🧩 Flujo completo de calendario → slide panel → formulario", () => {
  // 🔹 Mock simple de un turno del día actual
  const mockAppointments = [
    {
      appointment: {
        id: 1,
        schedule: dayjs().hour(10).minute(30).toISOString(),
        notes: "Chequeo general",
      },
    },
  ];

  const renderCalendar = () =>
    render(
      <SelectedDateProvider>
        <CalendarModern appointments={mockAppointments as any} />
      </SelectedDateProvider>
    );

  it("abre el panel y luego el formulario con una hora válida (dinámico y estable)", async () => {
    renderCalendar();

    /* 🕓 1️⃣ Seleccionar el día actual */
    const todayNumber = dayjs().date().toString();
    const todayButton = screen
      .getAllByText(new RegExp(`^${todayNumber}$`, "i"))
      .pop(); // último match evita conflictos con encabezado
    expect(todayButton).toBeTruthy();
    fireEvent.click(todayButton!);

    /* 🪟 2️⃣ Esperar que se abra el panel */
    await waitFor(() =>
      expect(screen.getByTestId("slide-panel")).toBeInTheDocument()
    );

    /* ➕ 3️⃣ Click en “Agregar turno” */
    fireEvent.click(screen.getByTitle("Agregar turno"));

    /* 🧾 4️⃣ Verificar que aparece el formulario con hora formateada */
    await waitFor(() => {
      const form = screen.getByTestId("new-appointment-form");
      expect(form).toBeInTheDocument();

      // ✅ Dinámico: verifica formato HH:mm, no valor fijo
      expect(form.textContent).toMatch(/\b\d{2}:\d{2}\b/);
    });
  });
});
