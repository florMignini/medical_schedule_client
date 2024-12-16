"use client"
import React from 'react'
import Image from "next/image";
import Logo from "../../../public/assets/medical_schedule-logo.svg";
import Logout from '@/app/professional/components/icons/Logout';
import { useRouter } from 'next/navigation';

const AdminNavbar = () => {
  const router = useRouter()
  const closeSession = () => {
    localStorage.removeItem('admin-accessKey');
    router.push("/")
  }
  return (
    <nav className="bg-dark-300 w-full">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <div className="pl-2 flex flex-col items-center justify-center">
                <Image
                  src={Logo}
                  alt="Medical_Schedule_logo"
                  width={180}
                  height={180}
                />
              </div>
            </div>
        
              {/* Admin Welcome */}
              <div className=" text-white p-2 w-[50%] h-12 flex items-center justify-between">
                <p className="w-[60%] flex flex-row items-center justify-center font-bold text-xl">Welcome Admin</p>
                <button className='w-[40%] flex items-center justify-end flex-col'
                onClick={closeSession}
                >
                  <Logout
                  width={20}
                  height={20}
                  />
                  <p className='text-[10px]'>Cerrar session</p>
                </button>
              </div>
          
          </div>
        </div>
      </nav>
  )
}

export default AdminNavbar