"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { IPatientsResponse } from "@/interfaces"
import Icon from "@/components/ui/icon"
import Link from "next/link"

const PatientInfo = () => {
  const {patientId} = useParams<{patientId:string}>()
  const [patientInfo, setPatientInfo] = useState<IPatientsResponse>()
 
  useEffect(() => {
    async function fetchPatientInfo() {
      let res = await fetch(`http://localhost:3001/api/patients/get-patient/${patientId}`)
      let data = await res.json()
      setPatientInfo(data)
    }
    fetchPatientInfo()
  }, [patientId])
 console.log(patientInfo)
//  skeleton
  if (!patientInfo) return <div>Loading...</div>
  
  return (
    <section className="w-full h-screen flex flex-col items-center justify-start gap-2">
      {/* Title */}
      <div className="flex w-[90%] h-10 items-start justify-start ">
        <h1 className="text-18-bold text-start">Paciente</h1>
      </div>
       {/* top section */}
       <div className="w-[95%] h-auto px-2 py-3 grid grid-cols-[20%,80%] gap-3 bg-dark-400 rounded-md">
          <Image
          src={patientInfo.patientPhotoUrl}
          alt="patient-photo"
          width={80}
          height={80}
          className="rounded-full flex items-center justify-center"
          />
          <div className="w-full h-auto text-white flex  items-start justify-center my-auto">
            {/* left side */}
            <div className="w-[50%] flex flex-col">
            <h1 className="text-18-bold">{`${patientInfo.firstName} ${patientInfo.lastName}`}</h1>
            <p className="opacity-50 text-16-regular"><strong>{patientInfo.identificationType}: </strong>{patientInfo.identityNumber}</p>
            </div>
            {/* rightside */}
            <div className="w-[45%] h-auto flex items-end justify-center">
            <Link
            className="w-[50%] flex items-center justify-center bg-blue-700 p-1 rounded-lg cursor-pointer hover:scale-105 active:outline-none"
            href="/professional/patient-registration"
          >
            {/* <Icon
              src={plusImage}
              alt="add-patient-icon"
              width={15}
              height={15}
            /> */}
            <p className="text-white text-14-medium">Crear Cita</p>
          </Link>
            </div>
          </div>
       </div>
    </section>
  )
}

export default PatientInfo