import ReminderBell from './icons/ReminderBell'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import AppointmentReminderForm from '@/components/forms/AppointmentReminderForm'

const ReminderButton = () => {
  return (
    <Drawer>
        <DrawerTrigger>
        <button className="flex items-center justify-end cursor-pointer"
              
              >
                <ReminderBell
                className="text-yellow-300"
                width={23}
                height={23}
                />
              
              </button>
        </DrawerTrigger>
        <DrawerContent className="flex h-[50%] flex-col gap-4 text-white bg-black/90 rounded-md border-none p-4">
        <AppointmentReminderForm/>
        </DrawerContent>
    </Drawer>
  )
}

export default ReminderButton