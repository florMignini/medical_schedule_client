
const ProfessionalDashboard = () => {
  return (
    <section className="w-full h-[100%] flex flex-col mx-auto gap-4 text-white opacity-65">
        {/* patient section */}
        <div className="w-[95%] bg-dark-400 rounded-md">
          <p className="p-3 font-bold">Patients</p>
        </div>

        {/* institutions section */}
        <div className="w-[95%] bg-dark-400 rounded-md">
          <p className="p-3 font-bold">Institutions</p>
        </div>
    </section>
  )
}

export default ProfessionalDashboard