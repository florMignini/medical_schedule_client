"use client";
import { useEffect, useState } from "react";

import { validateToken } from "@/app/actions";
import { Skeleton } from "../../../components/ui/skeleton";
import { ScrollArea } from "../../../components/ui/scroll-area";
import ProfessionalRegistrationForm from "../../(admin)/admin/components/forms/ProfessionalRegistrationForm";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface TokenValidationResponse {
  status: number;
  data: {
    email: string;
  };
  message: string;
}

interface ProfessionalRegistrationProps {
  token?: string;
}

const ProfessionalRegistration = ({ token }: ProfessionalRegistrationProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  useEffect(() => {
    const validate = async () => {
      if (!token) {

        setError("Error validating token, please try again.");
        setLoading(false);
        router.push("/admin");

      }else{
        const response = await validateToken(
          token
        );
console.log("Response:", response);
        // if (response) {
        //   setEmail(response.email);
        //   setTokenValid(true);
        // }

      }
    };

    validate();
  }, [token]);
// console.log("Email:", email);
// console.log("Token Valid:", tokenValid);
// console.log("Error:", error);
// console.log("Loading:", loading);
  return loading ? (
    <Skeleton className="h-[90%] bg-gray-500 w-[95%] mx-auto my-auto rounded-md" />
  ) : (
    <section className="w-full h-screen flex pt-2 flex-col items-center justify-start gap-2">
      {email ? (
        <ScrollArea className="h-[98%] w-[99%] rounded-md border border-dark-500 p-4">
          <ProfessionalRegistrationForm email={email} />
        </ScrollArea>
      ) : (
        <p className="text-red-500">{error}</p>
      )}
    </section>
  );
};

export default ProfessionalRegistration;
