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
const [optionSelected, setOptionSelected] = useState("")
console.log(optionSelected)
    switch (allergie) {
      case "Alimentos":
        return (
          <FormControl>
                <RadioGroup
                  className="flex flex-wrap  xl:justify-between"
                 >
                 
                  {foodAllergies.map((allergie: string) => (
                    <div key={allergie} 
                    onChange={() => setOptionSelected(allergie)}
                    className="radio-group gap-1">
                      <RadioGroupItem value={allergie} id={allergie} />
                      <Label htmlFor={allergie} className="cursor-pointer">
                        {allergie}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
        );
      case "Drogas/Medicamentos":
        return (
          <FormControl>
                <RadioGroup
                  className="flex flex-wrap  xl:justify-between"
                  >
                  {medAllergies.map((allergie: string) => (
                    <div key={allergie} 
                    onChange={() => setOptionSelected(allergie)}
                    className="radio-group gap-1">
                      <RadioGroupItem value={allergie} id={allergie} />
                      <Label htmlFor={allergie} className="cursor-pointer">
                        {allergie}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
        );
      case "Ambientales/Estacionales":
        return (
          <FormControl>
          <RadioGroup
            className="flex flex-wrap  xl:justify-between"
            >
            {environmentAllergies.map((allergie: string) => (
              <div key={allergie} 
              onChange={() => setOptionSelected(allergie)}
              className="radio-group gap-1">
                <RadioGroupItem value={allergie} id={allergie} />
                <Label htmlFor={allergie} className="cursor-pointer">
                  {allergie}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </FormControl>
        );
      case "Contacto":
        return (
          <FormControl>
          <RadioGroup
            className="flex flex-wrap  xl:justify-between"
          >
            {contactAllergies.map((allergie: string) => (
              <div key={allergie} 
              onChange={() => setOptionSelected(allergie)}
              className="radio-group gap-1">
                <RadioGroupItem value={allergie} id={allergie} />
                <Label htmlFor={allergie} className="cursor-pointer">
                  {allergie}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </FormControl>
        );
      case "Otras":
        return (
          <Textarea
            placeholder="Otras alergias."
            className="w-full flex flex-1 bg-dark-400 text-white outline-none"
          />
        );
      default:
        return <div>No Option Selected</div>;
    }
  
  };
  return <div>{renderSwitch(allergiesType)}</div>;
};

export default DinamicAllergieContent;
