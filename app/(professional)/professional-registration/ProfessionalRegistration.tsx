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
  console.log("Token:", token);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  useEffect(() => {
    async () => {
      if (!token) {
        toast({
          title: "Token missing",
          description: "No registration token provided.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      try {
        const response = (await validateToken(
          token as string
        )) as TokenValidationResponse;
        if (response.status === 200) {
          setEmail(response.data.email);
          setTokenValid(true);
          setLoading(false);
        } else {
          setError(response.message);
        }
      } catch (err: any) {
        console.error("Error validating token:", err);
        setError("Error validating token, please try again.");
      } finally {
        setLoading(false);
      }
    };
  }, [token]);
  if (loading)
    return (
      <Skeleton className="h-[90%] bg-gray-500 w-[95%] mx-auto my-auto rounded-md" />
    );
  return (
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
