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
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import CalendarIcon from "@/app/(professional)/professional/components/icons/CalendarIcon";
import Mail from "@/app/(professional)/professional/components/icons/Mail";
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
  } = props;

  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-md shadow-md shadow-[#6e6e6e] border-[#6e6e6e] bg-white border-black/20 border-[1px]">
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
              {...(field !== undefined ? { ...field } : { ...defaultValue })}
              type={type}
              className="shad-input border-0"
              disabled={disable}
              defaultValue={defaultValue}
            />
          </FormControl>
        </div>
      );
    case FormFieldType.EMAIL:
      return (
        <div className="flex rounded-md shadow-md shadow-[#6e6e6e] border-[#6e6e6e] bg-white border-black/20 border-[1px]">
          <Mail width={20} height={20} className="mx-1 my-auto text-[#6e6e6e]" />
          <FormControl>
            <Input
              placeholder={placeholder}
              {...(field !== undefined ? { ...field } : { ...defaultValue })}
              type={type}
              className="shad-input border-0"
              disabled={disable}
              defaultValue={defaultValue}
            />
          </FormControl>
        </div>
      );
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={placeholder}
            {...field}
            className="shad-textArea text-gray-500"
            disabled={props.disable}
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
          className="input-phone"
          defaultValue={defaultValue}
        />
      );
    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex rounded-md border-[#6e6e6e] bg-white border-black/20 border-[1px]">
          <CalendarIcon
            height={24}
            width={24}
            className="mx-1 my-2 flex items-center justify-center text-[#565656]"
          />
          <FormControl>
            <DatePicker
              disabled={disable}
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              dateFormat={dateFormat ?? "dd/MM/yyyy"}
              showTimeSelect={showTimeSelect ?? false}
              showYearDropdown
              wrapperClassName="date-picker"
              timeInputLabel="Time:"
            />
          </FormControl>
        </div>
      );
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="shad-select-trigger">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="shad-select-content">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-1">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={props.disable}
            />
            <label htmlFor={props.name} className="checkbox-label">
              {props.label}
            </label>
          </div>
        </FormControl>
      );
    case FormFieldType.SKELETON:
      return renderSkeleton ? renderSkeleton(field) : null;
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
            <FormLabel className="shad-input-label text-14-regular text-dark-700 truncate">
              {label}
            </FormLabel>
          )}
          <DinamicField field={field} props={props} />
          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default DinamicForm;
