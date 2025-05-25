"use client";
import { useEffect, useState } from "react";

import { validateToken } from "@/app/actions";
import { Skeleton } from "../../../components/ui/skeleton";
import { ScrollArea } from "../../../components/ui/scroll-area";
import ProfessionalRegistrationForm from "../../(admin)/admin/components/forms/ProfessionalRegistrationForm";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { validateTokenClient } from "@/utils/validateTokenClient";

interface TokenValidationResponse {
  status: number;
  data: {
    email: string;
  };
  message: string;
}

interface ProfessionalRegistrationProps {
  email: string;
}

const ProfessionalRegistration = ({ email }: ProfessionalRegistrationProps) => {
  return (
    <section className="w-full h-screen flex pt-2 flex-col items-center justify-start gap-2">
      <ScrollArea className="h-[98%] w-[99%] rounded-md border border-dark-500 p-4">
        <ProfessionalRegistrationForm email={email} />
      </ScrollArea>
    </section>
  );
};

export default ProfessionalRegistration;
