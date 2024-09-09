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
import { Textarea } from "./ui/textarea";
import { useState } from "react";

const DinamicAllergieContent = ({ allergiesType, form }: any) => {
  const renderSwitch = (allergie: string) => {
    const [optionSelected, setOptionSelected] = useState("");

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
                  <RadioGroupItem value={allergie} id={allergie} />
                  <Label htmlFor={allergie} className="cursor-pointer">
                    {allergie}
                  </Label>
                </div>
              ))}
              {optionSelected === "Otro" ? (
               <DinamicForm
               control={form.control}
               name="another_food_allergie"
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
                  <RadioGroupItem value={allergie} id={allergie} />
                  <Label htmlFor={allergie} className="cursor-pointer">
                    {allergie}
                  </Label>
                </div>
              ))}
              {optionSelected === "Otro" ? (
               <DinamicForm
               control={form.control}
               name="another_drug_allergie"
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
                  <RadioGroupItem value={allergie} id={allergie} />
                  <Label htmlFor={allergie} className="cursor-pointer">
                    {allergie}
                  </Label>
                </div>
              ))}
              {optionSelected === "Otro" ? (
                <DinamicForm
                control={form.control}
                name="another_ambiental_allergie"
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
                  <RadioGroupItem value={allergie} id={allergie} />
                  <Label htmlFor={allergie} className="cursor-pointer">
                    {allergie}
                  </Label>
                </div>
              ))}
              {optionSelected === "Otro" ? (
                <DinamicForm
                control={form.control}
                name="another_contact_allergie"
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
                name="other_allergie"
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
