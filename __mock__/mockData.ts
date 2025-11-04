// 🧍‍♀️ Mock completo de un paciente

export const mockPatient: import("@/interfaces").Patient = {
  id: "e0b7a64d-8c18-4abc-9f41-2b1c7890abcd",
  createdAt: new Date("2024-05-01T10:15:00Z"),
  updatedAt: new Date("2024-06-10T14:30:00Z"),
  firstName: "María",
  lastName: "Fernández",
  patientPhotoUrl: "https://example.com/photos/maria-fernandez.jpg",
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
  pastAppointmentsIncluded: [
    { id: "appt-001", date: "2023-06-05", reason: "Control general" },
  ],
  appointmentsIncluded: [
    { id: "appt-004", date: "2024-06-12", reason: "Control anual" },
  ],
  followUpIncluded: [
    { id: "follow-201", date: "2024-07-10", notes: "Revisar plan de asma" },
  ],
};

// 🩺 Helper para generar mocks de AppointmentResult
export const mockAppointmentResult = (overrides = {}) => ({
  id: "appt-004",
  createdAt: "2024-06-10T10:00:00Z",
  updatedAt: "2024-06-10T11:00:00Z",
  notes: "Consulta simulada",
  reason: "Chequeo general",
  schedule: "2025-01-01T10:00:00Z",
  medicalInstitutionId: "inst-001",
  cancellationReason: null,
  patientsIncluded: [mockPatient],
  ...overrides,
});

// 🗓️ Helper para generar un mock simple de cita
export const mockAppointment = (overrides = {}) => ({
  appointment: {
    id: 101,
    patientId: mockPatient.id,
    schedule: "2025-01-01T10:00:00",
    notes: "Revisión general",
    reason: "Chequeo anual",
    pastAppointment: null,
  },
  ...overrides,
});
