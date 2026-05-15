import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, force3D: true });

    const mouse = { x: 0, y: 0 };
    const dotPos = { x: 0, y: 0 };
    const ringPos = { x: 0, y: 0 };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', onMove);

    const onEnter = () => {
      gsap.to(ring, { scale: 2.4, opacity: 0.8, duration: 0.3 });
      gsap.to(dot, { scale: 0, duration: 0.2 });
    };
    const onLeave = () => {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3 });
      gsap.to(dot, { scale: 1, duration: 0.2 });
    };

    const targets = document.querySelectorAll<HTMLElement>(
      'a, button, [data-cursor-hover]',
    );
    targets.forEach((t) => {
      t.addEventListener('mouseenter', onEnter);
      t.addEventListener('mouseleave', onLeave);
    });

    let raf = 0;
    const tick = () => {
      dotPos.x += (mouse.x - dotPos.x) * 0.6;
      dotPos.y += (mouse.y - dotPos.y) * 0.6;
      ringPos.x += (mouse.x - ringPos.x) * 0.18;
      ringPos.y += (mouse.y - ringPos.y) * 0.18;
      gsap.set(dot, { x: dotPos.x, y: dotPos.y });
      gsap.set(ring, { x: ringPos.x, y: ringPos.y });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    document.body.classList.add('has-custom-cursor');

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      targets.forEach((t) => {
        t.removeEventListener('mouseenter', onEnter);
        t.removeEventListener('mouseleave', onLeave);
      });
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[100] w-8 h-8 rounded-full border border-accent mix-blend-difference hidden md:block"
        aria-hidden="true"
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[100] w-1 h-1 rounded-full bg-accent hidden md:block"
        aria-hidden="true"
      />
    </>
  );
}
