// app/admin/professional-registration/page.tsx
import { validateToken } from "@/app/actions";
import ProfessionalRegistration from "./ProfessionalRegistration";


interface Props {
  searchParams: {
    token?: string;
  };
}

interface TokenResponse {
  data: {
    email: string;
  };
}

const ProfessionalRegistrationPage = async ({ searchParams }: Props) => {
  const token = searchParams.token;
console.log("Token recibido:", token);
  if (!token) {
    return <p className="text-red-500">Token no proporcionado.</p>;
  }

  const result = await validateToken(token) as TokenResponse;
console.log(result)
  if (!result?.data?.email) {
    return <p className="text-red-500">Token inválido o expirado.</p>;
  }

  return <ProfessionalRegistration email={result.data.email} />;
};

export default ProfessionalRegistrationPage;
