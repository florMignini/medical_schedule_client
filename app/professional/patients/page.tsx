import Icon from "@/components/ui/icon";
import userImage from "../../../public/assets/icons/users.svg";
import plusImage from "../../../public/assets/icons/plus.svg";
import Link from "next/link";

const PatientsPage = () => {
  return (
    <section className="w-full h-screen flex flex-col items-center justify-start gap-2">
      {/* Title */}
      <div className="flex w-[90%] h-10 items-start justify-start px-2">
        <h1 className="text-24-bold text-start">Pacientes</h1>
      </div>

      <div className="w-[90%] grid grid-cols-[20%,80%] gap-3">
        {/* left side */}
        <div className="flex items-center justify-start gap-2">
          <Icon src={userImage} alt="user-icon-image" height={30} width={30} />
          <div className="flex items-center justify-start gap-1">
            <h1 className="text-32-bold text-dark-500">72</h1>
            <p className="text-16-semibold">pacientes</p>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <Link className="flex items-center justify-center gap-2 bg-emerald-400 p-1 rounded-lg cursor-pointer hover:scale-105 active:outline-none"
          href="/professional/patient-registration"
          >
            <Icon
              src={plusImage}
              alt="add-patient-icon"
              width={20}
              height={20}
            />
            <p className="text-dark-200">Agregar paciente</p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PatientsPage;
