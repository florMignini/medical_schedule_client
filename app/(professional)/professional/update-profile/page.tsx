import { apiServer } from "@/api/api-server";
import ProfessionalPasswordUpdateForm from "@/components/forms/ProfessionalPasswordUpdateForm";
import ProfessionalProfileUpdateForm from "@/components/forms/ProfessionalProfileUpdateForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_BASE_URL } from "@/lib/constants.api";

import { cookies } from "next/headers";

const ProfessionalProfileUpdate = async () => {
  const cookieStore = cookies();
  const professionalId = cookieStore.get("professional-id")?.value;
    const isDemo = cookieStore.get("isDemo")?.value ? true : false;

  const baseUrl = isDemo
    ? API_BASE_URL.demo
    : API_BASE_URL.prod;

  let data : any = await fetch(
    `${baseUrl}/professional/get-for-update/${professionalId}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  ).then((res) => res.json());
  return (
    <section className="w-[99%] p-6 mx-auto h-screen flex flex-col items-center justify-start gap-2 text-color bg-white/90 rounded-lg shadow-md">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="password">Contraseña</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfessionalProfileUpdateForm professionalInfo={data} readOnly={isDemo} />
        </TabsContent>
        <TabsContent value="password">
          <ProfessionalPasswordUpdateForm readOnly={isDemo} />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default ProfessionalProfileUpdate;
