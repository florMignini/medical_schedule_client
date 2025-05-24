"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { validateToken } from "@/app/actions";
import { Skeleton } from "../../components/ui/skeleton";
import { ScrollArea } from "../../components/ui/scroll-area";
import ProfessionalRegistrationForm from "../(admin)/admin/components/forms/ProfessionalRegistrationForm";



interface TokenValidationResponse {
  status: number;
  data: {
    email: string;
  };
  message: string;
}

const ProfessionalRegistration = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    (async () => {
      if (!token) return;
      try {
        const response = await validateToken(token as string) as TokenValidationResponse;
        if (response.status === 200) {
          setEmail(response.data.email);
          setTokenValid(true);
        } else {
          setError(response.message);
        }
      } catch (err: any) {
        console.error("Error validating token:", err);
        setError("Error validating token, please try again.");
      } finally {
        setLoading(false);
      }
    })
  }, [token]);
  if (loading) return <Skeleton className="h-[90%] bg-gray-500 w-[95%] mx-auto my-auto rounded-md" />;
  if (!tokenValid) return <p className="text-red-500">Invalid or expired token.</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  return (
    <section className="w-full h-screen flex pt-2 flex-col items-center justify-start gap-2">
      <ScrollArea className="h-[98%] w-[99%] rounded-md border border-dark-500 p-4">
        <ProfessionalRegistrationForm
        email={email}
        />
      </ScrollArea>
    </section>
  );
};

export default ProfessionalRegistration;
