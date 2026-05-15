import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const RESUME_URL = '/resume.pdf';

export default function ResumeModal() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // bind all global triggers
  useEffect(() => {
    const triggers = document.querySelectorAll<HTMLElement>('[data-resume-trigger]');
    const onClick = () => setOpen(true);
    triggers.forEach((t) => t.addEventListener('click', onClick));
    // Haptic on open (Apple HIG haptic-feedback for important confirmations)
    const haptic = () => {
      if ('vibrate' in navigator) navigator.vibrate?.(8);
    };
    triggers.forEach((t) => t.addEventListener('click', haptic));
    return () => {
      triggers.forEach((t) => t.removeEventListener('click', onClick));
      triggers.forEach((t) => t.removeEventListener('click', haptic));
    };
  }, []);

  // Track mobile breakpoint so we can switch presentation styles.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // open/close lifecycle (body lock, focus, ESC)
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();

    // Desktop: GSAP scale+fade-in for the centered modal.
    // Mobile: CSS-driven slide-up (ios-sheet-in keyframe) — no GSAP needed.
    if (!isMobile) {
      const overlay = overlayRef.current;
      const panel = panelRef.current;
      if (overlay) gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      if (panel)
        gsap.fromTo(
          panel,
          { y: 24, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' },
        );
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, isMobile]);

  if (!open) return null;

  // ─── MOBILE: iOS-style bottom sheet ───────────────────────────────────────
  if (isMobile) {
    const dismiss = () => setOpen(false);
    return (
      <>
        <div
          className="ios-sheet-backdrop z-[149]"
          onClick={dismiss}
          aria-hidden="true"
        />
        <div
          ref={panelRef}
          className="ios-sheet-panel z-[150]"
          role="dialog"
          aria-modal="true"
          aria-label="Resume"
        >
          {/* Drag handle — purely visual affordance signalling "swipe to dismiss" */}
          <span className="ios-sheet-grabber" aria-hidden="true" />

          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="grid place-items-center w-8 h-8 rounded-lg bg-accent/12 border border-accent/30 text-accent">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="font-display font-semibold text-[13px] text-ink truncate leading-tight">Resume</p>
                <p className="text-[10px] text-ink-dim font-mono truncate">shashank s j · resume.pdf</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={RESUME_URL}
                download
                className="tap-press inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-[#0a0a0f] text-[11px] font-medium"
                aria-label="Download resume"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>get</span>
              </a>
              <button
                ref={closeBtnRef}
                type="button"
                aria-label="Close resume"
                onClick={dismiss}
                className="tap-press-firm grid place-items-center w-9 h-9 rounded-full bg-white/[0.05] text-ink-muted active:text-ink"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 bg-[#1c1c26]">
            <iframe
              src={`${RESUME_URL}#view=FitH`}
              title="Resume PDF"
              className="w-full h-full"
              style={{ border: 0 }}
            />
          </div>
        </div>
      </>
    );
  }

  // ─── DESKTOP: centered modal (unchanged) ─────────────────────────────────
  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[150] grid place-items-center bg-base-page/85 backdrop-blur-md p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Resume"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-5xl h-[92vh] sm:h-[88vh] rounded-2xl bg-base-card border border-base-border overflow-hidden flex flex-col shadow-[0_30px_120px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-base-border bg-base-surface/60">
          <div className="flex items-center gap-3 min-w-0">
            <span className="grid place-items-center w-8 h-8 rounded-md bg-accent/10 border border-accent/30 text-accent">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="font-display font-semibold text-sm text-ink truncate">Resume — Shashank S J</p>
              <p className="text-[11px] text-ink-dim font-mono truncate">resume.pdf</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={RESUME_URL}
              download
              className="tap-press inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent text-[#0a0a0f] text-xs font-medium hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-shadow"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download
            </a>
            <button
              ref={closeBtnRef}
              type="button"
              aria-label="Close resume"
              onClick={() => setOpen(false)}
              className="tap-press-firm grid place-items-center w-9 h-9 rounded-md border border-base-border text-ink-muted hover:text-ink hover:border-accent transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 bg-[#1c1c26]">
          <iframe
            src={`${RESUME_URL}#view=FitH`}
            title="Resume PDF"
            className="w-full h-full"
            style={{ border: 0 }}
          />
        </div>

        <div className="hidden sm:flex items-center justify-between px-5 py-2.5 border-t border-base-border bg-base-surface/40 text-[11px] text-ink-dim">
          <span>Esc to close · click outside to dismiss</span>
          <a href={RESUME_URL} target="_blank" rel="noreferrer" className="hover:text-accent">
            Open in new tab ↗
          </a>
        </div>
      </div>
    </div>
  );
}
