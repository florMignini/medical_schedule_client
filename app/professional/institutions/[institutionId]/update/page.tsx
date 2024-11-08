"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiServer } from "@/api/api-server";
import InstitutionUpdateForm from "@/components/forms/InstitutionUpdateForm";

const InstitutionUpdate = () => {
  const { institutionId } = useParams<{ institutionId: string }>();
  const [institutionInfo, setInstitutionInfo] = useState<any>();

  useEffect(() => {
    async function fetchInstitutionInfo() {
      try {
        let {data} = await apiServer.get(`/institutions/get-institution/${institutionId}`)
      setInstitutionInfo(data);
      } catch (error) {
        console.log(error)
      }
    }
    fetchInstitutionInfo();
  }, [institutionId]);
  return (
    <section className="w-full h-screen flex flex-col items-center justify-start gap-2">
      <InstitutionUpdateForm 
      {...institutionInfo}
      />
    </section>
  );
};

export default InstitutionUpdate;


