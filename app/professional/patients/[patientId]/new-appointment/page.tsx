import NewAppointmentForm from '@/components/forms/NewAppointmentForm'
import React from 'react'

const NewAppointment = ({params}: {params: {patientId: string}}) => {
  return (
    <section className="w-full h-screen flex flex-col items-center justify-start gap-2">
        <NewAppointmentForm
        patientId={params.patientId}
        type="create"
        />
    </section>
  )
}

export default NewAppointment