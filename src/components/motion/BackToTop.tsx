"use client";

export function BackToTop() {
  return (
    <button
      type="button"
      className="link-underline pb-0.5 hover:text-white"
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        document.getElementById("main")?.focus({ preventScroll: true });
      }}
    >
      Back to top ↑
    </button>
  );
}
