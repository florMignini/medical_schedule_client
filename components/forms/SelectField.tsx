import React from "react";
import DinamicForm from "../DinamicForm";
import { FormControl } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { FormFieldType } from "./ProfessionalLoginForm";

type Props = {
  control: any;
  name: string;
  label: string;
  options: string[];
  placeholder?: string;
};

const SelectField: React.FC<Props> = ({
  control,
  name,
  label,
  options,
  placeholder,
}) => (
  <DinamicForm
    control={control}
    name={name}
    label={label}
    labelClassName="text-red-500"
    fieldType={FormFieldType.SKELETON}
    renderSkeleton={({ value, onChange }) => (
      <FormControl>
        <Select value={value ?? ""} onValueChange={onChange}>
          <SelectTrigger className="
              w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800
              shadow-md hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400
              transition duration-200 ease-in-out
            ">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="
              rounded-lg border border-gray-300 bg-white shadow-lg
              max-h-60 overflow-auto
            ">
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControl>
    )}
  />
);

export default SelectField;
