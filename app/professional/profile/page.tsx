import React from 'react'
import WelcomeSection from '../components/WelcomeSection'
import { cookies } from 'next/headers';
// import { ScrollArea } from "../../../components/ui/scroll-area";
import { ProfessionalInformation } from '@/interfaces';
import { apiServer } from '@/api/api-server';

const Profile = async() => {
    const cookieStore = cookies();
      const professionalId = cookieStore.get("professional-id")?.value;
    
      // categorization data
      let { data }: { data: ProfessionalInformation } = await apiServer.get(
        `/professional/get-professional/${professionalId}`
      );

  return (
    <section className="w-full h-auto flex flex-col items-center justify-start gap-2 py-1">
        {/* <ScrollArea className='w-full h-full'> */}
        <WelcomeSection professional={data}/>
        {/* </ScrollArea> */}
    </section>
  )
}

export default Profile