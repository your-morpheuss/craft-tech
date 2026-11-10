import type { ReactNode } from "react";
import { PageMotion } from "@/components/motion/PageMotion";

/** Each route gets its own motion scope; triggers are cleaned up when it unmounts or hides. */
export default function Template({ children }: { children: ReactNode }) {
  return <PageMotion>{children}</PageMotion>;
}
