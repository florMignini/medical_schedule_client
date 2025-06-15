
import { Patient } from "@/interfaces";
import { Label } from "@radix-ui/react-label";

export const PatientInfoSection = (patientInfo: Patient) => {

  const { address, gender, phone, email, occupation, bloodType, bloodFactor, emergencyContactName, emergencyContactNumber, allergies, allergic, smoker, exSmoker, insurancePolicyNumber, insuranceProvider, patientBFP, patientBMI, patientHeight, patientWeight, pastMedicalHistory, medicalHistoryType, familyMedicalHistory, medicalHistory  } = patientInfo;
  return (
    <section className="w-full flex flex-col items-center justify-start gap-3">
      {/* patient personal information */}
      <div className="w-[95%] bg-[#262626] flex flex-col items-start justify-start px-2 py-3 shadow-[inset_0px_-2px_3px_rgba(73,73,73,0.2)] rounded-xl text-white">
        {/* title */}
        <div className="flex items-center justify-start gap-2">
          <div className="h-5 border-x-2 border-emerald-500 " />
          <h1 className="font-mono text-sm lg:text-base">Informacion Personal</h1>
        </div>
        {/* form data section */}
        <div className="w-[100%] flex items-center justify-start flex-wrap gap-12 pt-5 text-xs lg:text-sm">
          {/* genero */}
          <div className="flex flex-col">
            <Label
              htmlFor="gender"
              className="font-light text-[13px] text-gray-300 font-mono"
            >
              Género
            </Label>
            <h6 className="text-[12px] md:text-[14px]">{gender === "F" ? "Femenino" : "Masculino"}</h6>
          </div>
          {/* email */}
          <div className="flex flex-col">
            <Label
              htmlFor="email"
              className="font-light text-[13px] text-gray-300 font-mono"
            >
              Email
            </Label>
            <h6 className="text-[12px] md:text-[14px]">{email}</h6>
          </div>
           {/* occupation */}
           <div className="flex flex-col">
            <Label
              htmlFor="occupation"
              className="font-light text-[13px] text-gray-300 font-mono"
            >
              Ocupación
            </Label>
            <h6 className="text-[12px] md:text-[14px]">{occupation}</h6>
          </div>
          {/* mobile phone */}
          <div className="flex flex-col">
            <Label
              htmlFor="phone"
              className="font-light text-[13px] text-gray-300 font-mono"
            >
              Telefono
            </Label>
            <h6 className="text-[12px] md:text-[14px]">{phone}</h6>
          </div>
          {/* address */}
          <div className="flex flex-col">
            <Label
              htmlFor="address"
              className="font-light text-[13px] text-gray-300 font-mono"
            >
              Dirección
            </Label>
            <h6 className="text-[12px] md:text-[14px]">{address}</h6>
          </div>
           {/* insurance provider & policy number */}
           <div className="flex flex-col">
            <Label
              htmlFor="insurance provider & policy number"
              className="font-light text-[13px] text-gray-300 font-mono"
            >
              Proveedor y Número de Política de Seguro
            </Label>
            <h6 className="text-[12px] md:text-[14px]">{`${insuranceProvider}- N° ${insurancePolicyNumber}`}</h6>
          </div>
          {/* Blood type & factor */}
          <div className="flex flex-col">
            <Label
              htmlFor="Blood type & factor"
              className="font-light text-[13px] text-gray-300 font-mono"
            >
              Tipo y Factor de Sangre
            </Label>
            <h6 className="text-[12px] md:text-[14px]">{`${bloodType} ${bloodFactor === "Negativo" ? "-" : "+"}`}</h6>
          </div>
          {/* emergency contact name & number */}
          <div className="flex flex-col">
            <Label
              htmlFor="emergency contact name"
              className="font-light text-[13px] text-gray-300 font-mono"
            >
              Contacto de Emergencia
            </Label>
            <h6 className="text-[12px] md:text-[14px]">{emergencyContactName}</h6>
          </div>
          <div className="flex flex-col">
            <Label
              htmlFor="emergency contact number"
              className="font-light text-[13px] text-gray-300 font-mono"
            >
             Número de Emergencia
            </Label>
            <h6 className="text-[12px] md:text-[14px]">{emergencyContactNumber}</h6>
          </div>
        </div>
      </div>

      {/* medical information */}
      <div className="w-[95%] flex flex-col text-white items-start justify-start bg-[#262626] px-2 py-3 shadow-[inset_0px_-2px_3px_rgba(73,73,73,0.2)] rounded-xl">
        {/* title general */}
        <div className="flex items-center justify-start gap-2">
          <div className="h-5 border-x-2 border-emerald-500" />
          <h1 className="font-mono text-sm lg:text-base">Informacion Médica</h1>
        </div>
        {/* form data section */}
        <div className="w-[100%] flex items-center justify-start flex-wrap gap-12 pt-5">
          {/* smoker */}
          <div className="flex flex-col">
            <Label
              htmlFor="smoker"
              className="font-light text-[13px] text-gray-300"
            >
              Fumador
            </Label>
            <h6 className="text-[12px] md:text-[14px]">{smoker}</h6>
          </div>
          {/* ex-smoker */}
          <div className="flex flex-col">
            <Label
              htmlFor="exSmoker"
              className="font-light text-[13px] text-gray-300"
            >
              Ex Fumador
            </Label>
            <h6 className="text-[12px] md:text-[14px]">{exSmoker}</h6>
          </div>
          {/* allergies type */}
          <div className="flex flex-col">
            <Label
              htmlFor="allergiesType"
              className="font-light text-[13px] text-gray-300"
            >
              Alergico/a
            </Label>
            <h6 className="text-[12px] md:text-[14px]">{allergic}</h6>
          </div>
          {/* allegies */}
          <div className="flex flex-col">
            <Label
              htmlFor="allergies"
              className="font-light text-[13px] text-gray-300"
            >
              Alergias
            </Label>
            <h6 className="text-[12px] md:text-[14px]">{allergies}</h6>
          </div>
          {/* weight */}
          <div className="flex flex-col">
            <Label
              htmlFor="weight"
              className="font-light text-[13px] text-gray-300"
            >
              Peso
            </Label>
            <h6 className="text-[12px] md:text-[14px]">{patientWeight}</h6>
          </div>
           {/* height */}
           <div className="flex flex-col">
            <Label
              htmlFor="height"
              className="font-light text-[13px] text-gray-300"
            >
              Altura
            </Label>
            <h6 className="text-[12px] md:text-[14px]">{patientHeight}</h6>
          </div>
           {/* BMI */}
           <div className="flex flex-col">
            <Label
              htmlFor="BMI"
              className="font-light text-[13px] text-gray-300"
            >
              Indice de Masa 
            </Label>
            <h6 className="text-[12px] md:text-[14px]">{patientBMI}</h6>
          </div>
          {/* BFP */}
          <div className="flex flex-col">
            <Label
              htmlFor="BFP"
              className="font-light text-[13px] text-gray-300"
            >
              Indice de Grasa (%) 
            </Label>
            <h6 className="text-[12px] md:text-[14px]">{patientBFP}</h6>
          </div>
        </div>
         {/* title history */}
         <div className="flex items-center justify-start gap-2 pt-5">
          <div className="h-5 border-x-2 border-emerald-500" />
          <h1 className="font-mono text-sm lg:text-base">Antecedentes Médicos</h1>
        </div>
        {/* history data */}
        <div className="w-[100%] flex items-center justify-start flex-wrap gap-12 pt-5">
           {/* familiar medical history */}
           <div className="flex flex-col">
            <Label
              htmlFor="family medical history"
              className="font-light text-[13px] text-gray-300"
            >
              Antecedentes Médicos Familiares
            </Label>
            <h6 className="text-[12px] md:text-[14px]">{familyMedicalHistory}</h6>
          </div>
           {/* medical history type */}
           <div className="flex flex-col">
            <Label
              htmlFor="family medical history"
              className="font-light text-[13px] text-gray-300"
            >
              Antecedentes Médicos
            </Label>
            <h6 className="text-[12px] md:text-[14px]">{medicalHistoryType}</h6>
          </div>
           
        </div>
      </div>
    </section>
  );
};
