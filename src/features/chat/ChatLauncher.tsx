"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { track } from "@/lib/analytics";

// The panel (and its logic) loads only when a visitor opens it.
const ChatPanel = dynamic(() => import("./ChatPanel").then((m) => m.ChatPanel), { ssr: false });

const subscribeScroll = (cb: () => void) => {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
};

export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const pathname = usePathname();
  // On the homepage the hero has its own controls bottom-right; reveal the launcher once the visitor scrolls.
  const scrolled = useSyncExternalStore(subscribeScroll, () => window.scrollY > 320, () => false);
  const hidden = pathname === "/" && !scrolled;

  return (
    <>
      {!open && !hidden && (
        <button
          type="button"
          data-no-print
          onClick={() => { setLoaded(true); setOpen(true); track("chat_opened"); }}
          onPointerEnter={() => setLoaded(true)}
          className="group fixed bottom-4 right-4 z-[65] inline-flex h-14 w-14 items-center justify-center gap-2.5 rounded-full bg-ink text-sm font-medium text-white shadow-[0_12px_32px_-12px_rgba(7,16,30,0.6)] transition-colors hover:bg-blue sm:bottom-6 sm:right-6 sm:w-auto sm:pl-4 sm:pr-5"
          aria-haspopup="dialog"
          aria-label="Ask Craft Tech Labs — open assistant"
        >
          <MessageSquare className="h-5 w-5 text-cyan transition-colors group-hover:text-white" strokeWidth={1.75} aria-hidden />
          <span className="hidden sm:inline">Ask Craft Tech Labs</span>
        </button>
      )}
      {loaded && <ChatPanel open={open} onClose={() => setOpen(false)} />}
    </>
  );
}
