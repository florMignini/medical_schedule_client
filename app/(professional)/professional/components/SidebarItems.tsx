import Image from 'next/image'
import Link from 'next/link'
import { closeSessionServer } from '@/app/actions'
import { ProfessionalSidebarData } from '@/app/(professional)/professional/data'
import medicalScheduleLogo from '../../../../public/assets/medical_schedule-logo.svg'
import { LogOut } from 'lucide-react'

export const logout = (setIsOpen: (value: boolean) => void) => {
  try {
    setIsOpen(false);
    localStorage.clear()
    closeSessionServer();

  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
}

const SidebarItems = ({setIsOpen}:{
  setIsOpen: (value: boolean) => void;
}) => {
  return (
    <main className='flex flex-col items-center justify-between h-full w-full p-4 text-white bg-transparent backdrop-blur-lg'>
      <div>
      <Link href='/professional/dashboard'
      className='flex items-center justify-center mb-6'
      onClick={() => setIsOpen(false)}
      >
        <Image
          src={medicalScheduleLogo}
          alt="medical-schedule-logo"
          width={150}
          height={50}
          className="mb-6 mx-auto"
        />
      </Link>
      {ProfessionalSidebarData.map((item)=>(
        <Link
          key={item.label}
          href={item.path}
          className="flex items-center gap-2 p-2 rounded hover:bg-gray-200/20 transition-colors"
        onClick={() => setIsOpen(false)}
        >
          <item.component className="w-6 h-6" />
          <span className='font-mono font-medium text-start'>{item.label}</span>
        </Link>
      ))}
      </div>
      <button className='flex items-center gap-2 p-2 rounded hover:bg-gray-200/20 transition-colors'
      onClick={() => {
        console.log(`cerrar sesión`);
        setIsOpen(false);
      }}>
        <LogOut size={25}/>
        <span className='font-mono font-semibold'
        onClick={() => logout(setIsOpen)}
        >Cerrar Sesión</span>
      </button>
    </main>
  )
}

export default SidebarItems