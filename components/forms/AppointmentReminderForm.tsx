// components/reminder/ReminderForm.tsx
import { Reminder } from "@/interfaces/reminder.interface";
import { NewReminderSchema } from "@/lib/reminderValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, Label } from "../ui";
import DinamicForm from "../DinamicForm";
import { FormFieldType } from "./ProfessionalLoginForm";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { reminderTypeOptions } from "@/app/professional/data/reminderOptions";
import SubmitButton from "../SubmitButton";
import { useEffect, useState } from "react";
import { createProfessionalReminderRelation, createReminder } from "@/app/actions/reminderAction";
import Whatsapp from "@/app/professional/components/icons/Whatsapp";

interface ReminderFormProps {
  appointmentId?: string;
  userId?: string;
  initialData?: Partial<Reminder>;
}

const AppointmentReminderForm: React.FC<ReminderFormProps> = ({
  appointmentId,
  userId,
  initialData = {},
}) => {
  const form = useForm<z.infer<typeof NewReminderSchema>>({
    resolver: zodResolver(NewReminderSchema),
    defaultValues: {
      message: initialData.message || "",
      scheduledFor: initialData.scheduledFor || new Date(),
    },
  });
  const [profData, setProfData] = useState<any>({});
    //get professional id
    useEffect(() => {
      const profData = localStorage.getItem("infoProfSession");
      if (profData) {
        setProfData(JSON.parse(profData));
      }
    }, []);
    const { id } = profData!;
  const [loading, setLoading] = useState<boolean>(false);
  const buttonLabel = initialData.id
    ? "actualizar recordatorio"
    : "crear recordatorio";
  const {
    register,
    formState: { errors },
  } = form;

  
  async function onSubmit(values: z.infer<typeof NewReminderSchema>) {
   setLoading(true);
   console.log(values)
const reminderData = {
  appointmentId,
  userId,
  ...values,
}
   try {
    const response = await createReminder(reminderData);
    console.log(response);
    if (profData) {
            const IDs = {
              professional: profData.id,
              reminder: response.id,
            };
            const data = await createProfessionalReminderRelation(IDs);
          }

   } catch (error) {
    console.error(error);
    setLoading(false);
   }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* reminder title */}
        <div className="px-10 w-full flex items-center justify-start">
          <h2 className="text-base min-[375px]:text-xl min-[375px]:font-bold">Nuevo Recordatorio</h2>
          <Whatsapp className="h-6 w-6 ml-2" color="#AFE67F" />
          <h2 className="text-base min-[375px]:text-xl min-[375px]:font-bold">:</h2>
        </div>
        {/* message and schedule */}
        <div className="w-[75%] flex flex-col gap-5 mb-5 items-center justify-center mx-auto">
          <div className="w-full flex items-center justify-center flex-col">
            <Label
              htmlFor="message"
              className="w-full p-0 text-center font-light text-[13px] text-gray-300"
            >
              Mensaje:
            </Label>
            <DinamicForm
              name="message"
              control={form.control}
              placeholder="Mensaje para el recordatorio"
              fieldType={FormFieldType.TEXTAREA}
            />
          </div>
          <div className="w-full min-[768px]:w-[40%] flex flex-col items-center justify-center">
          <Label
            htmlFor="scheduledFor"
            className="pb-2 text-start font-light text-[13px] text-gray-300"
          >
            Programado para:
          </Label>
          <DinamicForm
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="scheduledFor"
            showTimeSelect
            defaultValue={new Date()}
            dateFormat="dd/MM/yyyy - h:mm aa"
          />
          {errors.scheduledFor && (
            <p className="mt-1 text-sm text-red-600">
              {errors.scheduledFor.message}
            </p>
          )}
        </div>
        
        </div>
        {/* submit button */}
        <div className="w-[40%] min-[768px]:w-[60%] flex mb-5 items-center justify-center mx-auto">
          <SubmitButton
            loading={loading}
            className="min-[375px]:w-[80%] min-[768px]:w-[60%] text-base font-light bg-white hover:bg-white/50 transition-colors rounded-lg p-2"
          >
            {buttonLabel}
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
};

// components/reminder/ReminderModal.tsx
// import { CreateReminderDto } from '../../services/reminderService';

// interface ReminderModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (data: CreateReminderDto) => void;
//   appointmentId: string;
//   userId: string;
// }

// const ReminderModal: React.FC<ReminderModalProps> = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   appointmentId,
//   userId,
// }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 max-w-md w-full">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">Nuevo Recordatorio</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-500"
//           >
//             <span className="sr-only">Cerrar</span>
//             <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <ReminderForm
//           appointmentId={appointmentId}
//           userId={userId}
//           onSubmit={(data) => {
//             onSubmit(data);
//             onClose();
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export { ReminderForm, ReminderList, ReminderModal };
export default AppointmentReminderForm;
