"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// 👇 Evitamos hidratar un componente pesado como el AlertDialog antes de tiempo
const PasskeyModal = dynamic(() => import("./PasskeyModal"), {
  ssr: false,
});

const PasskeyModalWrapper = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <PasskeyModal />;
};

export default PasskeyModalWrapper;
