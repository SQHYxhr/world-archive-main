"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

const SCROLL_THRESHOLD = 400;

/**
 * Radix ScrollArea renders `<ScrollAreaPrimitive.Viewport>` which
 * produces a DOM element with this data attribute. This is a stable
 * Radix implementation detail used to locate the actual scrollable
 * element inside a ScrollArea wrapper.
 */
const RADIX_VIEWPORT_SELECTOR = "[data-radix-scroll-area-viewport]";

function findViewport(container: HTMLElement): HTMLElement | null {
  return container.querySelector(RADIX_VIEWPORT_SELECTOR) as HTMLElement | null;
}

interface BackToTopButtonProps {
  /**
   * Ref to a DOM element that wraps a Radix ScrollArea on the project page.
   * When provided, the button additionally monitors and can scroll the
   * ScrollArea's viewport.  Window scrolling is **always** monitored regardless
   * of this prop so that mobile / homepage window scroll works in every layout.
   */
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
}

export function BackToTopButton({ scrollContainerRef }: BackToTopButtonProps) {
  const [windowScrolled, setWindowScrolled] = useState(false);
  const [viewportScrolled, setViewportScrolled] = useState(false);
  const viewportRef = useRef<HTMLElement | null>(null);

  // ── Window scroll ─────────────────────────────────────────────
  // Always active — covers homepage and mobile project pages.
  useEffect(() => {
    const onScroll = () => {
      setWindowScrolled(window.scrollY > SCROLL_THRESHOLD);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── ScrollArea viewport scroll (desktop project page) ─────────
  // Only active when a container ref is supplied and a Radix viewport
  // is found inside it.  Panel-mode switches (detail ↔ editor) are
  // handled via MutationObserver so the listener stays on the current
  // viewport.
  useEffect(() => {
    const container = scrollContainerRef?.current;
    if (!container) return;

    const onScroll = () => {
      if (viewportRef.current) {
        setViewportScrolled(viewportRef.current.scrollTop > SCROLL_THRESHOLD);
      }
    };

    const attach = (vp: HTMLElement) => {
      viewportRef.current = vp;
      vp.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    };

    const detach = () => {
      if (viewportRef.current) {
        viewportRef.current.removeEventListener("scroll", onScroll);
        viewportRef.current = null;
      }
      setViewportScrolled(false);
    };

    const initialVp = findViewport(container);
    if (initialVp) attach(initialVp);

    const observer = new MutationObserver(() => {
      const vp = findViewport(container);
      if (vp === viewportRef.current) return;
      detach();
      if (vp) attach(vp);
    });

    observer.observe(container, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      detach();
    };
  }, [scrollContainerRef]);

  // ── Visible when _either_ scroll source exceeds threshold ─────
  const visible = windowScrolled || viewportScrolled;

  // ── Click: scroll both sources so no scroll position is left ───
  // "Both to top" avoids a residual scroll offset in the other
  // dimension (e.g. viewport scrolled but window also slightly offset).
  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (scrollContainerRef?.current) {
      const vp = findViewport(scrollContainerRef.current);
      vp?.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [scrollContainerRef]);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 rounded-full border border-border/80 bg-card p-3 text-muted-foreground shadow-lg transition-all hover:bg-secondary hover:text-foreground hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label="返回顶部"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
