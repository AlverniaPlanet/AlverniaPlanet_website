"use client";

import { useEffect } from "react";
import { primeBookeroRuntime } from "@/app/components/bookeroRuntime";

export default function BookeroRuntimeWarmup() {
  useEffect(() => {
    primeBookeroRuntime(true);
  }, []);

  return null;
}
