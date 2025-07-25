import React from "react";
import WelcomeSection from "../components/WelcomeSection";
import { cookies } from "next/headers";
// import { ScrollArea } from "../../../components/ui/scroll-area";
import { ProfessionalInformation } from "@/interfaces";
import { apiServer } from "@/api/api-server";
import { getProfessionalIncludesFromCookies } from "@/utils/getProfessionalIncludesFromCookies";

const Profile = async () => {
  const { data } = await getProfessionalIncludesFromCookies();
  return (
    <section className="w-full h-auto flex pt-5 flex-col items-center justify-start gap-2 py-1">
      <WelcomeSection professional={data} />
    </section>
  );
};

export default Profile;
