import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import NewAppointmentForm from "@/components/forms/NewAppointmentForm";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { createAppointment, createPatientAppointmentRelation, createProfessionalAppointmentRelation } from "@/app/actions";
import dayjs from "dayjs";

/* -------------------------------------------------------------------------- */
/* 🧠 Mocks globales                                                          */
/* -------------------------------------------------------------------------- */

// Mock del useToast → para capturar los toasts emitidos
jest.mock("@/hooks/use-toast", () => ({
  useToast: jest.fn(() => ({
    toast: jest.fn(),
  })),
}));

// Mock de acciones server-side
jest.mock("@/app/actions", () => ({
  createAppointment: jest.fn(),
  createPatientAppointmentRelation: jest.fn(),
  createProfessionalAppointmentRelation: jest.fn(),
}));

// Mock del useRouter (Next.js)
jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn() }),
}));

// Mock del useProfessionalIncludes
jest.mock("@/hooks/useProfessionalIncludes", () => ({
  useProfessionalIncludes: () => ({
    patients: [],
  }),
}));

// Mock de DinamicForm para evitar UI compleja
jest.mock("@/components/DinamicForm", () => {
  const React = require("react");
  const { Controller } = require("react-hook-form");
  return {
    __esModule: true,
    default: ({
      control,
      name,
      placeholder,
      defaultValue,
    }: {
      control: any;
      name: string;
      placeholder?: string;
      defaultValue?: any;
    }) => (
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({ field }: { field: ControllerRenderProps }) => (
          <input
            data-testid={`field-${name}`}
            placeholder={placeholder || name}
            defaultValue={field.value}
            onChange={(e) => field.onChange(e.target.value)}
          />
        )}
      />
    ),
  };
});

// Mock de SubmitButton
jest.mock("@/components/SubmitButton", () => ({
  __esModule: true,
  default: ({ children, loading, ...props }: any) => (
    <button {...props} data-testid="submit-btn">
      {loading ? "Cargando..." : children}
    </button>
  ),
}));

/* -------------------------------------------------------------------------- */
/* 🧪 Test principal                                                          */
/* -------------------------------------------------------------------------- */

describe("🧩 NewAppointmentForm", () => {
  const mockOnSuccess = jest.fn();
  const mockToast = jest.fn();
  const mockAppointment = { id: "appt-1" };

  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
  });

  const baseProps = {
    type: "create" as const,
    onSuccess: mockOnSuccess,
    patientsList: [],
    patient: {
      id: "pat-1",
      firstName: "Juan",
      lastName: "Pérez",
      patientPhotoUrl: "/mock-photo.jpg",
    } as any,
  };

  it("renderiza correctamente los campos principales", () => {
    render(<NewAppointmentForm {...baseProps} />);

    expect(screen.getByPlaceholderText(/motivo/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/información adicional/i)).toBeInTheDocument();
    expect(screen.getByTestId("submit-btn")).toHaveTextContent("Crear Turno");
  });

  it("usa la fecha inicial pasada por props", () => {
    const date = new Date(2025, 10, 5, 10, 30);
    render(<NewAppointmentForm {...baseProps} initialDateTime={date} />);

    const dateField = screen.getByTestId("field-schedule");
    expect(dateField).toBeInTheDocument();
  });

  it("envía correctamente el formulario y llama a onSuccess", async () => {
    (createAppointment as jest.Mock).mockResolvedValue(mockAppointment);

    render(<NewAppointmentForm {...baseProps} />);

    fireEvent.change(screen.getByPlaceholderText(/motivo/i), {
      target: { value: "Chequeo" },
    });
    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(createAppointment).toHaveBeenCalled();
      expect(createProfessionalAppointmentRelation).toHaveBeenCalled();
      expect(createPatientAppointmentRelation).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringMatching(/Programando Turno/i),
        })
      );
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it("maneja errores de creación de turno mostrando un toast de error", async () => {
    (createAppointment as jest.Mock).mockRejectedValueOnce(new Error("Server error"));

    render(<NewAppointmentForm {...baseProps} />);

    fireEvent.change(screen.getByPlaceholderText(/motivo/i), {
      target: { value: "Chequeo" },
    });
    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Error",
          description: expect.stringMatching(/problema/i),
        })
      );
    });
  });

  it("muestra toast de modo demo y ejecuta onSuccess sin llamadas a la API", async () => {
    jest.useFakeTimers();
    render(<NewAppointmentForm {...baseProps} isDemo />);

    fireEvent.change(screen.getByPlaceholderText(/motivo/i), {
      target: { value: "Chequeo" },
    });
    fireEvent.click(screen.getByTestId("submit-btn"));

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Turno simulado",
        })
      );
      expect(createAppointment).not.toHaveBeenCalled();
      expect(mockOnSuccess).toHaveBeenCalled();
    }, { timeout: 2000 });
    jest.useRealTimers();
  });
});
