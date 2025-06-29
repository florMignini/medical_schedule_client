"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// import { Professionals } from "./sections/Professionals";
// import { Offices } from "./sections/Offices";
// import { Appointments } from "./sections/Appointments";
import { Overview } from "./Overview";

interface Props {
  institutionId: string;
}

export function InstitutionTabs({ institutionId }: Props) {
  return (
    <Tabs defaultValue="overview" className="w-full mt-4">
      <TabsList>
        <TabsTrigger value="overview">Info general</TabsTrigger>
        <TabsTrigger value="professionals">Profesionales</TabsTrigger>
        <TabsTrigger value="offices">Consultorios</TabsTrigger>
        <TabsTrigger value="appointments">Turnos</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <Overview institutionId={institutionId} />
      </TabsContent>
      <TabsContent value="professionals">
        {/* <Professionals institutionId={institutionId} /> */}
      </TabsContent>
      <TabsContent value="offices">
        {/* <Offices institutionId={institutionId} /> */}
      </TabsContent>
      <TabsContent value="appointments">
        {/* <Appointments institutionId={institutionId} /> */}
      </TabsContent>
    </Tabs>
  );
}
