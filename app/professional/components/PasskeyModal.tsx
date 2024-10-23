"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import closeImage from "../../../public/assets/icons/close.svg";
import { decryptKey, encryptKey } from "@/lib";
const PasskeyModal = () => {
  const router = useRouter();
  const path = usePathname()
  const [open, setOpen] = useState<boolean>(true);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState<string>("");
  const encryptedKey =
    typeof window !== "undefined"
      ? window.localStorage.getItem("admin-accessKey")
      : null;

      useEffect(() => {
        const accessKey = encryptedKey ? decryptKey(encryptedKey) : null;
       if(path) {
        if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
           setOpen(false)
           router.push("/admin")
          } else {
            setOpen(true)
          }
       }
      }, [encryptKey])
      
  const closeModal = () => {
    setOpen(false);
    router.push("/");
  };
  const validatePasskey = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      const encryptedKey = encryptKey(passkey);
      localStorage.setItem("admin-accessKey", encryptedKey);
    } else {
      setError("Invalid Passkey, try again Please");
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader className="text-white/50">
          <AlertDialogTitle className="flex items-start justify-between">
            Admin Access Verification
            <Image
              src={closeImage}
              alt="close-icon"
              width={20}
              height={20}
              onClick={() => closeModal()}
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
              <InputOTPSlot className="shad-otp-slot" index={0} />
              <InputOTPSlot className="shad-otp-slot" index={1} />
              <InputOTPSlot className="shad-otp-slot" index={2} />
              <InputOTPSlot className="shad-otp-slot" index={3} />
              <InputOTPSlot className="shad-otp-slot" index={4} />
              <InputOTPSlot className="shad-otp-slot" index={5} />
            </InputOTPGroup>
          </InputOTP>
          {error && (
            <p className="shad-error text-14-regular mt-4 flex justify-center">
              {error}
            </p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogAction
          className="text-white/50"
          onClick={(e) => validatePasskey(e)}>
            Enter Passkey
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PasskeyModal;
