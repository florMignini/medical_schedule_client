import InstitutionRegisterForm from "@/components/forms/InstitutionRegisterForm";
import { ScrollArea } from "@/components/ui/scroll-area";

const InstitutionRegistration = () => {
  // TODO: bring user info
  return (
    <section className="w-full h-screen flex flex-col items-center justify-start gap-2">
      <ScrollArea className="h-[98%] w-[99%] rounded-md border border-dark-500 p-4">
      <InstitutionRegisterForm />
      </ScrollArea>
    </section>
  );
};

export default InstitutionRegistration;
