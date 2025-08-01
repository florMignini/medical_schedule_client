"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Form, FormControl } from "@/components/ui/form";
import DinamicForm from "../DinamicForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientsUpdateValidationSchema } from "@/lib";
import { z } from "zod";
import SubmitButton from "../SubmitButton";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Label } from "../ui";
import Icon from "../ui/icon";

import FileUploader from "../FileUploader";


import { Patient } from "@/interfaces";
import {
  updatePatientProfileAction,
} from "@/app/actions";

import { FormFieldType } from "./ProfessionalLoginForm";
import {
  AllergiesType,
  AllergiesDescription,
  booleanOption,
  IdentificationType,
  Gender,
  bloodType,
  bloodFactor,
  medicalHistory,
  genderOptions,
  BooleanOption,
  BloodFactor,
  BloodType,
  IdentificationTypeEnum,
  MedicalHistory,
} from "@/app/(professional)/professional/data";
import phoneIcon from "../../public/assets/icons/phone.svg";
import closeIcon from "../../public/assets/icons/close.svg";
import UserIcon from "../../public/assets/icons/user-verification.svg";
import DropdownIcon from "../../public/assets/icons/arrowDown.svg";
import mailIcon from "../../public/assets/icons/email.svg";

import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type Props = {
  selectedPatient: Partial<Patient> | null;
  onClose: () => void;
  onSuccess: () => void;
};

const PatientProfileUpdateForm : React.FC<Props> = ({
  selectedPatient,
  onClose,
  onSuccess,
})=> {
  const [loading, setLoading] = useState(false);
  const [isThereAnImage, setIsTthereAnImage] = useState<boolean>(false);
  const [medicalHistoryType, setMedicalHistoryType] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof patientsUpdateValidationSchema>>({
    resolver: zodResolver(patientsUpdateValidationSchema),
    defaultValues: {
      firstName: selectedPatient?.firstName,
      lastName: selectedPatient?.lastName,
      identificationType:
        selectedPatient?.identificationType as IdentificationTypeEnum,
        identityNumber: selectedPatient?.identityNumber,
      // @ts-ignore
      bloodType: selectedPatient?.bloodType as BloodType,
      bloodFactor: selectedPatient?.bloodFactor as BloodFactor,
      gender: selectedPatient?.gender as Gender,
      // @ts-ignore
      birthDate: selectedPatient?.birthdate as Date,
      address: selectedPatient?.address,
      occupation: selectedPatient?.occupation,
      email: selectedPatient?.email,
      phone: selectedPatient?.phone,
      patientPhoto: [],
      emergencyContactName: selectedPatient?.emergencyContactName,
      emergencyContactNumber: selectedPatient?.emergencyContactNumber,
      contactRelationship: selectedPatient?.contactRelationship,
      insuranceProvider: selectedPatient?.insuranceProvider,
      insurancePolicyNumber: selectedPatient?.insurancePolicyNumber,
      allergic: selectedPatient?.allergic as BooleanOption,
      allergies: selectedPatient?.allergies,
      smoker: selectedPatient?.smoker as BooleanOption,
      exSmoker: selectedPatient?.exSmoker as BooleanOption,
      familyMedicalHistory: selectedPatient?.familyMedicalHistory,
      pastMedicalHistory: selectedPatient?.pastMedicalHistory,
      currentMedication: selectedPatient?.currentMedication,
      medicalHistory: selectedPatient?.medicalHistory,
      // @ts-ignore
      medicalHistoryType: selectedPatient?.medicalHistoryType as MedicalHistory,
      patientHeight: selectedPatient?.patientHeight,
      patientWeight: selectedPatient?.patientWeight,
      patientWaist: selectedPatient?.patientWaist,
      patientHip: selectedPatient?.patientHip,
      patientArm: selectedPatient?.patientArm,
      patientTricepsFold: selectedPatient?.patientTricepsFold,
      patientBMI: selectedPatient?.patientBMI,
      patientBFP: selectedPatient?.patientBFP,
      ObservationsComments: selectedPatient?.ObservationsComments,
      isActive: selectedPatient?.isActive,
    },
  });
  // -------------------------------------
  useEffect(() => {
    if (selectedPatient) {
      form.reset({
        ...selectedPatient,
        identificationType: selectedPatient.identificationType as IdentificationTypeEnum,
        medicalHistoryType: selectedPatient.medicalHistoryType as any,
        bloodType: selectedPatient.bloodType as BloodType,
        bloodFactor: selectedPatient.bloodFactor as BloodFactor,
        gender: selectedPatient.gender as Gender,
        allergic: selectedPatient.allergic as BooleanOption,
        smoker: selectedPatient.smoker as BooleanOption,
        exSmoker: selectedPatient.exSmoker as BooleanOption,
      });
    }
  }, [selectedPatient, form.reset, form]);
  
  // onSubmit form
  async function onSubmit(
    values: z.infer<typeof patientsUpdateValidationSchema>
  ) {
    setLoading(true);
    let formData;
    if (values.patientPhoto !== undefined) {
      const blobFile = new Blob([values.patientPhoto[0]], {
        type: values.patientPhoto?.[0]?.type,
      });
      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.patientPhoto[0]?.name);
    }

    const valuesUpdated = {
      firstName: selectedPatient?.firstName,
      lastName: selectedPatient?.lastName,
      birthDate: selectedPatient?.birthDate,
      occupation: values.occupation,
      bloodType: selectedPatient?.bloodType as BloodType,
      bloodFactor: selectedPatient?.bloodFactor as BloodFactor,
      gender: selectedPatient?.gender as Gender,
      identificationType:
        selectedPatient?.identificationType as IdentificationTypeEnum,
      identityNumber: selectedPatient?.identityNumber,
      address:
        values.address === undefined ? selectedPatient?.address : values.address,
      email: values.email === undefined ? selectedPatient?.email : values.email,
      phone: values.phone === undefined ? selectedPatient?.phone : values.phone,
      emergencyContactName:
        values.emergencyContactName === undefined
          ? selectedPatient?.emergencyContactName
          : values.emergencyContactName,
      emergencyContactNumber:
        values.emergencyContactNumber === undefined
          ? selectedPatient?.emergencyContactNumber
          : values.emergencyContactNumber,
      contactRelationship:
        values.contactRelationship === undefined
          ? selectedPatient?.contactRelationship
          : values.contactRelationship,
      insuranceProvider:
        values.insuranceProvider === undefined
          ? selectedPatient?.insuranceProvider
          : values.insuranceProvider,
      insurancePolicyNumber:
        values.insurancePolicyNumber === undefined
          ? selectedPatient?.insurancePolicyNumber
          : values.insurancePolicyNumber,
      allergic:
        values.allergic === undefined ? selectedPatient?.allergic : values.allergic,
      allergies:
        values.allergies === undefined
          ? selectedPatient?.allergies
          : values.allergies,
      smoker:
        values.smoker === undefined
          ? (selectedPatient?.smoker as BooleanOption)
          : (values.smoker as BooleanOption),
      exSmoker:
        values.exSmoker === undefined
          ? (selectedPatient?.exSmoker as BooleanOption)
          : (values.exSmoker as BooleanOption),
      familyMedicalHistory:
        values.familyMedicalHistory === undefined
          ? selectedPatient?.familyMedicalHistory
          : values.familyMedicalHistory,
      pastMedicalHistory:
        values.pastMedicalHistory === undefined
          ? selectedPatient?.pastMedicalHistory
          : values.pastMedicalHistory,
      currentMedication:
        values.currentMedication === undefined
          ? selectedPatient?.currentMedication
          : values.currentMedication,
      medicalHistory:
        values.medicalHistory === undefined
          ? selectedPatient?.medicalHistory
          : values.medicalHistory,
      medicalHistoryType:
        values.medicalHistoryType === undefined
          ? selectedPatient?.medicalHistoryType
          : values.medicalHistoryType,
      patientHeight:
        values.patientHeight === undefined
          ? selectedPatient?.patientHeight
          : values.patientHeight,
      patientWeight:
        values.patientWeight === undefined
          ? selectedPatient?.patientWeight
          : values.patientWeight,
      patientWaist:
        values.patientWaist === undefined
          ? selectedPatient?.patientWaist
          : values.patientWaist,
      patientHip:
        values.patientHip === undefined
          ? selectedPatient?.patientHip
          : values.patientHip,
      patientArm:
        values.patientArm === undefined
          ? selectedPatient?.patientArm
          : values.patientArm,
      patientTricepsFold:
        values.patientTricepsFold === undefined
          ? selectedPatient?.patientTricepsFold
          : values.patientTricepsFold,
      patientBMI:
        values.patientBMI === undefined
          ? selectedPatient?.patientBMI
          : values.patientBMI,
      patientBFP:
        values.patientBFP === undefined
          ? selectedPatient?.patientBFP
          : values.patientBFP,
      ObservationsComments:
        values.ObservationsComments === undefined
          ? selectedPatient?.ObservationsComments
          : values.ObservationsComments,
      isActive:
        values.isActive === undefined ? selectedPatient?.isActive : values.isActive,
    };

    try {
      const updatePatientData = {
        ...valuesUpdated,
        patientId: selectedPatient?.id,
        patientPhoto:
          formData !== undefined ? formData : selectedPatient?.patientPhotoUrl,
      };

      const response : any = await updatePatientProfileAction(updatePatientData);
      if (response.isDemo) {
        setLoading(false);
        
          toast({
            title: "Edición simulada",
            description: "Este cambio fue simulado (modo demo)",
            className: "bg-emerald-500 text-black",
          });
          onClose(); 
      }else{
        router.refresh();
        router.push(`/professional/patients/${selectedPatient?.id}/info`);
      }
    
  }catch (error) {
    console.error(error);
  }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[100%] space-y-6 flex-1"
      >
        {/* appointment profile detail */}
        <div className="flex px-2 gap-2 mb-5">
          <div className="h-5 border-x-2 border-black" />
          <h1 className="text-16-semibold">
            Actualizar información del paciente
          </h1>
        </div>
        {/* forms */}
        <div className="mb-5 space-y-4 flex flex-wrap items-center justify-center lg:grid lg:grid-cols-[40%,60%] gap-2">
          {/* left side */}
          <div className="flex items-center justify-center px-1 py-2">
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
            <div className="flex gap-2 mb-2">
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="firstName"
                label="Nombre/s"
                defaultValue={selectedPatient?.firstName}
                disable
              />
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="lastName"
                label="Apellido/s"
                disable
                defaultValue={selectedPatient?.lastName}
              />
            </div>
            {/* address & occupation */}
            <div className="flex gap-2 mb-2">
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="address"
                label="Dirección"
                defaultValue={selectedPatient?.address}
              />
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="occupation"
                label="Ocupación"
                defaultValue={selectedPatient?.occupation}
              />
            </div>
            {/* email & phone number */}
            <div className="flex flex-col md:flex-row gap-2 mb-2">
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email"
                iconSrc={mailIcon}
                iconAlt="user-email"
                defaultValue={selectedPatient?.email}
              />
              <DinamicForm
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="phone"
                label="Número de teléfono"
                iconSrc={phoneIcon}
                iconAlt="phone-icon"
                defaultValue={selectedPatient?.phone}
              />
            </div>
            {/* identification type & identification number */}
            <div className="flex flex-col justify-end md:flex-row gap-2 mb-2">
              <div className="flex w-[40%] rounded-md items-center justify-center border shadow-md gap-2 p-1 outline-none bg-white flex-col">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    disabled
                    className="flex items-center justify-center gap-1 outline-none"
                  >
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
                      defaultValue={selectedPatient?.identificationType}
                      className="flex w-full flex-col items-center gap-1 rounded-md  border-dark-500 bg-dark-400
                      text-white text-ellipsis"
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
                  <p>{selectedPatient?.identificationType}</p>
                </DropdownMenu>
              </div>

              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="identityNumber"
                label="Número de Documento"
                disable
                defaultValue={selectedPatient?.identityNumber}
              />
            </div>
            {/* birthdate & gender */}
            <div className="flex gap-2 mb-2">
              <DinamicForm
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="birthDate"
                label="Fecha de Nacimiento"
                disable
              />
              <DinamicForm
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="gender"
                label="Genero"
                disable
                renderSkeleton={(field) => (
                  <FormControl>
                    <RadioGroup
                      disabled
                      className="flex h-12 xl:justify-between"
                      onValueChange={field.onChange}
                      defaultValue={selectedPatient?.gender}
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
            <div className="flex gap-2 mb-2">
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="emergencyContactName"
                label="Nombre de Contacto en caso de Emergencia"
                defaultValue={selectedPatient?.emergencyContactName}
              />
              <DinamicForm
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="emergencyContactNumber"
                label="Número de Contacto en caso de Emergencia"
                defaultValue={selectedPatient?.emergencyContactNumber}
                iconSrc={phoneIcon}
                iconAlt="phone-icon"
              />
            </div>
            <div className="flex gap-2 mb-2">
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="contactRelationship"
                label="Parentesco con el paciente"
                defaultValue={selectedPatient?.contactRelationship}
              />
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
            <div className="flex gap-2 mb-2">
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="insuranceProvider"
                label="Cobertura Médica"
                defaultValue={selectedPatient?.insuranceProvider}
              />
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="insurancePolicyNumber"
                label="Número de Afiliado"
                defaultValue={selectedPatient?.insurancePolicyNumber}
              />
            </div>
            {/* smoker & ex-smoker */}
            <div className="flex gap-2 mb-2">
              {/* smoker */}
              <DinamicForm
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="smoker"
                label="Fumador"
                disable
                renderSkeleton={(field) => (
                  <FormControl>
                    <RadioGroup
                      disabled
                      className="flex h-12 xl:justify-between"
                      onValueChange={field.onChange}
                      defaultValue={selectedPatient?.smoker}
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
                disable
                renderSkeleton={(field) => (
                  <FormControl>
                    <RadioGroup
                      disabled
                      className="flex h-12 xl:justify-between"
                      onValueChange={field.onChange}
                      defaultValue={selectedPatient?.exSmoker}
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
            <div className="flex gap-2 mb-2">
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
                      defaultValue={selectedPatient?.bloodType}
                      disabled
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
                defaultValue={selectedPatient?.bloodFactor}
                disable
                renderSkeleton={(field) => (
                  <FormControl>
                    <RadioGroup
                      disabled
                      className="flex h-12 xl:justify-between"
                      onValueChange={field.onChange}
                      defaultValue={field?.value}
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
            <div className="flex gap-2 mb-2">
              {/* allergies type */}
              <DinamicForm
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                defaultValue={selectedPatient?.allergic}
                name="allergic"
                label="Alergico/a"
                renderSkeleton={(field) => (
                  <FormControl>
                    <RadioGroup
                      className="flex h-12 xl:justify-between"
                      onValueChange={field.onChange}
                      defaultValue={selectedPatient?.allergic}
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
                defaultValue={selectedPatient?.allergies}
                fieldType={FormFieldType.TEXTAREA}
              />
            </div>
            {/* current medication */}
            <div className="flex gap-2 mb-2">
              <DinamicForm
                control={form.control}
                name="currentMedication"
                label="Medicamentos Actuales"
                defaultValue={selectedPatient?.currentMedication}
                fieldType={FormFieldType.TEXTAREA}
              />
              <DinamicForm
                control={form.control}
                name="familyMedicalHistory"
                label="Antecedentes Familiares"
                defaultValue={selectedPatient?.familyMedicalHistory}
                fieldType={FormFieldType.TEXTAREA}
              />
            </div>
            {/* medical history */}
            <div className="flex flex-col justify-end md:flex-row gap-2 mb-2">
              <div className="flex w-[40%] rounded-md items-center justify-center border shadow-md gap-2 p-1 outline-none bg-white flex-col">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center justify-center gap-1 outline-none">
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
                      className="flex w-full flex-col items-center gap-1 rounded-md  border-dark-500 bg-dark-400
                      text-white text-ellipsis"
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
                  <p>{selectedPatient?.medicalHistoryType}</p>
                </DropdownMenu>
              </div>
              {/* add relevant information */}
              <DinamicForm
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="pastMedicalHistory"
                label="Observaciones/Comentarios"
                defaultValue={selectedPatient?.pastMedicalHistory}
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
          <div className="flex gap-2 mb-2">
            <DinamicForm
              name="patientHeight"
              control={form.control}
              defaultValue={selectedPatient?.patientHeight}
              label="Altura"
              fieldType={FormFieldType.INPUT}
            />
            <DinamicForm
              name="patientWeight"
              control={form.control}
              defaultValue={selectedPatient?.patientWeight}
              label="Peso"
              fieldType={FormFieldType.INPUT}
            />
            <DinamicForm
              name="patientBMI"
              control={form.control}
              defaultValue={selectedPatient?.patientBMI}
              label="IMC"
              fieldType={FormFieldType.INPUT}
            />
            <DinamicForm
              name="patientBFP"
              control={form.control}
              defaultValue={selectedPatient?.patientBFP}
              label="Porcentaje de grasa corporal"
              fieldType={FormFieldType.INPUT}
            />
          </div>
          <div className="flex gap-2 mb-2">
            <DinamicForm
              name="ObservationsComments"
              control={form.control}
              defaultValue={selectedPatient?.ObservationsComments}
              label="Observaciones/Comentarios"
              fieldType={FormFieldType.TEXTAREA}
            />
          </div>
        </div>

        <div className="w-full flex">
          <SubmitButton
            className="w-[95%] mx-auto border-[1px] border-gray-600 hover:bg-black text-black bg-white text-center p-2 rounded-lg ease-in-out hover:text-white"
            loading={loading}
          >
            Actualizar Paciente
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}

export default PatientProfileUpdateForm;
