import { redirect } from "next/navigation";
import ResetPasswordForm from "@/components/forms/ResetPasswordForm";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams?.token;

  if (!token) {
    // si no hay token, redirigimos
    redirect("/forgot-password");
  }
console.log(token)
  return (
    <div className="flex w-[100%] h-screen items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
