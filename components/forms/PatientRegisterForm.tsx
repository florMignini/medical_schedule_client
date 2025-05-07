"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl } from "@/components/ui/form";
import DinamicForm from "../DinamicForm";
import Icon from "../ui/icon";
import { Label } from "../ui";
import { patientsRegisterValidation } from "@/lib";
import { FormFieldType } from "./ProfessionalLoginForm";
import {
  booleanOption,
  IdentificationType,
  Gender,
  bloodType,
  bloodFactor,
  medicalHistory,
  genderOptions,
  BooleanOption,
} from "@/app/professional/data";
import phoneIcon from "../../public/assets/icons/phone.svg";
import closeIcon from "../../public/assets/icons/close.svg";
import DropdownIcon from "../../public/assets/icons/arrowDown.svg";

import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import FileUploader from "../FileUploader";
import {
  createProfessionalPatientRelation,
  patientRegistration,
} from "@/app/actions";
import SubmitButton from "../SubmitButton";

const PatientRegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isThereAnImage, setIsTthereAnImage] = useState<boolean>(false);
  const [profData, setProfData] = useState<any>({});
  //get professional id
  useEffect(() => {
    const profData = localStorage.getItem("infoProfSession");
    if (profData) {
      setProfData(JSON.parse(profData));
    }
  }, []);
  const { id } = profData!;

  // dropdown states
  const [medicalHistoryType, setMedicalHistoryType] = useState("");
  const [identificationType, setIdentificationType] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof patientsRegisterValidation>>({
    resolver: zodResolver(patientsRegisterValidation),
    defaultValues: {
      firstName: "",
      lastName: "",
      patientPhoto: [],
      address: "",
      occupation: "",
      email: "",
      phone: "",
      birthDate: new Date(Date.now()),
      gender: "M" as Gender,
      identificationType: "DNI",
      identityNumber: "",
      emergencyContactName: "",
      contactRelationship: "",
      emergencyContactNumber: "",
      insuranceProvider: "",
      insurancePolicyNumber: "",
      smoker: "NO" as BooleanOption,
      exSmoker: "NO" as BooleanOption,
      bloodType: "A",
      bloodFactor: "Positivo",
      allergic: "NO" as BooleanOption,
      allergies: "",
      familyMedicalHistory: "",
      pastMedicalHistory: "",
      currentMedication: "",
      medicalHistoryType: "Clinico",
      patientHeight: "",
      patientWeight: "",
      patientBMI: "",
      patientBFP: "",
      patientWaist: "",
      patientHip: "",
      patientArm: "",
      patientTricepsFold: "",
      ObservationsComments: "",
      isActive: true,
    },
  });

  async function onSubmit(values: z.infer<typeof patientsRegisterValidation>) {
    setLoading(true);
    let formData;
    if (values.patientPhoto && values.patientPhoto.length > 0) {
      const blobFile = new Blob([values.patientPhoto[0]], {
        type: values.patientPhoto?.[0]?.type,
      });
      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.patientPhoto[0]?.name);
    }
    try {
      const patientData = {
        ...values,
        birthDate: new Date(values.birthDate),
        patientPhoto: formData,
        isActive: true,
      };
      // @ts-ignore
      console.log("patientData", patientData);
      const response = await patientRegistration(patientData);

      if (profData) {
        const IDs = {
          professional: profData.id,
          patient: response.id,
        };
        const data = await createProfessionalPatientRelation(IDs);
      }
      if (response) {
        form.reset();
        router.refresh();
        setLoading(false);
        router.push("/professional/patients");
      }
    } catch (error) {
      console.error(error);
      setFileError(error as string);
      setLoading(false);
    }
  }

  setTimeout(() => {
    setFileError(null);
  }, 5000);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[99%] h-full space-y-6 flex-1 mb-24 pb-3"
      >
        {/* patient personal information */}
        <div className="mb-10">
          {/* head */}
          <div className="flex px-2 gap-2 mb-5">
            <div className="h-5 border-x-2 border-black" />
            <h1 className="text-16-semibold">Información Personal</h1>
          </div>
          {/* forms */}
          <div className="mb-5 space-y-4 flex flex-wrap items-center justify-center lg:grid lg:grid-cols-[30%,70%] ">
            {/* left side */}
            <div className="flex items-start justify-center py-4">
            {form?.getValues()?.patientPhoto?.length! > 0 ? (
              <div className="w-full h-full  flex-col flex items-start justify-center pt-0 text-black">
                <button
                  className="flex items-center justify-end"
                  onClick={() => {
                    setIsTthereAnImage(false);
                    form.resetField("patientPhoto");
                  }}
                >
                  <Icon
                    src={closeIcon}
                    alt="close-icon"
                    height={30}
                    width={30}
                  />
                </button>
                <DinamicForm
                  fieldType={FormFieldType.SKELETON}
                  control={form.control}
                  name="patientPhoto"
                  renderSkeleton={(field) => (
                    <FormControl className="w-full">
                      <FileUploader
                        files={
                          isThereAnImage ? field.value : (field.value = [])
                        }
                        onChange={field.onChange}
                      />
                    </FormControl>
                  )}
                />
              </div>
            ) : (
              <>
                <div
                  className="w-[100%]"
                  onClick={() => setIsTthereAnImage(true)}
                >
                  <Label
                    htmlFor="patientPhoto"
                    className="p-0 font-light text-[13px] text-gray-500"
                  >
                    Imágen del paciente
                  </Label>
                  <DinamicForm
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="patientPhoto"
                    renderSkeleton={(field) => (
                      <FormControl>
                        <FileUploader
                          files={
                            isThereAnImage ? field.value : (field.value = [])
                          }
                          onChange={field.onChange}
                        />
                      </FormControl>
                    )}
                  />
                </div>
              </>
            )}
            </div>
            {/* rightside */}
            <div className="w-[95%]">
              {/* firstname & lastname */}
              <div className="flex gap-2 mb-2 flex-wrap">
                <DinamicForm
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="firstName"
                  label="Nombre/s"
                />
                <DinamicForm
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="lastName"
                  label="Apellido/s"
                />
              </div>
              {/* address & occupation */}
              <div className="flex gap-2 mb-2 flex-wrap">
                <DinamicForm
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="address"
                  label="Dirección"
                  placeholder="Av. Independencia 1111, Mar del Plata"
                />
                <DinamicForm
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="occupation"
                  label="Ocupación"
                  placeholder="Ingeniero en software"
                />
              </div>
              {/* email & phone number */}
              <div className="flex flex-col md:flex-row gap-2 mb-2">
                <DinamicForm
                  fieldType={FormFieldType.EMAIL}
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="paciente@email.com"
                />

                <DinamicForm
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={form.control}
                  name="phone"
                  label="Número de teléfono"
                  placeholder="(0223) 1-234567"
                  iconSrc={phoneIcon}
                  iconAlt="phone-icon"
                />
              </div>
              {/* identification type & identification number */}
              <div className="flex flex-col justify-end md:flex-row gap-2 mb-2">
                <div className="flex w-[40%] rounded-md items-center justify-center outline-none bg-transparent flex-col">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center justify-center gap-1 rounded-md shadow-md shadow-[#6e6e6e] border-[#6e6e6e] bg-white border-black/20 border-[1px] px-3 py-2">
                      Tipo de Documento
                      <Icon
                        src={DropdownIcon}
                        alt="dropdown-icon"
                        width={18}
                        height={18}
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="ml-5 w-full flex items-center justify-start">
                      <DropdownMenuRadioGroup
                        value={identificationType}
                        onValueChange={setIdentificationType}
                        className="flex w-full flex-col items-center gap-1 rounded-md  border-[#6e6e6e] bg-white
                      text-black text-ellipsis"
                      >
                        {IdentificationType.map((ID: string) => (
                          <DropdownMenuRadioItem
                            key={ID}
                            value={ID}
                            className="w-[90%] flex items-center justify-start pl-6"
                          >
                            {ID}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                    {identificationType ? (
                      <p className="mt-2">{identificationType}</p>
                    ) : null}
                  </DropdownMenu>
                </div>

                <DinamicForm
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="identityNumber"
                  label="Número de Documento"
                  placeholder="33 333 333"
                />
              </div>
              {/* birthdate & gender */}
              <div className="flex gap-2 mb-2 flex-wrap">
                <DinamicForm
                  fieldType={FormFieldType.DATE_PICKER}
                  control={form.control}
                  name="birthDate"
                  label="Fecha de Nacimiento"
                  placeholder="dd/MM/YYYY"
                />
                <DinamicForm
                  fieldType={FormFieldType.SKELETON}
                  control={form.control}
                  name="gender"
                  label="Genero"
                  renderSkeleton={(field) => (
                    <FormControl>
                      <RadioGroup
                        className="flex h-12 xl:justify-between"
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        {genderOptions.map((gender: string) => (
                          <div key={gender} className="radio-group gap-1">
                            <RadioGroupItem value={gender} id={gender} />
                            <Label htmlFor={gender} className="cursor-pointer">
                              {gender}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </div>
              {/* emergency contact name & emergency contact number */}
              <div className="flex gap-2 mb-2 flex-wrap">
                <DinamicForm
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="emergencyContactName"
                  label="Nombre de Contacto en caso de Emergencia"
                  placeholder="Juan Perez"
                />
                <DinamicForm
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={form.control}
                  name="emergencyContactNumber"
                  label="Número de Contacto en caso de Emergencia"
                  placeholder="(0223) 1-234567"
                  iconSrc={phoneIcon}
                  iconAlt="phone-icon"
                />
              </div>
              <div className="flex gap-2 mb-2 flex-wrap">
                <DinamicForm
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="contactRelationship"
                  label="Parentesco con el paciente"
                  placeholder="Vinculo"
                />
              </div>
            </div>
          </div>
        </div>

        {/* medical records */}
        <div className="mb-10">
          {/* head */}
          <div className="flex px-2 gap-2 mb-5">
            <div className="h-5 border-x-2 border-black" />
            <h1 className="text-16-semibold capitalize">registros médicos</h1>
          </div>
          {/* forms */}
          <div className="px-[1.2rem]">
            {/* ensurance_provider & ensurance_policy_number */}
            <div className="flex gap-2 mb-2 flex-wrap">
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="insuranceProvider"
                label="Cobertura Médica"
                placeholder="PAMI"
              />
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="insurancePolicyNumber"
                label="Número de Afiliado"
                placeholder="123456789012/00"
              />
            </div>
            {/* smoker & ex-smoker */}
            <div className="flex gap-2 mb-2 flex-wrap">
              {/* smoker */}
              <DinamicForm
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="smoker"
                label="Fumador"
                renderSkeleton={(field) => (
                  <FormControl>
                    <RadioGroup
                      className="flex h-12 xl:justify-between"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {booleanOption.map((bool: string) => (
                        <div key={bool} className="radio-group gap-1">
                          <RadioGroupItem value={bool} id={bool} />
                          <Label htmlFor={bool} className="cursor-pointer">
                            {bool}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}
              />
              {/* ex-smoker */}
              <DinamicForm
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="exSmoker"
                label="Ex-Fumador"
                renderSkeleton={(field) => (
                  <FormControl>
                    <RadioGroup
                      className="flex h-12 xl:justify-between"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {booleanOption.map((bool: string) => (
                        <div key={bool} className="radio-group gap-1">
                          <RadioGroupItem value={bool} id={bool} />
                          <Label htmlFor={bool} className="cursor-pointer">
                            {bool}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}
              />
            </div>
            {/* bloodtype & bloodfactor */}
            <div className="flex gap-2 mb-2 flex-wrap">
              {/* bloodType */}
              <DinamicForm
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="bloodType"
                label="Grupo Sanguíneo"
                renderSkeleton={(field) => (
                  <FormControl>
                    <RadioGroup
                      className="flex h-12 xl:justify-between"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {bloodType.map((type: string) => (
                        <div key={type} className="radio-group gap-1">
                          <RadioGroupItem value={type} id={type} />
                          <Label htmlFor={type} className="cursor-pointer">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}
              />
              {/* bloodFactor */}
              <DinamicForm
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="bloodFactor"
                label="Factor"
                renderSkeleton={(field) => (
                  <FormControl>
                    <RadioGroup
                      className="flex h-12 xl:justify-between"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {bloodFactor.map((factor: string) => (
                        <div key={factor} className="radio-group gap-1">
                          <RadioGroupItem value={factor} id={factor} />
                          <Label htmlFor={factor} className="cursor-pointer">
                            {factor}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}
              />
            </div>
            {/* allergies */}
            <div className="flex gap-2 mb-2 flex-wrap">
              {/* allergies type */}
              <DinamicForm
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="allergic"
                label="Alergico/a"
                renderSkeleton={(field) => (
                  <FormControl>
                    <RadioGroup
                      className="flex h-12 xl:justify-between"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {booleanOption.map((bool: string) => (
                        <div key={bool} className="radio-group gap-1">
                          <RadioGroupItem value={bool} id={bool} />
                          <Label htmlFor={bool} className="cursor-pointer">
                            {bool}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}
              />
              {/* choose specific allergie */}
              <DinamicForm
                control={form.control}
                name="allergies"
                label="Enumere Alergias"
                placeholder="Ex: Polen, Penicilina, Mani, Otros"
                fieldType={FormFieldType.TEXTAREA}
              />
            </div>
            {/* current medication */}
            <div className="flex gap-2 mb-2 flex-wrap">
              <DinamicForm
                control={form.control}
                name="currentMedication"
                label="Medicamentos Actuales"
                placeholder="Ex: Prednisone, Amoxicilina, Paracetamol"
                fieldType={FormFieldType.TEXTAREA}
              />
              <DinamicForm
                control={form.control}
                name="familyMedicalHistory"
                label="Antecedentes Familiares"
                placeholder="Diabetes, Cáncer..."
                fieldType={FormFieldType.TEXTAREA}
              />
            </div>
            {/* medical history */}
            <div className="flex flex-col justify-end md:flex-row gap-2 mb-2">
              <div className="flex w-[40%] rounded-md items-center justify-center outline-none bg-transparent flex-col">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center justify-center gap-1 rounded-md shadow-md shadow-[#6e6e6e] border-[#6e6e6e] bg-white border-black/20 border-[1px] outline-none px-3 py-2">
                    Antecedentes Médicos
                    <Icon
                      src={DropdownIcon}
                      alt="dropdown-icon"
                      width={18}
                      height={18}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="ml-5 w-full flex items-center justify-start">
                    <DropdownMenuRadioGroup
                      value={medicalHistoryType}
                      onValueChange={setMedicalHistoryType}
                      className="flex w-full flex-col items-center gap-1 rounded-md  border-white bg-white
                      text-black text-ellipsis"
                    >
                      {medicalHistory.map((history: string) => (
                        <DropdownMenuRadioItem
                          key={history}
                          value={history}
                          className="w-[90%] flex items-center justify-start pl-6"
                        >
                          {history}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                  {medicalHistoryType ? <p>{medicalHistoryType}</p> : null}
                </DropdownMenu>
              </div>
              {/* add relevant information */}
              <DinamicForm
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="pastMedicalHistory"
                label="Observaciones/Comentarios"
                placeholder="Agregar comentarios/observaciones relevantes"
              />
            </div>
          </div>
        </div>

        {/* anthropometric measurements */}
        <div className="mb-10">
          {/* head */}
          <div className="flex px-2 gap-2 mb-5">
            <div className="h-5 border-x-2 border-black" />
            <h1 className="text-16-semibold capitalize">
              Medidas Antropométricas
            </h1>
          </div>
          <div className="flex gap-2 mb-2 flex-wrap">
            <DinamicForm
              name="patientHeight"
              control={form.control}
              placeholder="Altura"
              label="Altura"
              fieldType={FormFieldType.INPUT}
            />
            <DinamicForm
              name="patientWeight"
              control={form.control}
              placeholder="Peso"
              label="Peso"
              fieldType={FormFieldType.INPUT}
            />
          </div>
          <div className="flex gap-2 mb-2 flex-wrap">
            <DinamicForm
              name="patientWaist"
              control={form.control}
              placeholder="cintura"
              label="Cintura"
              fieldType={FormFieldType.INPUT}
            />
            <DinamicForm
              name="patientHip"
              control={form.control}
              placeholder="cadera"
              label="Cadera"
              fieldType={FormFieldType.INPUT}
            />
          </div>
          <div className="flex gap-2 mb-2 flex-wrap">
            <DinamicForm
              name="patientArm"
              control={form.control}
              placeholder="brazo"
              label="Brazo"
              fieldType={FormFieldType.INPUT}
            />
            <DinamicForm
              name="patientTricepsFold"
              control={form.control}
              placeholder="pliegue del triceps"
              label="Pliegue del Tricep"
              fieldType={FormFieldType.INPUT}
            />
          </div>
          <div className="flex gap-2 mb-2 flex-wrap">
            <DinamicForm
              name="patientBMI"
              control={form.control}
              placeholder="IMC"
              label="IMC"
              fieldType={FormFieldType.INPUT}
            />
            <DinamicForm
              name="patientBFP"
              control={form.control}
              placeholder="(%)"
              label="Porcentaje de grasa corporal"
              fieldType={FormFieldType.INPUT}
            />
          </div>
          <div className="flex gap-2 mb-2 flex-wrap">
            <DinamicForm
              name="ObservationsComments"
              control={form.control}
              placeholder="Observaciones/Comentarios"
              label="Observaciones/Comentarios"
              fieldType={FormFieldType.TEXTAREA}
            />
          </div>
        </div>
        <div className="flex w-[90%] items-center justify-start">
          {fileError && <p className="text-red-500 text-start">{fileError}</p>}
        </div>
        <SubmitButton
          className="w-[95%] mx-auto border-[1px] border-gray-600 bg-gradient-to-b from-black to-[#807f7f] text-white hover:bg-gradient-to-b hover:from-white hover:to-[#222222] hover:text-[#1c1c1c] text-center p-2 rounded-lg"
          loading={loading}
        >
          Agregar Paciente
        </SubmitButton>
      </form>
    </Form>
  );
};

export default PatientRegistrationForm;
