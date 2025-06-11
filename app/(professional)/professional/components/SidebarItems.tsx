import Image from 'next/image'
import Link from 'next/link'
import { ProfessionalSidebarData } from '@/app/(professional)/professional/data'
import medicalScheduleLogo from '../../../../public/assets/medical_schedule-logo.svg'


const SidebarItems = ({setIsOpen}:{
  setIsOpen: (value: boolean) => void;
}) => {
  return (
    <>
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
    </>
  )
}

export default SidebarItems