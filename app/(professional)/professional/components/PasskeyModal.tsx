"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import closeImage from "../../../../public/assets/icons/close.svg";
import { encryptKey } from "@/lib";

const PasskeyModal = () => {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        router.replace("/admin/admin-panel/professional-list");
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [open, router]);

  const closeModal = () => {
    setOpen(false);
    router.replace("/");
  };

  const validatePasskey = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      const encryptedKey = encryptKey(passkey);
      localStorage.setItem("admin-accessKey", encryptedKey);
      setError("");
      setOpen(false);
    } else {
      setError("Invalid Passkey, try again Please");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="w-full max-w-[60%] bg-[rgb(41,41,41)] rounded-lg">
        <AlertDialogHeader className="text-white/50">
          <AlertDialogTitle className="flex items-start justify-between">
            Admin Access Verification
            <Image
              src={closeImage}
              alt="close-icon"
              width={20}
              height={20}
              onClick={closeModal}
              className="cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            OTP - Verification is a must for admin access
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div>
          <InputOTP
            maxLength={6}
            value={passkey}
            onChange={(value) => setPasskey(value)}
          >
            <InputOTPGroup className="shad-otp">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot className="shad-otp-slot" key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
          {error && (
            <p className="shad-error text-14-regular mt-4 flex justify-center">
              {error}
            </p>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogAction className="text-white/50" onClick={validatePasskey}>
            Enter Passkey
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PasskeyModal;
