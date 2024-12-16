import Image from "next/image";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Icon from "@/components/ui/icon";

import { apiServer } from "@/api/api-server";
import { ProfessionalInformation } from "@/interfaces";
import Phone from "@/app/professional/components/icons/Phone";
import Mail from "@/app/professional/components/icons/Mail";

const page = async() => {
    let  {data}  = await apiServer.get(
        `/professional/get-all-professionals`
      );

  return(
    <section className="w-full h-screen flex flex-col items-center justify-start mx-auto gap-2">
        {/* // professionals list */}
    <div className="w-[100%] bg-white text-[#EBEBEB] flex flex-col">
            <p className="p-3 font-semibold text-3xl text-dark-600">Professionals</p>
            {/* professional table */}
            <Table>
              <TableHeader className="text-dark-600">
                <TableRow>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="w-[99%] ">
                {data.map(( professional : ProfessionalInformation) => (
                  <TableRow key={professional.id}
                  className="border border-dark-500 shadow-md shadow-dark-700 rounded-md p-1"
                  >
                    <TableCell key={professional.id}>
                      <Link
                        href={`#`}
                        className="flex gap-1 items-center justify-start "
                      >
                        <Image
                          src={professional.userImage ? professional.userImage : `https://static.vecteezy.com/system/resources/thumbnails/037/336/395/small_2x/user-profile-flat-illustration-avatar-person-icon-gender-neutral-silhouette-profile-picture-free-vector.jpg`}
                          alt="patient-profile-photo"
                          width={40}
                          height={40}
                          className="flex rounded-full"
                        />
                        <p className="text-14-medium">
                          {`${professional.firstName} ${professional.lastName}`}
                        </p>
                      </Link>
                    </TableCell>
                    <TableCell key={professional.phoneNumber}>
                      <Link
                        href={`/professional/patients/${professional.id}/info`}
                        className="text-14-medium flex gap-1"
                      >
                        <Phone
                          width={20}
                          height={20}
                        />
                        {professional.phoneNumber}
                      </Link>
                    </TableCell>
                    <TableCell key={professional.email}>
                      <Link
                        href={`/professional/patients/${professional.id}/info`}
                        className="text-14-medium flex gap-1"
                      >
                        <Mail
                          width={20}
                          height={20}
                        />
                        {professional.email}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
    </section>
  )
};

export default page;
