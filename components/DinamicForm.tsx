"use client";

import Image from "next/image";
import { Control } from "react-hook-form";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormFieldType } from "./forms";
import PhoneInput from "react-phone-number-input";
import calendarIcon from "../public/assets/icons/calendar.svg";
interface CustomProperty {
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
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
}

const DinamicField = ({
  field,
  props,
}: {
  field: any;
  props: CustomProperty;
}) => {
  const { fieldType, iconAlt, iconSrc, placeholder, showTimeSelect, dateFormat, renderSkeleton } = props;

  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          {props.iconSrc && (
            <Image
              src={iconSrc!}
              alt={iconAlt || "usr-icon"}
              height={24}
              width={24}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              className="shad-input border-0"
            />
          </FormControl>
        </div>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <PhoneInput
          defaultCountry="US"
          placeholder={placeholder}
          international
          withCountryCallingCode
          value={field.value as any | undefined}
          onChange={field.onChange}
          className="input-phone"
        />
      );
    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          <Image src={calendarIcon} alt="calendar-icon" height={24} width={24} className="ml-2" />
          <FormControl>
          <DatePicker selected={field.value} onChange={(date) => field.onChange(date)} 
            dateFormat={dateFormat ?? 'dd/MM/yyyy'}
            showTimeSelect={showTimeSelect ?? false}
            wrapperClassName="date-picker"
            timeInputLabel="Time:"
            />
          </FormControl>
        </div>
      );
    case FormFieldType.SKELETON:
      return renderSkeleton ? renderSkeleton(field) : null
      default:
      break;
  }
};
const DinamicForm = (props: CustomProperty) => {
  const { control, fieldType, name, label } = props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className="text-14-regular text-dark-700">
              {label}
            </FormLabel>
          )}
          <DinamicField field={field} props={props} />
        </FormItem>
      )}
    />
  );
};

export default DinamicForm;
