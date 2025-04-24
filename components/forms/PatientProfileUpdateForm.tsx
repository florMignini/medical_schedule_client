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
} from "@/app/professional/data";
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
  patientInfo: Patient;
};
type professionalType = {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
};

const PatientProfileUpdateForm = ({ patientInfo }: Props) => {
  const [loading, setLoading] = useState(false);
  const [isThereAnImage, setIsTthereAnImage] = useState<boolean>(false);
  const [medicalHistoryType, setMedicalHistoryType] = useState("");

  const router = useRouter();
  const form = useForm<z.infer<typeof patientsUpdateValidationSchema>>({
    resolver: zodResolver(patientsUpdateValidationSchema),
    defaultValues: {
      firstName: patientInfo?.firstName,
      lastName: patientInfo?.lastName,
      identificationType:
        patientInfo?.identificationType as IdentificationTypeEnum,
        identityNumber: patientInfo?.identityNumber,
      // @ts-ignore
      bloodType: patientInfo?.bloodType as BloodType,
      bloodFactor: patientInfo?.bloodFactor as BloodFactor,
      gender: patientInfo?.gender as Gender,
      // @ts-ignore
      birthDate: patientInfo?.birthdate as Date,
      address: patientInfo?.address,
      occupation: patientInfo?.occupation,
      email: patientInfo?.email,
      phone: patientInfo?.phone,
      patientPhoto: [],
      emergencyContactName: patientInfo?.emergencyContactName,
      emergencyContactNumber: patientInfo?.emergencyContactNumber,
      contactRelationship: patientInfo?.contactRelationship,
      insuranceProvider: patientInfo?.insuranceProvider,
      insurancePolicyNumber: patientInfo?.insurancePolicyNumber,
      allergic: patientInfo?.allergic as BooleanOption,
      allergies: patientInfo?.allergies,
      smoker: patientInfo?.smoker as BooleanOption,
      exSmoker: patientInfo?.exSmoker as BooleanOption,
      familyMedicalHistory: patientInfo?.familyMedicalHistory,
      pastMedicalHistory: patientInfo?.pastMedicalHistory,
      currentMedication: patientInfo?.currentMedication,
      medicalHistory: patientInfo?.medicalHistory,
      // @ts-ignore
      medicalHistoryType: patientInfo?.medicalHistoryType as MedicalHistory,
      patientHeight: patientInfo?.patientHeight,
      patientWeight: patientInfo?.patientWeight,
      patientWaist: patientInfo?.patientWaist,
      patientHip: patientInfo?.patientHip,
      patientArm: patientInfo?.patientArm,
      patientTricepsFold: patientInfo?.patientTricepsFold,
      patientBMI: patientInfo?.patientBMI,
      patientBFP: patientInfo?.patientBFP,
      ObservationsComments: patientInfo?.ObservationsComments,
      isActive: patientInfo?.isActive,
    },
  });
  // -------------------------------------
  useEffect(() => {
    if (patientInfo) {
      form.reset({
        ...patientInfo,
        identificationType: patientInfo.identificationType as IdentificationTypeEnum,
        medicalHistoryType: patientInfo.medicalHistoryType as any,
        bloodType: patientInfo.bloodType as BloodType,
        bloodFactor: patientInfo.bloodFactor as BloodFactor,
        gender: patientInfo.gender as Gender,
        allergic: patientInfo.allergic as BooleanOption,
        smoker: patientInfo.smoker as BooleanOption,
        exSmoker: patientInfo.exSmoker as BooleanOption,
      });
    }
  }, [patientInfo, form.reset, form]);

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
      firstName: patientInfo.firstName,
      lastName: patientInfo.lastName,
      birthDate: patientInfo.birthDate,
      occupation: values.occupation,
      bloodType: patientInfo.bloodType as BloodType,
      bloodFactor: patientInfo.bloodFactor as BloodFactor,
      gender: patientInfo.gender as Gender,
      identificationType:
        patientInfo.identificationType as IdentificationTypeEnum,
      identityNumber: patientInfo.identityNumber,
      address:
        values.address === undefined ? patientInfo.address : values.address,
      email: values.email === undefined ? patientInfo.email : values.email,
      phone: values.phone === undefined ? patientInfo.phone : values.phone,
      emergencyContactName:
        values.emergencyContactName === undefined
          ? patientInfo.emergencyContactName
          : values.emergencyContactName,
      emergencyContactNumber:
        values.emergencyContactNumber === undefined
          ? patientInfo.emergencyContactNumber
          : values.emergencyContactNumber,
      contactRelationship:
        values.contactRelationship === undefined
          ? patientInfo.contactRelationship
          : values.contactRelationship,
      insuranceProvider:
        values.insuranceProvider === undefined
          ? patientInfo.insuranceProvider
          : values.insuranceProvider,
      insurancePolicyNumber:
        values.insurancePolicyNumber === undefined
          ? patientInfo.insurancePolicyNumber
          : values.insurancePolicyNumber,
      allergic:
        values.allergic === undefined ? patientInfo.allergic : values.allergic,
      allergies:
        values.allergies === undefined
          ? patientInfo.allergies
          : values.allergies,
      smoker:
        values.smoker === undefined
          ? (patientInfo.smoker as BooleanOption)
          : (values.smoker as BooleanOption),
      exSmoker:
        values.exSmoker === undefined
          ? (patientInfo.exSmoker as BooleanOption)
          : (values.exSmoker as BooleanOption),
      familyMedicalHistory:
        values.familyMedicalHistory === undefined
          ? patientInfo.familyMedicalHistory
          : values.familyMedicalHistory,
      pastMedicalHistory:
        values.pastMedicalHistory === undefined
          ? patientInfo.pastMedicalHistory
          : values.pastMedicalHistory,
      currentMedication:
        values.currentMedication === undefined
          ? patientInfo.currentMedication
          : values.currentMedication,
      medicalHistory:
        values.medicalHistory === undefined
          ? patientInfo.medicalHistory
          : values.medicalHistory,
      medicalHistoryType:
        values.medicalHistoryType === undefined
          ? patientInfo.medicalHistoryType
          : values.medicalHistoryType,
      patientHeight:
        values.patientHeight === undefined
          ? patientInfo.patientHeight
          : values.patientHeight,
      patientWeight:
        values.patientWeight === undefined
          ? patientInfo.patientWeight
          : values.patientWeight,
      patientWaist:
        values.patientWaist === undefined
          ? patientInfo.patientWaist
          : values.patientWaist,
      patientHip:
        values.patientHip === undefined
          ? patientInfo.patientHip
          : values.patientHip,
      patientArm:
        values.patientArm === undefined
          ? patientInfo.patientArm
          : values.patientArm,
      patientTricepsFold:
        values.patientTricepsFold === undefined
          ? patientInfo.patientTricepsFold
          : values.patientTricepsFold,
      patientBMI:
        values.patientBMI === undefined
          ? patientInfo.patientBMI
          : values.patientBMI,
      patientBFP:
        values.patientBFP === undefined
          ? patientInfo.patientBFP
          : values.patientBFP,
      ObservationsComments:
        values.ObservationsComments === undefined
          ? patientInfo.ObservationsComments
          : values.ObservationsComments,
      isActive:
        values.isActive === undefined ? patientInfo.isActive : values.isActive,
    };

    try {
      const updatePatientData = {
        ...valuesUpdated,
        patientId: patientInfo.id,
        patientPhoto:
          formData !== undefined ? formData : patientInfo.patientPhotoUrl,
      };

      const response = await updatePatientProfileAction(updatePatientData);
      if (response) {
        setLoading(false);
        router.refresh();
        router.push(`/professional/patients/${patientInfo.id}/info`);
      }
    } catch (error) {
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
                defaultValue={patientInfo?.firstName}
                disable
              />
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="lastName"
                label="Apellido/s"
                disable
                defaultValue={patientInfo?.lastName}
              />
            </div>
            {/* address & occupation */}
            <div className="flex gap-2 mb-2">
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="address"
                label="Dirección"
                defaultValue={patientInfo?.address}
              />
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="occupation"
                label="Ocupación"
                defaultValue={patientInfo?.occupation}
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
                defaultValue={patientInfo?.email}
              />
              <DinamicForm
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="phone"
                label="Número de teléfono"
                iconSrc={phoneIcon}
                iconAlt="phone-icon"
                defaultValue={patientInfo?.phone}
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
                      defaultValue={patientInfo?.identificationType}
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
                  <p>{patientInfo?.identificationType}</p>
                </DropdownMenu>
              </div>

              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="identityNumber"
                label="Número de Documento"
                disable
                defaultValue={patientInfo?.identityNumber}
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
                      defaultValue={patientInfo?.gender}
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
                defaultValue={patientInfo?.emergencyContactName}
              />
              <DinamicForm
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="emergencyContactNumber"
                label="Número de Contacto en caso de Emergencia"
                defaultValue={patientInfo?.emergencyContactNumber}
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
                defaultValue={patientInfo?.contactRelationship}
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
                defaultValue={patientInfo?.insuranceProvider}
              />
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="insurancePolicyNumber"
                label="Número de Afiliado"
                defaultValue={patientInfo?.insurancePolicyNumber}
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
                      defaultValue={patientInfo?.smoker}
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
                      defaultValue={patientInfo?.exSmoker}
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
                      defaultValue={patientInfo?.bloodType}
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
                defaultValue={patientInfo?.bloodFactor}
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
                defaultValue={patientInfo?.allergic}
                name="allergic"
                label="Alergico/a"
                renderSkeleton={(field) => (
                  <FormControl>
                    <RadioGroup
                      className="flex h-12 xl:justify-between"
                      onValueChange={field.onChange}
                      defaultValue={patientInfo?.allergic}
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
                defaultValue={patientInfo?.allergies}
                fieldType={FormFieldType.TEXTAREA}
              />
            </div>
            {/* current medication */}
            <div className="flex gap-2 mb-2">
              <DinamicForm
                control={form.control}
                name="currentMedication"
                label="Medicamentos Actuales"
                defaultValue={patientInfo?.currentMedication}
                fieldType={FormFieldType.TEXTAREA}
              />
              <DinamicForm
                control={form.control}
                name="familyMedicalHistory"
                label="Antecedentes Familiares"
                defaultValue={patientInfo?.familyMedicalHistory}
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
                  <p>{patientInfo?.medicalHistoryType}</p>
                </DropdownMenu>
              </div>
              {/* add relevant information */}
              <DinamicForm
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="pastMedicalHistory"
                label="Observaciones/Comentarios"
                defaultValue={patientInfo?.pastMedicalHistory}
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
              defaultValue={patientInfo?.patientHeight}
              label="Altura"
              fieldType={FormFieldType.INPUT}
            />
            <DinamicForm
              name="patientWeight"
              control={form.control}
              defaultValue={patientInfo?.patientWeight}
              label="Peso"
              fieldType={FormFieldType.INPUT}
            />
            <DinamicForm
              name="patientBMI"
              control={form.control}
              defaultValue={patientInfo?.patientBMI}
              label="IMC"
              fieldType={FormFieldType.INPUT}
            />
            <DinamicForm
              name="patientBFP"
              control={form.control}
              defaultValue={patientInfo?.patientBFP}
              label="Porcentaje de grasa corporal"
              fieldType={FormFieldType.INPUT}
            />
          </div>
          <div className="flex gap-2 mb-2">
            <DinamicForm
              name="ObservationsComments"
              control={form.control}
              defaultValue={patientInfo?.ObservationsComments}
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
};

export default PatientProfileUpdateForm;
