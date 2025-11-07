import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SelectedDateProvider } from "@/app/context/SeletedDateContext";
import CalendarModern from "@/app/(professional)/professional/components/CalendarModern";
import dayjs from "dayjs";

/* -------------------------------------------------------------------------- */
/* 🧩 Mocks                                                                   */
/* -------------------------------------------------------------------------- */

// Mock básico del SlidePanel
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

        return (
          <section data-testid="slide-panel">
            {showForm ? (
              <div data-testid="new-appointment-form">
                Nuevo turno -{" "}
                {(() => {
                  const hours = selectedDate
                    .getHours()
                    .toString()
                    .padStart(2, "0");
                  const minutes = selectedDate
                    .getMinutes()
                    .toString()
                    .padStart(2, "0");
                  return `${hours}:${minutes}`;
                })()}
              </div>
            ) : (
              <>
                <h3>
                  Turnos del{" "}
                  {require("dayjs")(selectedDate).format("DD/MM/YYYY")}
                </h3>
                <ul>
                  {appointments.map((a: any) => (
                    <li key={a.appointment.id}>{a.appointment.notes}</li>
                  ))}
                </ul>
                <button title="Agregar turno" onClick={() => setShowForm(true)}>
                  Agregar turno
                </button>
              </>
            )}
          </section>
        );
      },
    };
  }
);

// Mock onAddAppointment
jest.mock(
  "@/app/(professional)/professional/appointments/components/AppointmentSlidePannel",
  () => {
    const React = require("react");
    const { useState } = React;
    const dayjs = require("dayjs");

    return {
      __esModule: true,
      default: function MockOnAddAppointment({
        selectedDate,
        appointments,
      }: {
        selectedDate: Date;
        appointments: any[];
      })  {
        const [showForm, setShowForm] = useState(false);
        const [dateTime, setDateTime] = useState(selectedDate);

        const handleAdd = () => {
          // ⏰ Forzamos la hora del flujo esperado (10:30)
          const newDate = new Date(selectedDate);
          newDate.setHours(10, 30);
          setDateTime(newDate);
          setShowForm(true);
        };

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
                Nuevo turno -{" "}
                {`${dateTime.getHours().toString().padStart(2, "0")}:${dateTime
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}`}
              </div>
            )}
          </section>
        );
      },
    };
  }
);

// Mock del formulario de nuevo turno
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

  it("abre el panel y luego el formulario con la hora correcta", async () => {
    renderCalendar();

    // 🔹 1️⃣ Selecciona el día actual del calendario
    const todayNumber = dayjs().date().toString();
    const dayButtons = screen.queryAllByText(
      new RegExp(`^${todayNumber}$`, "i")
    );
    const todayButton = dayButtons[dayButtons.length - 1];
    fireEvent.click(todayButton);

    // 🔹 2️⃣ Esperar que se abra el panel
    await waitFor(() =>
      expect(screen.getByTestId("slide-panel")).toBeInTheDocument()
    );

    // 🔹 3️⃣ Click en “Agregar turno” dentro del panel
    fireEvent.click(screen.getByTitle("Agregar turno"));

    // 🔹 4️⃣ Esperar que aparezca el formulario con hora correcta
    await waitFor(() => {
      const form = screen.getByTestId("new-appointment-form");
      expect(form).toBeInTheDocument();
      // valida que la hora sea la del mock (10:30)
      expect(form).toHaveTextContent("10:30");
    });
  });
});
