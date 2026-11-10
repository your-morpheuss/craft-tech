import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

const control =
  "w-full rounded-[var(--radius-ctl)] border bg-surface px-4 text-[0.9875rem] text-text outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted/70 focus:border-blue focus:shadow-[0_0_0_3px_rgba(22,102,232,0.14)]";

type Base = { label: string; name: string; error?: string; hint?: ReactNode; optional?: boolean };

function Wrap({ id, label, error, hint, optional, children }: { id: string; label: string; error?: string; hint?: ReactNode; optional?: boolean; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-text">
        {label} {optional && <span className="font-normal text-muted">(optional)</span>}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="text-xs text-muted">{hint}</p>}
      {error && <p id={`${id}-error`} className="text-sm text-error">{error}</p>}
    </div>
  );
}

const describedBy = (id: string, error?: string, hint?: ReactNode) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined);

export function TextField({ label, name, error, hint, optional, className, ...props }: Base & Omit<ComponentProps<"input">, "name">) {
  const id = `f-${name}`;
  return (
    <Wrap id={id} label={label} error={error} hint={hint} optional={optional}>
      <input id={id} name={name} aria-invalid={!!error} aria-describedby={describedBy(id, error, hint)} className={cn(control, "h-12", error ? "border-error" : "border-line-strong", className)} {...props} />
    </Wrap>
  );
}

export function TextArea({ label, name, error, hint, optional, className, ...props }: Base & Omit<ComponentProps<"textarea">, "name">) {
  const id = `f-${name}`;
  return (
    <Wrap id={id} label={label} error={error} hint={hint} optional={optional}>
      <textarea id={id} name={name} aria-invalid={!!error} aria-describedby={describedBy(id, error, hint)} className={cn(control, "min-h-36 py-3", error ? "border-error" : "border-line-strong", className)} {...props} />
    </Wrap>
  );
}

export function SelectField({ label, name, error, hint, optional, options, placeholder, className, ...props }: Base & Omit<ComponentProps<"select">, "name"> & { options: readonly string[]; placeholder?: string }) {
  const id = `f-${name}`;
  return (
    <Wrap id={id} label={label} error={error} hint={hint} optional={optional}>
      <select id={id} name={name} aria-invalid={!!error} aria-describedby={describedBy(id, error, hint)} className={cn(control, "h-12 appearance-none", error ? "border-error" : "border-line-strong", className)} {...props}>
        <option value="">{placeholder ?? "Select…"}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </Wrap>
  );
}

/** Toggleable chip for multi-select groups (fieldset/legend wraps a set of these). */
export function Chip({ checked, onChange, children, name, value }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode; name: string; value: string }) {
  return (
    <label className={cn(
      "inline-flex cursor-pointer select-none items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue",
      checked ? "border-ink bg-ink text-white" : "border-line-strong bg-surface text-text-2 hover:border-ink",
    )}>
      <input type="checkbox" className="sr-only" name={name} value={value} checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", checked ? "bg-cyan" : "bg-line-strong")} />
      {children}
    </label>
  );
}
