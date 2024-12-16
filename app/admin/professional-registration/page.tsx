import { ScrollArea } from "@/components/ui/scroll-area";
import ProfessionalRegistrationForm from "../components/forms/ProfessionalRegistrationForm";

const ProfessionalRegistration = () => {
  return (
    <section className="w-full h-screen flex pt-2 flex-col items-center justify-start gap-2">
      <ScrollArea className="h-[98%] w-[99%] rounded-md border border-dark-500 p-4">
        <ProfessionalRegistrationForm />
      </ScrollArea>
    </section>
  );
};

export default ProfessionalRegistration;
