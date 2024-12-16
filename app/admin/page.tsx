"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const AdminHome = () => {
  const route = useRouter()
  const [value, setValue] = useState<string | undefined>();
  // Retrieve admin-accessKey from local storage and log it to the console.
useEffect(() => {
  const data = localStorage.getItem("admin-accessKey")
  setValue(data!)
}, [])
if(value !== null){
route.push("/admin/professional-list")
}else{
  route.push("/")
}
  return(
   <section className="w-full flex items-start justify-center pt-10">
    <h1 className="font-semibold text-white text-3xl md:text-5xl lg:text-7xl">Admin-dashboard</h1>
   </section>
  )
};

export default AdminHome;
