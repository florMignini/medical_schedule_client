import { apiServer } from "@/api/api-server";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ConfigButton from "../components/ConfigButton";
import Institution from "../components/icons/Institution";
import Phone from "../components/icons/Phone";
import Mail from "../components/icons/Mail";
import AddButton from "../components/AddButton";

const InstitutionsPage = async () => {
  const { data } = await apiServer.get(`/institutions/get-all-institutions`);

  return (
    <section className="w-full h-screen flex flex-col items-center justify-start gap-2 text-color">
      {/* Title */}
      <div className="flex w-[90%] h-10 items-start justify-start px-2">
        <h1 className="text-18-bold text-start">Instituciones</h1>
      </div>
      {/* top section */}
      <div className="w-[90%] flex items-center justify-between my-5">
        {/* leftside */}
        <div className="w-[50%] flex items-center justify-start gap-2">
          <Institution height={25} width={25} />
          <div className="flex items-center justify-start gap-1">
            <h1 className="text-18-bold">{data.length}</h1>
            <p className="text-18-bold">
              {data.length < 2 ? `institución` : `instituciones`}
            </p>
          </div>
        </div>
        {/* rightside */}
        <div className="w-[50%] flex items-center justify-end">
          <AddButton
            text="institucion"
            to="/professional/institution-registration"
          />
        </div>
      </div>

      {/* institutions table */}
      <div className="w-[95%] py-4 px-3 glass-effect flex flex-col">
        {data && data?.length! < 1 ? (
          <div className="w-[90%] flex items-center font-semibold justify-center gap-10">
            <p>Aún no posee instituciones activas</p>
          </div>
        ) : (
          <>
            {/*header*/}
            <div className="w-[99%] px-3 flex items-center justify-between border-b-[1px] mb-3 border-b-gray-500 text-black">
              <p className="w-[25%] max-[690px]:w-[50%] h-10 text-sm font-medium text-start">
                institucion
              </p>
              <p className="w-[25%] max-[690px]:w-[50%] h-10 text-sm font-medium text-start">
                Teléfono
              </p>
              <p className="w-[25%] h-10 text-sm font-medium text-start max-[690px]:hidden">
                Mail
              </p>
              <p className="w-[25%] h-10 text-sm font-medium text-start max-[690px]:hidden">
                Dirección
              </p>
            </div>
            <div className="w-full px-1 gap-2">
              {data &&
                data.map((institution: any) => (
                  <div
                    className="w-[100%] flex items-center justify-center"
                    key={institution.id}
                  >
                    <Link
                      href={`/professional/institutions/${institution.id}/detail`}
                      className="w-[80%] sm:w-[98%] mx-auto px-2 flex justify-between border-b-[1px] border-gray-500 mb-1 hover:scale-[102%] hover:bg-card-hover-100 text-gray-700 hover:text-white hover:rounded-lg"
                    >
                      <div
                        key={institution.id}
                        className="max-[690px]:w-[100%] w-[25%] px-1 py-2 flex items-center justify-start"
                      >
                        <div className="flex gap-1 items-center justify-start">
                          <Image
                            src={institution.institutionImage}
                            alt="institution-photo"
                            width={40}
                            height={40}
                            className="rounded-full bg-gradient-to-b from-black to-[#001E80]"
                          />
                          <p className="text-[14px] font-semibold truncate">
                            {`${institution.name}`}
                          </p>
                        </div>
                      </div>
                      <div
                       className="hidden max-[690px]:w-[50%] px-1 py-2 sm:flex items-center justify-start"
                        key={institution.phone}
                      >
                        <div className="text-[14px] font-normal flex gap-1 items-center justify-start truncate">
                          <Phone width={20} height={20} />
                          {institution.phone}
                        </div>
                      </div>
                      <div
                        className="hidden max-[690px]:w-[50%] w-[25%] px-1 mx-auto py-2 md:flex items-center justify-start truncate"
                        key={institution.email}
                      >
                        <div className="text-[14px] font-normal flex gap-1">
                          <Mail width={20} height={20} />
                          {institution.email}
                        </div>
                      </div>
                      <div
                        className="max-[650px]:hidden w-[25%] px-1 py-2 flex items-center justify-start"
                        key={institution.address}
                      >
                        <div className="text-[14px] font-normal">
                          {institution.address}
                        </div>
                      </div>
                    </Link>
                    <div className="w-[20%] sm:w-[10%] flex items-center justify-center">
                      <ConfigButton
                        id={institution.id}
                        component={"institutions"}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default InstitutionsPage;
