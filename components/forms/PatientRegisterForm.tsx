"use client";
import React from "react";
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
} from "@/app/(professional)/professional/data";
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
import { Patient } from "@/interfaces";
import SelectField from "./SelectField";
import RadioGroupField from "./RadioGroupField";

type Props = {
  selectedPatient?: Partial<Patient> | null;
  onClose: () => void;
  onSuccess: () => void;
};
const PatientRegistrationForm: React.FC<Props> = ({
  selectedPatient,
  onClose,
  onSuccess,
}) => {
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
  const patientHeight = form.watch("patientHeight");
  const patientWeight = form.watch("patientWeight");

  useEffect(() => {
    if (patientHeight && patientWeight) {
      const alturaMetros = parseFloat(patientHeight) / 100;
      const pesoKg = parseFloat(patientWeight);

      if (alturaMetros > 0 && pesoKg > 0) {
        const imc = pesoKg / alturaMetros ** 2;
        form.setValue("patientBMI", imc.toFixed(2));
      }
    } else {
      form.setValue("patientBMI", "");
    }
  }, [patientHeight, patientWeight, form]);

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
        className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg space-y-12"
      >
        {/* Información Personal */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 border-l-4 border-indigo-600 pl-4">
            Información Personal
          </h2>

          <div className="flex flex-col md:flex-row md:gap-8">
            {/* Foto del paciente */}
            <div className="mb-8 md:mb-0 md:w-1/3 flex flex-col items-center">
              {form?.getValues()?.patientPhoto?.length! > 0 &&
              isThereAnImage ? (
                <div className="w-full flex flex-col items-center gap-4">
                  <button
                    type="button"
                    className="self-end text-gray-600 hover:text-red-600 transition"
                    onClick={() => {
                      setIsTthereAnImage(false);
                      form.resetField("patientPhoto");
                    }}
                    aria-label="Eliminar imagen"
                  >
                    ✕
                  </button>
                  <DinamicForm
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="patientPhoto"
                    renderSkeleton={(field) => (
                      <FormControl className="w-full">
                        <FileUploader
                          files={field.value}
                          onChange={field.onChange}
                          // className="rounded-md border border-gray-300 p-2"
                        />
                      </FormControl>
                    )}
                  />
                </div>
              ) : (
                <div
                  className="w-full cursor-pointer"
                  onClick={() => setIsTthereAnImage(true)}
                >
                  <Label
                    htmlFor="patientPhoto"
                    className="text-sm font-light text-gray-500 mb-2 block"
                  >
                    Imagen del paciente
                  </Label>
                  <DinamicForm
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="patientPhoto"
                    renderSkeleton={(field) => (
                      <FormControl>
                        <FileUploader
                          files={[]}
                          onChange={field.onChange}
                          // className="rounded-md border border-gray-300 p-2"
                        />
                      </FormControl>
                    )}
                  />
                </div>
              )}
            </div>

            {/* Campos */}
            <div className="md:w-2/3 space-y-6">
              {/* Nombre y Apellido */}
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <DinamicForm
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="firstName"
                  label="Nombre/s"
                  className="flex-1"
                  inputClassName="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  labelClassName="mb-1 text-gray-700 font-medium"
                />
                <DinamicForm
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="lastName"
                  label="Apellido/s"
                  className="flex-1 mt-4 sm:mt-0"
                  inputClassName="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  labelClassName="mb-1 text-gray-700 font-medium"
                />
              </div>

              {/* Dirección y Ocupación */}
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <DinamicForm
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="address"
                  label="Dirección"
                  placeholder="Av. Independencia 1111, Mar del Plata"
                  className="flex-1"
                  inputClassName="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  labelClassName="mb-1 text-gray-700 font-medium"
                />
                <DinamicForm
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="occupation"
                  label="Ocupación"
                  placeholder="Ingeniero en software"
                  className="flex-1 mt-4 sm:mt-0"
                  inputClassName="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  labelClassName="mb-1 text-gray-700 font-medium"
                />
              </div>

              {/* Email y Teléfono */}
              <div className="flex flex-col md:flex-row md:gap-4">
                <DinamicForm
                  fieldType={FormFieldType.EMAIL}
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="paciente@email.com"
                  className="flex-1"
                  inputClassName="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  labelClassName="mb-1 text-gray-700 font-medium"
                />
                <DinamicForm
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={form.control}
                  name="phone"
                  label="Número de teléfono"
                  placeholder="(0223) 1-234567"
                  iconSrc={phoneIcon}
                  iconAlt="phone-icon"
                  className="flex-1 mt-4 md:mt-0"
                  inputClassName="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  labelClassName="mb-1 text-gray-700 font-medium"
                />
              </div>

              {/* Tipo y Número de Documento */}
              <div className="flex flex-col md:flex-row md:gap-4 items-end">
                <div className="md:w-1/2 w-full">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center justify-between w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                      {identificationType || "Tipo de Documento"}
                      <Icon
                        src={DropdownIcon}
                        alt="dropdown-icon"
                        width={18}
                        height={18}
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full mt-1">
                      <DropdownMenuRadioGroup
                        value={identificationType}
                        onValueChange={setIdentificationType}
                        className="flex flex-col gap-2 p-2"
                      >
                        {IdentificationType.map((ID: string) => (
                          <DropdownMenuRadioItem
                            key={ID}
                            value={ID}
                            className="cursor-pointer"
                          >
                            {ID}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <DinamicForm
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="identityNumber"
                  label="Número de Documento"
                  placeholder="33 333 333"
                  className="md:w-1/2 w-full mt-4 md:mt-0"
                  inputClassName="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  labelClassName="mb-1 text-gray-700 font-medium"
                />
              </div>

              {/* Fecha de Nacimiento y Género */}
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <DinamicForm
                  fieldType={FormFieldType.DATE_PICKER}
                  control={form.control}
                  name="birthDate"
                  label="Fecha de Nacimiento"
                  placeholder="dd/MM/YYYY"
                  className="flex-1"
                  inputClassName="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  labelClassName="mb-1 text-gray-700 font-medium"
                />
                <RadioGroupField
                  control={form.control}
                  name="gender"
                  label="Género"
                  options={genderOptions}
                />
              </div>
              {/* insurance policyNumber & provider */}
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <DinamicForm
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="insuranceProvider"
                  label="Obra Social / Prepaga"
                  className="flex-1"
                  inputClassName="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  labelClassName="mb-1 text-gray-700 font-medium"
                />
                <DinamicForm
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="insurancePolicyNumber"
                  label="Número de Afiliado"
                  className="flex-1"
                  inputClassName="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  labelClassName="mb-1 text-gray-700 font-medium"
                />
              </div>
              {/* Contacto de emergencia */}
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <DinamicForm
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="emergencyContactName"
                  label="Contacto en caso de Emergencia"
                  placeholder="Juan Perez"
                  className="flex-1"
                  inputClassName="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  labelClassName="mb-1 text-gray-700 font-medium"
                />
                <DinamicForm
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={form.control}
                  name="emergencyContactNumber"
                  label="Número de Contacto"
                  placeholder="(0223) 1-234567"
                  iconSrc={phoneIcon}
                  iconAlt="phone-icon"
                  className="flex-1 mt-4 sm:mt-0"
                  inputClassName="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  labelClassName="mb-1 text-gray-700 font-medium"
                />
              </div>

              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="contactRelationship"
                label="Parentesco con el paciente"
                placeholder="Vínculo"
                className="mt-4"
                inputClassName="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                labelClassName="mb-1 text-gray-700 font-medium"
              />
            </div>
          </div>
        </section>

        {/* Registros medicos */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 border-l-4 border-indigo-600 pl-4">
            Registros Médicos
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <SelectField
              control={form.control}
              name="medicalHistoryType"
              label="Tipo de antecedente Médico"
              options={medicalHistory}
              placeholder="Seleccionar"
            />

            <SelectField
              control={form.control}
              name="bloodType"
              label="Tipo de Sangre"
              options={bloodType}
              placeholder="Seleccionar"
            />

            <SelectField
              control={form.control}
              name="bloodFactor"
              label="Factor Rh"
              options={bloodFactor}
              placeholder="Seleccionar"
            />

            <SelectField
              control={form.control}
              name="smoker"
              label="¿Fuma?"
              options={booleanOption}
              placeholder="Seleccionar"
            />

            <SelectField
              control={form.control}
              name="exSmoker"
              label="¿Ex fumador?"
              options={booleanOption}
              placeholder="Seleccionar"
            />

            <SelectField
              control={form.control}
              name="allergic"
              label="¿Es alérgico?"
              options={booleanOption}
              placeholder="Seleccionar"
            />
          </div>

          <DinamicForm
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="allergies"
            label="Alergias"
            placeholder="Especificar alergias"
            className="w-full"
            inputClassName="min-h-[80px] resize-y w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            labelClassName="mb-1 text-gray-700 font-medium"
          />

          <DinamicForm
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="familyMedicalHistory"
            label="Antecedentes Médicos Familiares"
            placeholder="Especificar antecedentes familiares relevantes"
            className="w-full"
            inputClassName="min-h-[80px] resize-y w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            labelClassName="mb-1 text-gray-700 font-medium"
          />

          <DinamicForm
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="pastMedicalHistory"
            label="Antecedentes Médicos Personales"
            placeholder="Especificar antecedentes médicos personales relevantes"
            className="w-full"
            inputClassName="min-h-[80px] resize-y w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            labelClassName="mb-1 text-gray-700 font-medium"
          />

          <DinamicForm
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="currentMedication"
            label="Medicamentos Actuales"
            placeholder="Especificar medicamentos que está tomando actualmente"
            className="w-full"
            inputClassName="min-h-[80px] resize-y w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            labelClassName="mb-1 text-gray-700 font-medium"
          />
        </section>

        {/* Medidas Antropométricas */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 border-l-4 border-indigo-600 pl-4">
            Medidas Antropométricas
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <DinamicForm
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="patientHeight"
              label="Altura (cm)"
              placeholder="Ej: 170"
              inputClassName="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              labelClassName="mb-1 text-gray-700 font-medium"
            />
            <DinamicForm
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="patientWeight"
              label="Peso (kg)"
              placeholder="Ej: 70"
              inputClassName="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              labelClassName="mb-1 text-gray-700 font-medium"
            />
            <DinamicForm
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="patientBMI"
              label="IMC"
              placeholder="Ej: 22.5"
              inputClassName={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 transition ${
                parseFloat(form.watch("patientBMI")!) < 18.5
                  ? "bg-blue-100 border-blue-300"
                  : parseFloat(form.watch("patientBMI")!) < 25
                  ? "bg-green-100 border-green-300"
                  : parseFloat(form.watch("patientBMI")!) < 30
                  ? "bg-yellow-100 border-yellow-300"
                  : "bg-red-100 border-red-300"
              }`}
              labelClassName="mb-1 text-gray-700 font-medium"
              readOnly={true}
            />

            <DinamicForm
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="patientBFP"
              label="Porcentaje de Grasa Corporal (%)"
              placeholder="Ej: 15"
              inputClassName="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              labelClassName="mb-1 text-gray-700 font-medium"
            />
            <DinamicForm
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="patientWaist"
              label="Cintura (cm)"
              placeholder="Ej: 80"
              inputClassName="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              labelClassName="mb-1 text-gray-700 font-medium"
            />
            <DinamicForm
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="patientHip"
              label="Cadera (cm)"
              placeholder="Ej: 95"
              inputClassName="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              labelClassName="mb-1 text-gray-700 font-medium"
            />
            <DinamicForm
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="patientArm"
              label="Brazo (cm)"
              placeholder="Ej: 30"
              inputClassName="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              labelClassName="mb-1 text-gray-700 font-medium"
            />
            <DinamicForm
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="patientTricepsFold"
              label="Pliegue Tricipital (mm)"
              placeholder="Ej: 12"
              inputClassName="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              labelClassName="mb-1 text-gray-700 font-medium"
            />
          </div>
        </section>

        {/* Observaciones y Comentarios */}
        <DinamicForm
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="ObservationsComments"
          label="Observaciones y Comentarios"
          placeholder="Cualquier observación adicional sobre el paciente"
          inputClassName="min-h-[80px] resize-y w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          labelClassName="mb-1 text-gray-700 font-medium"
        />

        {/* Error de archivo */}
        {fileError && <p className="text-red-600 text-center">{fileError}</p>}

        {/* Botón Submit */}
        <SubmitButton
          className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition"
          loading={loading}
          // type="submit"
        >
          Agregar Paciente
        </SubmitButton>
      </form>
    </Form>
  );
};

export default PatientRegistrationForm;
