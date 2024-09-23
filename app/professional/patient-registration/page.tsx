import PatientRegisterForm from "@/components/forms/PatientRegisterForm";

const PatientRegistration = () => {
  // TODO: bring user info
  return (
    <section className="w-full h-screen flex flex-col items-center justify-start gap-2">
      <PatientRegisterForm />
    </section>
  );
};

export default PatientRegistration;
