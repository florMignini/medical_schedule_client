
const ProfessionalDashboard = () => {
  return (
    <section className="w-full h-[100%] xl:grid xl:grid-cols-[60%,40%] mx-auto  text-white opacity-65">
      {/* information side */}
        <div className="flex flex-col gap-4">
          {/* patient section */}
        <div className="w-[95%] bg-dark-400 rounded-md">
          <p className="p-3 font-bold">Patients</p>
        </div>

        {/* institutions section */}
        <div className="w-[95%] bg-dark-400 rounded-md">
          <p className="p-3 font-bold">Institutions</p>
        </div>
        </div>
        {/* profile side */}
        <div className="w-full xl:flex hidden p-1 bg-dark-400 rounded-md">
          <div className="w-[99%] h-10 flex items-center justif rounded-lg bg-dark-300">
              <h1 className="text-18-bold text-left pl-1">Mi Perfil</h1>
          </div>
        </div>
    </section>
  )
}

export default ProfessionalDashboard