import { useMemo, useState } from "react";
import {
  contactAllergies,
  environmentAllergies,
  foodAllergies,
  medAllergies,
} from "@/data";

import DinamicForm from "./DinamicForm";
import { FormControl, Label } from "./ui";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { FormFieldType } from "./forms";

const DinamicAllergieContent = ({ allergiesType, form }: any) => {
  const renderSwitch = (allergie: string) => {
    const [optionSelected, setOptionSelected] = useState("");
    useMemo(() => setOptionSelected(""), [allergiesType]);

    switch (allergie) {
      case "Alimentos":
        return (
          <FormControl>
            <RadioGroup className="flex flex-wrap  xl:justify-between">
              {foodAllergies.map((allergie: string) => (
                <div
                  key={allergie}
                  onChange={() => setOptionSelected(allergie)}
                  className="radio-group gap-1"
                >
                  <DinamicForm
                    name="allergies"
                    control={form.control}
                    fieldType={FormFieldType.CHECKBOX}
                    label={allergie}
                  />
                </div>
              ))}
              {optionSelected === "Otro" ? (
                <DinamicForm
                  control={form.control}
                  name="allergies"
                  fieldType={FormFieldType.TEXTAREA}
                  placeholder="Otro..."
                />
              ) : null}
            </RadioGroup>
          </FormControl>
        );
      case "Drogas/Medicamentos":
        return (
          <FormControl>
            <RadioGroup className="flex flex-wrap  xl:justify-between">
              {medAllergies.map((allergie: string) => (
                <div
                  key={allergie}
                  onChange={() => setOptionSelected(allergie)}
                  className="radio-group gap-1"
                >
                  <DinamicForm
                    name="allergies"
                    control={form.control}
                    fieldType={FormFieldType.CHECKBOX}
                    label={allergie}
                  />
                </div>
              ))}
              {optionSelected === "Otro" ? (
                <DinamicForm
                  control={form.control}
                  name="allergies"
                  fieldType={FormFieldType.TEXTAREA}
                  placeholder="Otro..."
                />
              ) : null}
            </RadioGroup>
          </FormControl>
        );
      case "Ambientales/Estacionales":
        return (
          <FormControl>
            <RadioGroup className="flex flex-wrap  xl:justify-between">
              {environmentAllergies.map((allergie: string) => (
                <div
                  key={allergie}
                  onChange={() => setOptionSelected(allergie)}
                  className="radio-group gap-1"
                >
                  <DinamicForm
                    name="allergies"
                    control={form.control}
                    fieldType={FormFieldType.CHECKBOX}
                    label={allergie}
                  />
                </div>
              ))}
              {optionSelected === "Otro" ? (
                <DinamicForm
                  control={form.control}
                  name="allergies"
                  fieldType={FormFieldType.TEXTAREA}
                  placeholder="Otro..."
                />
              ) : null}
            </RadioGroup>
          </FormControl>
        );
      case "Contacto":
        return (
          <FormControl>
            <RadioGroup className="flex flex-wrap  xl:justify-between">
              {contactAllergies.map((allergie: string) => (
                <div
                  key={allergie}
                  onChange={() => setOptionSelected(allergie)}
                  className="radio-group gap-1"
                >
                  <DinamicForm
                    name="allergies"
                    control={form.control}
                    fieldType={FormFieldType.CHECKBOX}
                    label={allergie}
                  />
                </div>
              ))}
              {optionSelected === "Otro" ? (
                <DinamicForm
                  control={form.control}
                  name="allergies"
                  fieldType={FormFieldType.TEXTAREA}
                  placeholder="Otro..."
                />
              ) : null}
            </RadioGroup>
          </FormControl>
        );
      case "Otras":
        return (
          <DinamicForm
            control={form.control}
            name="allergies"
            fieldType={FormFieldType.TEXTAREA}
            placeholder="Otro..."
          />
        );
      default:
        return <div>No Option Selected</div>;
    }
  };
  return <div>{renderSwitch(allergiesType)}</div>;
};

export default DinamicAllergieContent;
