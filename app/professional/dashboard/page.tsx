import React from 'react'

const ProfessionalDashboard = () => {
  return (
    <div className="grid grid-col-[50%,50%]">
    {/* information side */}
    <div className="flex flex-col gap-4">
      {/* patient section */}
      <div className="w-[95%] bg-dark-400 rounded-md">
        <p className="p-3 font-bold">Pacientes</p>
      </div>

      {/* institutions section */}
      <div className="w-[95%] bg-dark-400 rounded-md">
        <p className="p-3 font-bold">Instituciones</p>
      </div>
    </div>
    {/* profile side */}
    <div className="w-full hidden lg:flex p-1 bg-dark-400 rounded-md">
      <div className="w-[99%] h-10 flex items-center justif rounded-lg bg-dark-300">
        <h1 className="text-18-bold text-left pl-1">Mi Perfil</h1>
      </div>
    </div>
  </div>
  )
}

export default ProfessionalDashboard