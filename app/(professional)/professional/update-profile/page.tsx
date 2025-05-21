
import { apiServer } from "@/api/api-server";
import ProfessionalPasswordUpdateForm from "@/components/forms/ProfessionalPasswordUpdateForm";
import ProfessionalProfileUpdateForm from "@/components/forms/ProfessionalProfileUpdateForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { cookies } from "next/headers";

const ProfessionalProfileUpdate = async () => {
  const cookieStore = cookies();
    const professionalId = cookieStore.get("professional-id")?.value;
  
    let {data} :any = await apiServer.get(
      `/professional/get-for-update/${professionalId}`
    );

  return (
    <section className="w-full h-screen flex flex-col items-center justify-start pl-2 gap-2">
      <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger
        value="profile">Perfil</TabsTrigger>
        <TabsTrigger value="password">Contraseña</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
      <ProfessionalProfileUpdateForm 
      {...data}
      />
      </TabsContent>
      <TabsContent value="password">
        <ProfessionalPasswordUpdateForm/>
      </TabsContent>
      </Tabs>
      
    </section>
  );
};

export default ProfessionalProfileUpdate;