"use client";

import Image from "next/image";
import { Control } from "react-hook-form";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormFieldType } from "./forms";
import PhoneInput from "react-phone-number-input";
import CalendarIcon from "@/app/(professional)/professional/components/icons/CalendarIcon";
import Mail from "@/app/(professional)/professional/components/icons/Mail";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { read } from "fs";

interface CustomProperty {
  type?: string;
  control: Control<any>;
  fieldType: FormFieldType;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disable?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  defaultValue?: any;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  readOnly?: boolean;
  // Nuevas props para estilos
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
}

export const DinamicField = ({
  field,
  props,
}: {
  field: any;
  props: CustomProperty;
}) => {
  const {
    fieldType,
    type,
    iconAlt,
    iconSrc,
    placeholder,
    showTimeSelect,
    dateFormat,
    defaultValue,
    renderSkeleton,
    disable,
    readOnly,
    inputClassName,
  } = props;

  const baseInputClasses =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 shadow-sm " +
    "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out";

  const inputClasses = inputClassName
    ? `${baseInputClasses} ${inputClassName}`
    : baseInputClasses;

  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div
          className={`flex items-center bg-white rounded-md border border-gray-300 shadow-sm ${
                  readOnly
                    ? " cursor-not-allowed"
                    : "cursor-pointer"
                }`}
        >
          
          {iconSrc && (
            <Image
              src={iconSrc}
              alt={iconAlt || "icon"}
              height={24}
              width={24}
              className="ml-2"
            />
          )}
          <FormControl className="flex-1">
            <Input
              placeholder={placeholder}
              {...(field !== undefined ? { ...field } : { ...defaultValue })}
              type={type}
              className={`${inputClasses} ${
                iconSrc ? "ml-2" : ""
              }`}
              defaultValue={defaultValue}
              disabled={readOnly}
            />
          </FormControl>
        </div>
      );

    case FormFieldType.EMAIL:
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={placeholder}
            {...field}
            disabled={disable}
            readOnly={props.readOnly} // <-- NUEVO
            className={inputClasses}
            defaultValue={defaultValue}
          />
        </FormControl>
      );

      return (
        <FormControl>
          <Textarea
            placeholder={placeholder}
            {...field}
            disabled={disable}
            className={inputClasses}
            defaultValue={defaultValue}
          />
        </FormControl>
      );

    case FormFieldType.PHONE_INPUT:
      return (
        <PhoneInput
          defaultCountry="AR"
          placeholder={placeholder}
          international
          withCountryCallingCode
          value={field.value as any | undefined}
          onChange={field.onChange}
          className={inputClasses}
          defaultValue={defaultValue}
          disabled={disable}
        />
      );

    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex items-center rounded-md border border-gray-300 bg-white shadow-sm">
          <CalendarIcon height={24} width={24} className="mx-2 text-gray-500" />
          <FormControl className="flex-1">
            <DatePicker
              disabled={disable}
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              dateFormat={dateFormat ?? "dd/MM/yyyy"}
              showTimeSelect={showTimeSelect ?? false}
              showYearDropdown
              wrapperClassName="w-full"
              timeInputLabel="Time:"
              className={inputClasses}
            />
          </FormControl>
        </div>
      );

    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className={`${inputClasses} cursor-pointer`}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="rounded-md border border-gray-300 shadow-sm">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );

    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-2">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disable}
              className="rounded"
            />
            <label
              htmlFor={props.name}
              className="cursor-pointer select-none text-gray-700"
            >
              {props.label}
            </label>
          </div>
        </FormControl>
      );

    case FormFieldType.SKELETON:
      return renderSkeleton ? renderSkeleton(field) : null;

    default:
      return null;
  }
};

const DinamicForm = (props: CustomProperty) => {
  const { control, fieldType, name, label, className, labelClassName } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={`flex flex-col w-full max-w-full mb-4 ${className ?? ""}`}
        >
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel
              className={`mb-1 text-sm font-medium text-gray-700 truncate ${
                labelClassName ?? ""
              }`}
            >
              {label}
            </FormLabel>
          )}
          <DinamicField field={field} props={props} />
          <FormMessage className="mt-1 text-sm text-red-600" />
        </FormItem>
      )}
    />
  );
};

export default DinamicForm;
