import Icon from "@/components/ui/icon";
import userImage from "../../../public/assets/icons/users.svg";
import plusImage from "../../../public/assets/icons/plus.svg";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchPatients } from "@/app/actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IPatientsResponse } from "@/interfaces";
import Image from "next/image";
import MailIcon from "../../../public/assets/icons/email.svg";
import PhoneIcon from "../../../public/assets/icons/phone.svg";
const PatientsPage = async () => {
  let data = await fetch(`http://localhost:3001/api/patients/get-all-patients`);
  let patients = await data.json();

  return (
    <section className="w-full h-screen flex flex-col items-center justify-start gap-2">
      {/* Title */}
      <div className="flex w-[90%] h-10 items-start justify-start px-2">
        <h1 className="text-18-bold text-start">Pacientes</h1>
      </div>
      {/* top section */}
      <div className="w-[90%] grid grid-cols-[20%,80%] gap-3">
        {/* leftside */}
        <div className="flex items-center justify-start gap-2">
          <Icon src={userImage} alt="user-icon-image" height={25} width={25} />
          <div className="flex items-center justify-start gap-1">
            <h1 className="text-18-bold text-dark-500">{patients.length}</h1>
            <p className="text-18-bold">
              {patients.length < 2 ? `paciente` : `pacientes`}
            </p>
          </div>
        </div>
        {/* rightside */}
        <div className="flex items-center justify-end">
          <Link
            className="flex items-center justify-center gap-2 bg-emerald-400 p-1 rounded-lg cursor-pointer hover:scale-105 active:outline-none"
            href="/professional/patient-registration"
          >
            <Icon
              src={plusImage}
              alt="add-patient-icon"
              width={15}
              height={15}
            />
            <p className="text-dark-200 text-14-medium">Agregar paciente</p>
          </Link>
        </div>
      </div>

      {/* patients table */}
      <Table>
        <TableHeader className="bg-dark-500 bg-opacity-50 rounded-md mb-4">
          <TableRow className="rounded-lg">
            <TableHead>Nombre Completo</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Dirección</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            {patients.map((patient: IPatientsResponse) => (
              <>
                <TableCell key={patient.identityNumber}>
                  <Link
                    href="/"
                    className="flex gap-1 items-center justify-start"
                  >
                    <Image
                      src={patient.patientPhotoUrl}
                      alt="patient-profile-photo"
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <p className="text-white text-14-medium">
                      {`${patient.firstName} ${patient.lastName}`}
                    </p>
                  </Link>
                </TableCell>
                <TableCell key={patient.phone}>
                  <Link
                    href="/"
                    className="text-white text-14-medium flex gap-1"
                  >
                    <Icon
                      src={PhoneIcon}
                      alt="phone-Icon"
                      width={20}
                      height={20}
                    />
                    {patient.phone}
                  </Link>
                </TableCell>
                <TableCell key={patient.email}>
                  <Link
                    href="/"
                    className="text-white text-14-medium flex gap-1"
                  >
                    <Icon
                      src={MailIcon}
                      alt="Mail-Icon"
                      width={20}
                      height={20}
                    />
                    {patient.email}
                  </Link>
                </TableCell>
                <TableCell key={patient.address}>
                  <Link href="/" className="text-white text-14-medium">
                    {patient.address}
                  </Link>
                </TableCell>
              </>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
};

export default PatientsPage;
