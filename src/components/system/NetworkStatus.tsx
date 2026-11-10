"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { WifiOff } from "lucide-react";

function subscribe(cb: () => void) {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  };
}

/** Live connectivity flag. Server snapshot assumes online. */
export function useOnline() {
  return useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
}

/** Registers the service worker and shows a polite offline notice. */
export function NetworkStatus() {
  const online = useOnline();
  const [dismissed, setDismissed] = useState(false);
  // A new offline episode shows the notice again.
  const [wasOnline, setWasOnline] = useState(online);
  if (online !== wasOnline) {
    setWasOnline(online);
    if (online) setDismissed(false);
  }

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => undefined);
  }, []);

  if (online || dismissed) return null;
  return (
    <div role="status" className="fixed bottom-4 left-4 z-[70] flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-full bg-ink px-4 py-3 text-sm text-white shadow-lg" data-no-print>
      <WifiOff className="h-4 w-4 shrink-0 text-cyan" aria-hidden />
      <span>You’re offline. Pages you’ve visited still work; forms and the assistant need a connection.</span>
      <button type="button" onClick={() => setDismissed(true)} className="ml-1 shrink-0 rounded-full px-2 text-white/70 hover:text-white" aria-label="Dismiss offline notice">×</button>
    </div>
  );
}
