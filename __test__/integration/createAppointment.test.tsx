import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewAppointmentForm from "@/components/forms/NewAppointmentForm";
import { SelectedDateProvider } from "@/app/context/SeletedDateContext";
import {
  createAppointment,
  createPatientAppointmentRelation,
  createProfessionalAppointmentRelation,
} from "@/app/actions";

// 🧩 Mock ResizeObserver para entorno de Jest (Radix / DatePicker)
beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
});


// ✅ Mock específico del portal de Radix Select (v2 compatible)
jest.mock("@radix-ui/react-select", () => {
  const actual = jest.requireActual("@radix-ui/react-select");
  const React = require("react");

  return {
    ...actual,
    Portal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

// 🧠 Mock de server actions
jest.mock("@/app/actions", () => ({
  createAppointment: jest.fn(),
  createPatientAppointmentRelation: jest.fn(),
  createProfessionalAppointmentRelation: jest.fn(),
}));

// 🧭 Mock del router de Next.js
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

describe("🧩 NewAppointmentForm Integration", () => {
  beforeEach(() => jest.clearAllMocks());

  it("debería permitir crear un turno correctamente", async () => {
    (createAppointment as jest.Mock).mockResolvedValue({ id: "1" });
    (createPatientAppointmentRelation as jest.Mock).mockResolvedValue({});
    (createProfessionalAppointmentRelation as jest.Mock).mockResolvedValue({});

    render(
      <SelectedDateProvider>
        <NewAppointmentForm
          type="create"
          component="calendar"
          patientsList={[
            {
              patient: {
                id: "e0b7a64d-8c18-4abc-9f41-2b1c7890abcd",
                createdAt: new Date("2024-05-01T10:15:00Z"),
                updatedAt: new Date("2024-06-10T14:30:00Z"),
                firstName: "Maria",
                lastName: "Fernandez",
                patientPhotoUrl:
                  "https://example.com/photos/maria-fernandez.jpg",
                identificationType: "DNI",
                identityNumber: "12345678",
                email: "maria.fernandez@example.com",
                phone: "+54 11 5555-1234",
                birthDate: new Date("1989-08-17"),
                address: "Av. Siempre Viva 742, Buenos Aires",
                occupation: "Diseñadora Gráfica",
                gender: "Femenino",
                emergencyContactName: "Jorge Fernández",
                emergencyContactNumber: "+54 9 11 6666-7890",
                contactRelationship: "Hermano",
                insuranceProvider: "Swiss Medical",
                insurancePolicyNumber: "SM-AR-20240610",
                smoker: "No",
                exSmoker: "No",
                bloodType: "O",
                bloodFactor: "+",
                allergic: "Sí",
                allergies: "Penicilina",
                familyMedicalHistory: "Hipertensión en madre",
                medicalHistory: "Asma controlada",
                medicalHistoryType: "Crónica",
                pastMedicalHistory: "Cirugía apendicitis 2008",
                currentMedication: "Salbutamol inhalador según necesidad",
                ObservationsComments: "Control anual recomendado cada junio.",
                patientHeight: "168 cm",
                patientWeight: "62 kg",
                patientWaist: "72 cm",
                patientHip: "96 cm",
                patientArm: "28 cm",
                patientTricepsFold: "12 mm",
                patientBMI: "21.97",
                patientBFP: "24%",
                isActive: true,
              },
            },
          ]}
        />
      </SelectedDateProvider>
    );

    // 🧩 Completamos el motivo de la consulta
    const reasonInput = screen.getByPlaceholderText(/motivo de la consulta/i);
    await userEvent.type(reasonInput, "Control anual");

    // 🧩 Abrimos el select de pacientes
    const patientSelect = screen.getByTestId("patient-select");
    await userEvent.click(patientSelect);

    // 🧩 Esperamos el listbox del Radix Select
    const listbox = await screen.findByRole("listbox");

    // 🧩 Obtenemos todas las opciones renderizadas
    const options = Array.from(listbox.querySelectorAll("[role='option']"));

    // 🧩 Buscamos la que contenga el nombre aunque esté dividido en nodos
    const mariaOption = options.find((opt) =>
      /mar[ií]a.*fern[aá]ndez/i.test(opt.textContent?.replace(/\s+/g, " ") ?? "")
    );

    if (!mariaOption) {
      console.log(
        "⚠️ Opciones encontradas:",
        options.map((o) => o.textContent)
      );
      throw new Error("No se encontró la opción de paciente 'María Fernández'");
    }

    await userEvent.click(mariaOption);

    // 🧾 Click en el botón
    const submitButton = screen.getByTestId("appointment-submit-btn");
    await userEvent.click(submitButton);

    // 🕒 Esperamos la llamada a la acción mockeada
    await waitFor(() => expect(createAppointment).toHaveBeenCalledTimes(1));

    // ✅ Verificamos los datos enviados
    expect(createAppointment).toHaveBeenCalledWith(
      expect.objectContaining({
        reason: "Control anual",
        schedule: expect.any(Date),
      })
    );
  });
});
