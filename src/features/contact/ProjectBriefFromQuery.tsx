"use client";

import { useSearchParams } from "next/navigation";
import { SERVICE_IDS } from "@/features/pricing/types";
import { ProjectBriefForm } from "./ProjectBriefForm";

/** Pre-selects a service from ?service=… links on service and pricing pages. */
export function ProjectBriefFromQuery() {
  const q = useSearchParams().get("service");
  const service = SERVICE_IDS.find((id) => id === q);
  return <ProjectBriefForm key={service ?? "none"} initialService={service} />;
}
