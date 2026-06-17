"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GivePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/fund/development-fund");
  }, [router]);
  return null;
}
