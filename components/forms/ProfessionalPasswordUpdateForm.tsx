"use client";

import { UpdateProfessionalPasswordSchema } from "@/lib";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Form, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DinamicForm from "../DinamicForm";
import { FormFieldType } from "./ProfessionalLoginForm";
import SubmitButton from "../SubmitButton";

const ProfessionalPasswordUpdateForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [verifyPassword, setVerifyPassword] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof UpdateProfessionalPasswordSchema>>({
    resolver: zodResolver(UpdateProfessionalPasswordSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  //--------------------------------------
  
  // verify actual password
const verifyPasswordFn = async() => {
  console.log(form.getValues().password)
}
  // -------------------------------------

  // onSubmit form
  async function onSubmit(
    values: z.infer<typeof UpdateProfessionalPasswordSchema>
  ) {
    setLoading(true);

    const valuesUpdated = {};

    try {
      // const updateProfessionalData = {
      //   ...valuesUpdated,
      //   userImage:
      //     formData !== undefined ? formData : professionalInfo.userImage,
      // };
      // const response = await updateProfessionalProfileAction(
      //   updateProfessionalData
      // );
      // if (response) {
      //   setLoading(false);
      //   router.push(`/professional/dashboard`);
      // }
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
        {/* appointment detail */}
        <div className="flex px-2 gap-2 mb-5">
          <div className="h-5 border-x-2 border-black" />
          <h1 className="text-16-semibold">Actualizar mi contraseña</h1>
        </div>
        {/* forms */}
        <div className="mb-5 space-y-4 flex flex-wrap items-center justify-center lg:grid lg:grid-cols-[40%,60%] gap-1">
          {/* rightside */}
          <div className="w-[95%] flex flex-col gap-3">
            {/* password */}
            <div className="flex flex-col gap-2">
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="password"
                label="Contraseña actual"
              />
              <button 
              className="glass-effect"
              onClick={verifyPasswordFn}
              >
                Verificar contraseña
              </button>
            </div>
            {/* new password */}
            {verifyPassword && (
              <>
                <DinamicForm
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="newPassword"
                  label="Nueva Contraseña"
                />

                {/* confirm password */}
                <DinamicForm
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="confirmPassword"
                  label="Confirmar Contraseña"
                />
              </>
            )}
          </div>
        </div>

        {
          verifyPassword && (
            <div className="w-full flex">
          <SubmitButton
            className="w-[95%] mx-auto border-[1px] border-gray-600 hover:bg-gradient-to-b from-black to-[#807f7f] text-black text-center hover:text-white p-2 rounded-lg ease-in-out"
            loading={loading}
          >
            Actualizar Contraseña
          </SubmitButton>
        </div>
          )
        }
      </form>
    </Form>
  );
};

export default ProfessionalPasswordUpdateForm;
