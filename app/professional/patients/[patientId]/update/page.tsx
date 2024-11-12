"use client"
import { apiServer } from '@/api/api-server';
import PatientProfileUpdateForm from '@/components/forms/PatientProfileUpdateForm'
import { ScrollArea } from '@/components/ui/scroll-area';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const PatientUpdate = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [patientInfo, setPatientInfo] = useState<any>();

  useEffect(() => {
    async function fetchPatientInfo() {
      try {
            const {data} = await apiServer.get(`/patients/get-patient/${patientId}`)
        
            setPatientInfo(data);
          } catch (error) {
           console.error(error)
          }
    }
    fetchPatientInfo();
  }, []);

  return (
    <section className="w-full h-screen flex flex-col items-center justify-start gap-2">
    <ScrollArea className="h-[98%] w-[99%] rounded-md border border-dark-500 p-4">
    <PatientProfileUpdateForm
    {...patientInfo}
    />
    </ScrollArea>
  </section>
  )
}

export default PatientUpdate