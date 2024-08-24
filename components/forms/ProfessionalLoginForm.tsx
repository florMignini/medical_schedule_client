"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import DinamicForm from "../DinamicForm";

import UserIcon from "../../public/assets/icons/user.svg";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  SELECT = "select",
  CHECKBOX = "checkbox",
  PHONE_INPUT = "phoneInput",
  DATE_PICKER = "datePicker",
  SKELETON = "skeleton",
}
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const ProfessionalLoginform = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h3 className="header">
            Gestiona el seguimiento de pacientes de forma más eficiente.
          </h3>
          <p className="text-sm text-dark-700">Ingresar al sistema.</p>
        </section>
        <DinamicForm
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="username"
          label="Ingrese nombre de usuario o email"
          placeholder="Usuario o Email"
          iconSrc={UserIcon}
          iconAlt="user-icon"
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default ProfessionalLoginform;
