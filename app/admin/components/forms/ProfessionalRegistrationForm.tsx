"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl } from "@/components/ui/form";

import { NewProfessionalSchema } from "@/lib";

import { Gender, genderOptions, IdentificationType } from "@/app/professional/data";

import DropdownIcon from "../../../../public/assets/icons/arrowDown.svg";
import {
  createNewProfessional,
  createProfessionalPatientRelation,
  patientRegistration,
} from "@/app/actions";
import FileUploader from "@/components/FileUploader";
import SubmitButton from "@/components/SubmitButton";
import { FormFieldType } from "@/components/forms";
import DinamicForm from "@/components/DinamicForm";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui";
import CloseIcon from "@/app/professional/components/icons/CloseIcon";
import Icon from "@/components/ui/icon";
import User from "@/app/professional/components/icons/User";

const ProfessionalRegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isThereAnImage, setIsTthereAnImage] = useState<boolean>(false);

  // dropdown states
  const [identificationType, setIdentificationType] = useState("");

  const form = useForm<z.infer<typeof NewProfessionalSchema>>({
    resolver: zodResolver(NewProfessionalSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      userImage: [],
      username: "",
      password: "",
      specialty: "",
      email: "",
      phoneNumber: "",
      gender: "M" as Gender,
      birthDate: new Date(Date.now()),
      identificationType: "DNI",
      identityNumber: "",
      isActive: true,
      instagramUrl: "",
      linkedInUrl: "",
      newTwitterUrl: "",
    },
  });

  async function onSubmit(values: z.infer<typeof NewProfessionalSchema>) {
    setLoading(true);
    let formData;
    if (values.userImage && values.userImage.length > 0) {
      const blobFile = new Blob([values.userImage[0]], {
        type: values.userImage?.[0]?.type,
      });
      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.userImage[0]?.name);
    }
    try {
      const professionalData = {
        ...values,
        birthDate: new Date(values.birthDate),
        userImage: formData,
        isActive: true,
      };
      console.log(professionalData);
      // @ts-ignore
      const response = await createNewProfessional(professionalData);
      console.log(response);
      if (response) {
        form.reset();
        setLoading(false);
        router.push("/admin/professional-list");
      }
    } catch (error) {
      console.error(error);
    }
  }

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
              {isThereAnImage ? (
                <div className="w-full h-[100%] flex-col flex items-start justify-end pt-0">
                  <button
                    className="w-full flex items-center justify-end"
                    onClick={() => setIsTthereAnImage(false)}
                  >
                    <CloseIcon height={30} width={30} />
                  </button>
                  <DinamicForm
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="userImage"
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
              ) : (
                <>
                  <User width={100} height={100} />
                  <div
                    className="h-[100%] flex items-start justify-end pt-[35%]"
                    onClick={() => setIsTthereAnImage(true)}
                  >
                    <DinamicForm
                      fieldType={FormFieldType.SKELETON}
                      control={form.control}
                      name="userImage"
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
              {/* username & specialty */}
              <div className="flex gap-2 mb-2 flex-wrap">
                <DinamicForm
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="username"
                  label="Username"
                  placeholder="Dr/@... "
                />
                <DinamicForm
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="specialty"
                  label="Especialidad"
                  placeholder="Medico/a Clinico/a"
                />
              </div>
              {/* password */}
              <div className="flex gap-2 mb-2 flex-wrap">
                <DinamicForm
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="password"
                  label="Contraseña"
                  type="password"
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
                  name="phoneNumber"
                  label="Número de teléfono"
                  placeholder="(0223) 1-234567"
                />
              </div>
              {/* identification type & identification number */}
              <div className="flex flex-col justify-end md:flex-row gap-2 mb-2">
                <div className="flex w-[40%] rounded-md items-center justify-center border border-[#6e6e6e] outline-none bg-[#E8E9E9] flex-col">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center justify-center gap-1 rounded-md shadow-md shadow-[#6e6e6e] border-[#6e6e6e] bg-[#E8E9E9] border-black/20 border-[1px]">
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
                        className="flex w-full flex-col items-center gap-1 rounded-md  border-[#6e6e6e] bg-[#E8E9E9]
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
                    <p>{identificationType}</p>
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
              <div className="flex flex-col gap-4 mb-2">
                <DinamicForm
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="instagramUrl"
                  label="Instagram"
                  placeholder="instagram.com/username"
                />
                <DinamicForm
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="linkedInUrl"
                  label="LinkedIn"
                  placeholder="linkedIn.com/username"
                />
                <DinamicForm
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="newTwitterUrl"
                  label="X"
                  placeholder="x.com/username"
                />
              </div>
            </div>
          </div>
        </div>
        <SubmitButton
          className="w-[99%]  border-[1px] border-gray-600 bg-gradient-to-b from-black to-[#807f7f] text-white hover:bg-gradient-to-b hover:from-white hover:to-[#222222] hover:text-[#1c1c1c] text-center p-2 rounded-lg mx-auto"
          loading={loading}
        >
          Agregar profesional
        </SubmitButton>
      </form>
    </Form>
  );
};

export default ProfessionalRegistrationForm;
