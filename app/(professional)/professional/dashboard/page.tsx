"use client";
import {
  AppointmentsIncluded,
  InstitutionsIncluded,
  PatientsIncluded,
} from "@/interfaces";
import Link from "next/link";
import PatientsByAge from "../components/charts/PatientsByAge";
import { useProfessionalIncludes } from "@/hooks/useProfessionalIncludes";
import Loading from "../components/Loading";
import InstitutionCardWithActions from "../institutions/components/InstitutionCardWithActions";
import StatsCardsWrapper from "../components/StatsCardsWrapper";
import AppointmentsPerWeekChart from "../components/charts/AppointmentsPerWeekChart";
import PatientCardWithActions from "../patients/components/PatientCardWithAction";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { AnimatedDialog } from "../institutions/components/AnimatedDialog";
import PatientRegistrationForm from "@/components/forms/PatientRegisterForm";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../../../../components/ui/button";
import NewAppointmentForm from "@/components/forms/NewAppointmentForm";

type ModalMode = "patient" | "appointment" | null;
const ProfessionalDashboard = () => {
  //modal states
  const [formOpen, setFormOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const { data, isDemo, refetch } = useProfessionalIncludes();
  const { toast } = useToast();
  const handleRefetch = useCallback(async () => {
    try {
      await refetch();
    } catch (err) {
      console.error("Error al refetchear pacientes:", err);
    }
  }, [refetch]);

  if (!data || !data.patientsIncluded || !data.institutionsIncluded) {
    return <Loading />;
  }

  const handleOpenCreate = (entity: ModalMode) => {
    setModalMode(entity);
    setFormOpen(true);
  };

  const handleClose = () => {
    setFormOpen(false);
    setModalMode(null);
  };

  const handleSuccess = async (action: "create" | "edit") => {
    toast({
      title:
        action === "edit"
          ? isDemo
            ? "Edición simulada"
            : "Paciente actualizado"
          : isDemo
          ? "Creación simulada"
          : "Paciente creado",
      description:
        action === "edit"
          ? isDemo
            ? "Este es un entorno de prueba"
            : "¡Paciente editado correctamente!"
          : isDemo
          ? "Este es un entorno de prueba"
          : "¡Paciente creado correctamente!",
      className:
        action === "edit"
          ? isDemo
            ? "bg-blue-500 text-white"
            : "bg-green-500 text-white"
          : isDemo
          ? "bg-blue-500 text-white"
          : "bg-green-500 text-white",
    });

    handleClose();
    await handleRefetch();
  };
  // @ts-ignore
  const { patientsIncluded }: { patientsIncluded: PatientsIncluded[] } = data;
  // @ts-ignore
  const {
    appointmentsIncluded,
  }: { appointmentsIncluded: AppointmentsIncluded[] } = data;
  // @ts-ignore
  const {
    institutionsIncluded,
  }: { institutionsIncluded: InstitutionsIncluded[] } = data;

  const previewPatients = patientsIncluded.slice(0, 6);
  const previewInstitutions = institutionsIncluded.slice(0, 3);

  const professionalName = `${data?.firstName || ""} ${
    data?.lastName || ""
  }`.trim();

  // Calcular turnos de hoy
  const today = dayjs().format("YYYY-MM-DD");
  const todaysAppointments = appointmentsIncluded.filter(
    (appt) => dayjs(appt?.appointment?.schedule).format("YYYY-MM-DD") === today
  );

  return (
    <section className="w-full h-full flex flex-col overflow-y-auto px-6 md:px-12 py-8 gap-8 bg-gradient-to-br from-[#f0f4f8] via-[#f9fafa] to-[#e8f0ff]">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-gray-800">
            Hola, {data?.gender === "F" ? "Dra" : "Dr"} {professionalName.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-600 text-sm">
            Resumen de tu actividad y estadísticas más recientes.
          </p>
        </div>

        {/* Call to Action */}
        <div className="flex gap-3 ">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className="p-1  rounded-xl text-gray-700 text-sm font-light shadow-xl hover:bg-gray-300 transition"
              onClick={() => handleOpenCreate("appointment")}
            >
              + Agendar turno
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => handleOpenCreate("patient")}
              className="p-1 rounded-xl text-gray-700 text-sm font-light shadow-xl hover:bg-gray-300 transition"
            >
              + Nuevo paciente
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Resumen diario */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b-2 border-gray-200 pb-4 mb-4"
      >
        <p className="text-gray-700 text-base font-base">
          📅 
          <span className="font-semibold text-blue-600 ml-4">
           Tenes{" "} {todaysAppointments.length} turnos programados para hoy.
          </span>{" "}
          
        </p>
      </motion.div>

      {/* Stats */}
      <StatsCardsWrapper
        data={[
          { label: "Pacientes", value: patientsIncluded.length },
          { label: "Turnos", value: appointmentsIncluded.length },
        ]}
      />

      {/* Charts */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white shadow-lg rounded-2xl p-4"
        >
          <PatientsByAge patients={patientsIncluded} />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white/40 backdrop-blur-md shadow-lg rounded-2xl p-4 border border-white/20"
        >
          <h2 className="text-lg font-semibold mb-2 text-gray-700">
            Turnos por día (últimos 7 días)
          </h2>
          <AppointmentsPerWeekChart appointments={appointmentsIncluded} />
        </motion.div>
      </div>

      {/* Pacientes */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white shadow-lg rounded-2xl p-6 w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 hover:text-gray-500 transition-colors">
            Pacientes
          </h2>
          <div className="flex gap-3">
            <Link
              href="/professional/patients"
              className="text-blue-600 hover:font-bold text-sm transition-colors"
            >
              Ver todos
            </Link>
          </div>
        </div>

        {patientsIncluded.length < 1 ? (
          <p className="text-gray-600">Aún no posee pacientes registrados</p>
        ) : (
          <PatientCardWithActions isDemo={isDemo} showFloatingButton={false} />
        )}
        <p className="text-xs text-gray-400 mt-2">
          Mostrando {previewPatients.length} de {patientsIncluded.length}{" "}
          pacientes
        </p>
      </motion.div>

      {/* Instituciones */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white shadow-lg rounded-2xl p-6 w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 hover:text-gray-500 transition-colors">
            Instituciones
          </h2>
          <div className="flex gap-3">
            <Link
              href="/professional/institutions"
              className="text-blue-600 hover:font-bold text-sm transition-colors"
            >
              Ver todas
            </Link>
          </div>
        </div>

        {institutionsIncluded.length < 1 ? (
          <p className="text-gray-600">Aún no posee instituciones activas</p>
        ) : (
          <InstitutionCardWithActions
            isDemo={isDemo}
            showFloatingButton={false}
          />
        )}
        <p className="text-xs text-gray-400 mt-2">
          Mostrando {previewInstitutions.length} de{" "}
          {institutionsIncluded.length} instituciones
        </p>
      </motion.div>

      {formOpen && modalMode !== "appointment" && (
        <AnimatedDialog open={formOpen} onOpenChange={setFormOpen}>
          {modalMode === "patient" ? (
            <PatientRegistrationForm
              onClose={handleClose}
              onSuccess={() => handleSuccess("create")}
            />
          ) : null}
        </AnimatedDialog>
      )}

      {/* Modal especial para turnos */}
      {formOpen && modalMode === "appointment" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex"
        >
          {/* Fondo oscuro con blur */}
          <motion.div
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Panel lateral derecho */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 20 }}
            className="relative ml-auto w-full max-w-md h-full bg-white shadow-2xl p-6 rounded-l-2xl overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Agendar nuevo turno
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                ✕
              </button>
            </div>

            <NewAppointmentForm
              type="create"
              patientId=""
              patientsList={patientsIncluded}
              onSuccess={() => handleSuccess("create")}
              component="dashboard"
              isDemo={isDemo}
            />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default ProfessionalDashboard;
