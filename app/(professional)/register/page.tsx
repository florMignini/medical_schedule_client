import React, { Suspense } from "react";
import ProfessionalRegistration from "./professional-registration/page";


const Page = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ProfessionalRegistration />
    </Suspense>
  );
};

export default Page;
