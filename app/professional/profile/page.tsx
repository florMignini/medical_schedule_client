import React from 'react'
import WelcomeSection from '../components/WelcomeSection'
import { cookies } from 'next/headers';
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
    <section className="w-full h-screen flex flex-col items-center justify-start gap-2">
        <WelcomeSection professional={data}/>
    </section>
  )
}

export default Profile