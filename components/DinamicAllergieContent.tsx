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
const DinamicAllergieContent = ({ allergiesType, form }: any) => {
  const renderSwitch = (allergie: string) => {
    let content = [];
    switch (allergie) {
      case "Alimentos":
        return (
          <DinamicForm
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="food_allergie"
            label="Alimentos"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex flex-wrap  xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {foodAllergies.map((allergie: string) => (
                    <div key={allergie} className="radio-group gap-1">
                      <RadioGroupItem value={allergie} id={allergie} />
                      <Label htmlFor={allergie} className="cursor-pointer">
                        {allergie}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        );
      case "Drogas/Medicamentos":
        return (
          <DinamicForm
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="drug/med_allergie"
            label="Drogas/Medicamentos"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex flex-wrap  xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {medAllergies.map((allergie: string) => (
                    <div key={allergie} className="radio-group gap-1">
                      <RadioGroupItem value={allergie} id={allergie} />
                      <Label htmlFor={allergie} className="cursor-pointer">
                        {allergie}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        );
      case "Ambientales/Estacionales":
        return (
          <DinamicForm
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="environment_allergie"
            label="Ambientales/Estacionales"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex flex-wrap  xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {environmentAllergies.map((allergie: string) => (
                    <div key={allergie} className="radio-group gap-1">
                      <RadioGroupItem value={allergie} id={allergie} />
                      <Label htmlFor={allergie} className="cursor-pointer">
                        {allergie}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        );
      case "Contacto":
        return (
          <DinamicForm
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="contact_allergie"
            label="Contacto"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex flex-wrap  xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {contactAllergies.map((allergie: string) => (
                    <div key={allergie} className="radio-group gap-1">
                      <RadioGroupItem value={allergie} id={allergie} />
                      <Label htmlFor={allergie} className="cursor-pointer">
                        {allergie}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        );
      case "Otras":
        return (
          <Textarea
            placeholder="Otras alergias."
            className="w-full flex flex-1 bg-dark-400 text-white"
          />
        );
      default:
        return <div>No Option Selected</div>;
    }
  };
  return <div>{renderSwitch(allergiesType)}</div>;
};

export default DinamicAllergieContent;
