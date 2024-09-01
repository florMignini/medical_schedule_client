import Icon from "@/components/ui/icon";
import EditIcon from "../../../public/assets/icons/pencil.svg";

const ProfessionalDashboard = () => {
  return (
    <>
      <div className="flex h-auto flex-col lg:grid lg:grid-cols-[70%,30%] gap-4">
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
        <div className="w-[99%] hidden lg:grid lg:gris-cols-[20%,80%] px-2 py-1 bg-dark-400 rounded-md">
          {/* head */}
          <div className="w-[99%] h-10 flex items-center justify-between rounded-lg bg-dark-300 px-2">
            <h1 className="text-18-bold text-left">Mi Perfil</h1>
            <button className="text-16-bold hover:text-light-500 hover:scale-110 hover:font-extrabold">
              <Icon src={EditIcon} alt="edit-icon" width={24} height={24} />
            </button>
          </div>
          <div className="w-[99%] grid grid-rows-[70%,30%]">
            <div className="h-32">
              <h1>top</h1>
            </div>
            <div className="h-12">
              <h1>bottom</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfessionalDashboard;
