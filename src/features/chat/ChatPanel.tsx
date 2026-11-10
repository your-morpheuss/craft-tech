"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUp, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { site } from "@/content/site";
import { useOnline } from "@/components/system/NetworkStatus";

type Msg = { role: "user" | "assistant"; content: string; sources?: { title: string; url: string }[]; error?: boolean };

const SUGGESTIONS = [
  "I need a website for my clothing brand",
  "How much does SEO cost?",
  "Does Retail POS work without internet?",
  "Can I speak to someone?",
];

/** Minimal safe renderer: paragraphs, **bold**, and [links](…) to site paths, mailto or https only. */
function renderRich(text: string): ReactNode {
  return text.split(/\n{2,}/).map((para, pi) => {
    const parts: ReactNode[] = [];
    const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
    let last = 0;
    let m: RegExpExecArray | null;
    let k = 0;
    while ((m = re.exec(para))) {
      if (m.index > last) parts.push(para.slice(last, m.index));
      if (m[1]) parts.push(<strong key={k++}>{m[1]}</strong>);
      else {
        const href = m[3];
        if (href.startsWith("/")) parts.push(<Link key={k++} href={href} className="text-blue underline underline-offset-2">{m[2]}</Link>);
        else if (/^(mailto:|https:\/\/)/.test(href)) parts.push(<a key={k++} href={href} className="text-blue underline underline-offset-2" target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">{m[2]}</a>);
        else parts.push(m[2]);
      }
      last = re.lastIndex;
    }
    if (last < para.length) parts.push(para.slice(last));
    return (
      <p key={pi} className="whitespace-pre-line [&+p]:mt-2.5">
        {parts.map((p, i) => <Fragment key={i}>{p}</Fragment>)}
      </p>
    );
  });
}

export function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [mode, setMode] = useState<"ai" | "search" | null>(null);
  const online = useOnline();
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch("/api/chat").then((r) => r.json()).then((d: { mode: "ai" | "search" }) => setMode(d.mode)).catch(() => setMode(null));
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  async function send(text: string) {
    const content = text.trim().slice(0, 1500);
    if (!content || pending) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setPending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.filter((m) => !m.error).slice(-12).map(({ role, content }) => ({ role, content })) }),
      });
      const data = (await res.json()) as { reply?: string; sources?: Msg["sources"]; error?: string; mode?: "ai" | "search" };
      if (!res.ok || !data.reply) throw new Error(data.error ?? "Something went wrong.");
      if (data.mode) setMode(data.mode);
      setMessages((m) => [...m, { role: "assistant", content: data.reply!, sources: data.sources }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", error: true, content: `${e instanceof Error ? e.message : "Something went wrong."} You can also email [${site.email}](mailto:${site.email}).` }]);
    } finally {
      setPending(false);
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Craft Tech Labs assistant"
      data-no-print
      className="fixed inset-x-0 bottom-0 z-[66] flex h-[min(640px,88dvh)] flex-col overflow-hidden rounded-t-2xl border border-line bg-surface shadow-[0_24px_64px_-16px_rgba(7,16,30,0.45)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[400px] sm:rounded-2xl"
    >
      <div className="surface-dark flex items-start justify-between gap-4 px-5 py-4">
        <div>
          <p className="font-semibold">Ask Craft Tech Labs</p>
          <p className="mt-0.5 text-xs text-d-muted">
            {mode === "ai"
              ? "AI assistant · answers from our website content · may make mistakes"
              : mode === "search"
                ? "Site search assistant · answers are excerpts from our pages"
                : "Assistant"}
          </p>
        </div>
        <button type="button" onClick={onClose} className="-mr-1 inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10" aria-label="Close assistant">
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-5 text-[0.9375rem] leading-relaxed" aria-live="polite">
        <div className="rounded-xl bg-sunk px-4 py-3 text-text-2">
          Hi — I can explain our services, Retail POS, pricing and how projects work. For anything else, a person replies at{" "}
          <a href={`mailto:${site.email}`} className="text-blue underline underline-offset-2">{site.email}</a>.
        </div>
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => send(s)} disabled={!online} className="rounded-full border border-line px-3 py-1.5 text-left text-sm text-text-2 transition-colors hover:border-blue hover:text-blue disabled:opacity-50">
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={cn("max-w-[88%]", m.role === "user" ? "ml-auto rounded-xl bg-ink px-4 py-2.5 text-white" : "text-text")}>
            {m.role === "user" ? m.content : (
              <div className={cn(m.error && "text-error")}>
                {renderRich(m.content)}
                {!!m.sources?.length && (
                  <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Related pages">
                    {m.sources.map((s) => (
                      <li key={s.url + s.title}><Link href={s.url} className="text-label inline-block rounded border border-line px-2 py-1 normal-case tracking-normal text-muted hover:border-blue hover:text-blue">{s.title}</Link></li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
        {pending && (
          <div className="flex items-center gap-1.5 text-muted" role="status" aria-label="Assistant is replying">
            {[0, 1, 2].map((d) => <span key={d} className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue" style={{ animationDelay: `${d * 150}ms` }} />)}
          </div>
        )}
      </div>

      <form
        className="border-t border-line p-3"
        onSubmit={(e) => { e.preventDefault(); send(input); }}
      >
        {!online && <p className="px-2 pb-2 text-xs text-error">You’re offline — the assistant needs a connection.</p>}
        <div className="flex items-end gap-2">
          <label htmlFor="chat-input" className="sr-only">Your question</label>
          <textarea
            ref={inputRef}
            id="chat-input"
            rows={1}
            maxLength={1500}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Ask a question…"
            className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border border-line bg-bg px-3.5 py-2.5 text-[0.9375rem] outline-none focus:border-blue"
          />
          <button type="submit" disabled={!input.trim() || pending || !online} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-colors hover:bg-blue disabled:opacity-40" aria-label="Send">
            <ArrowUp className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <p className="mt-2 px-1 text-[0.7rem] text-muted">Don’t share sensitive personal information. <Link href="/privacy-policy" className="underline">Privacy</Link></p>
      </form>
    </div>
  );
}
