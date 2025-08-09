// RadioGroupField.tsx (mejora en clases para estilo moderno e iluminado)
import React from "react";
import { FormControl, Label } from "@/components/ui";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import DinamicForm from "../DinamicForm";
import { FormFieldType } from "./ProfessionalLoginForm";

type Props = {
  control: any;
  name: string;
  label: string;
  options: string[];
};

const RadioGroupField: React.FC<Props> = ({ control, name, label, options }) => (
  <DinamicForm
    control={control}
    name={name}
    label={label}
    fieldType={FormFieldType.SKELETON}
    renderSkeleton={(field) => (
      <FormControl>
        <RadioGroup
          className="flex flex-wrap gap-6"
          onValueChange={field.onChange}
          value={field.value}
        >
          {options.map((option) => (
            <div
              key={option}
              className="
                flex items-center gap-2 cursor-pointer rounded-lg
                px-4 py-2 border border-gray-300 shadow-sm
                hover:bg-indigo-100 hover:border-indigo-400
                transition duration-200 ease-in-out
              "
            >
              <RadioGroupItem value={option} id={option} className="ring-indigo-400" />
              <Label htmlFor={option} className="text-gray-700 font-medium">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </FormControl>
    )}
  />
);

export default RadioGroupField;
