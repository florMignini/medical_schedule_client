import Icon from "@/components/ui/icon";
import EditIcon from "../../../public/assets/icons/pencil.svg";
import User from "../../../public/assets/profile-doctor.jpg";
import Image from "next/image";

const ProfessionalDashboard = () => {
  return (
    <>
      <div className="flex h-auto flex-col lg:grid lg:grid-cols-[60%,40%] xl:grid-cols-[70%,30%] gap-1">
        {/* information side */}
        <div className="flex flex-col gap-4">
          {/* patient section */}
          <div className="w-[99%] bg-dark-400 rounded-md">
            <p className="p-3 font-bold">Pacientes</p>
          </div>

          {/* institutions section */}
          <div className="w-[99%] bg-dark-400 rounded-md">
            <p className="p-3 font-bold">Instituciones</p>
          </div>
        </div>
        {/* profile & calendar side */}
        <div className="w-[99%] hidden lg:grid lg:gris-cols-[20%,80%] gap-3 px-2 py-1 bg-dark-400 rounded-md">
          {/* head */}
          <div className="w-[99%] h-10 flex items-center justify-between rounded-lg bg-dark-300 px-2">
            <h1 className="text-18-bold text-left">Mi Perfil</h1>
            <button className="text-16-bold hover:text-light-500 hover:scale-110 hover:font-extrabold">
              <Icon src={EditIcon} alt="edit-icon" width={24} height={24} />
            </button>
          </div>
          <div className="w-[99%] grid grid-cols-[40%,60%] gap-3">
            <div className="w-full h-auto">
            <Image
              src={User}
              alt="professional-image"
              className=""
              />
            </div>
            <div className="w-[95%] flex flex-col h-12 gap-1">
              <h1 className="text-16-semibold">Dr. Leandro Nahuel Mignini</h1>
              <p className="font-light text-12-regular">Clinica Medica</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfessionalDashboard;
