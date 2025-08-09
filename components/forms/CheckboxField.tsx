// components/forms/CheckboxField.tsx
import React from "react";
import DinamicForm from "../DinamicForm";
import { FormFieldType } from "./ProfessionalLoginForm";

type Props = {
  control: any;
  name: string;
  label: string;
  disabled?: boolean;
};

const CheckboxField: React.FC<Props> = ({ control, name, label, disabled }) => (
  <DinamicForm
    control={control}
    name={name}
    label={label}
    fieldType={FormFieldType.CHECKBOX}
    disable={disabled}
  />
);

export default CheckboxField;
