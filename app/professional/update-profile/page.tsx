
import { apiServer } from "@/api/api-server";
import ProfessionalProfileUpdateForm from "@/components/forms/ProfessionalProfileUpdateForm";
import { ProfessionalInformation } from "@/interfaces";
import { cookies } from "next/headers";

const ProfessionalProfileUpdate = async () => {
  const cookieStore = cookies();
    const professionalId = cookieStore.get("professional-id")?.value;
  
    let {data} :any = await apiServer.get(
      `/professional/get-for-update/${professionalId}`
    );

  return (
    <section className="w-full h-screen flex flex-col items-center justify-start gap-2">
      <ProfessionalProfileUpdateForm 
      {...data}
      />
    </section>
  );
};

export default ProfessionalProfileUpdate;