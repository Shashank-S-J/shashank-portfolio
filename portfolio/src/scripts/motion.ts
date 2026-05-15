/**
 * Site-wide motion system.
 * - Initializes Lenis smooth scroll
 * - Registers GSAP ScrollTrigger
 * - Animates: hero headline (SplitType), .reveal sections, timeline line, project cards
 * - Respects prefers-reduced-motion
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Lenis smooth scroll ────────────────────────────────────────────────────
const lenis = new Lenis({
  duration: 1.15,
  lerp: 0.08,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1.4,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// in-page anchor smooth scroll via Lenis
document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href')!.slice(1);
    if (!id) return;
    const target = id === 'top' ? document.body : document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -64, duration: 1.2 });
  });
});

// ── Scroll progress bar ────────────────────────────────────────────────────
const bar = document.querySelector<HTMLElement>('[data-scroll-progress]');
if (bar) {
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      bar.style.transform = `scaleX(${self.progress})`;
    },
  });
}

// ── Universal haptic feedback on primary CTAs (Apple HIG haptic-feedback) ──
// Vibrates briefly on tap for any [data-magnetic] / [data-haptic] element.
// Most modern Android browsers honor Vibration API; iOS Safari ignores it
// silently, but every other interaction (scale-on-press, hover) still fires.
if (window.matchMedia('(pointer: coarse)').matches && !reduce && 'vibrate' in navigator) {
  const hapticSelector = '[data-magnetic],[data-haptic],[data-resume-trigger]';
  document.addEventListener(
    'pointerdown',
    (e) => {
      const t = e.target as Element | null;
      const hit = t?.closest?.(hapticSelector);
      if (!hit) return;
      // Skip on right-click / multi-touch tap.
      const pe = e as PointerEvent;
      if (pe.pointerType !== 'touch' && pe.pointerType !== 'pen') return;
      navigator.vibrate?.(6);
    },
    { passive: true }
  );
}

// ── Preloader fade-out (Apple-style: hold ~2s for a calm reveal) ──────────
const preloader = document.querySelector<HTMLElement>('[data-preloader]');
window.addEventListener('load', () => {
  if (!preloader) return;
  gsap.to(preloader, {
    autoAlpha: 0,
    duration: 0.9,
    delay: 1.15,
    ease: 'power2.inOut',
    onComplete: () => preloader.remove(),
  });
});

if (reduce) {
  gsap.set('.reveal', { clearProps: 'all', opacity: 1, y: 0 });
} else {
  // -- Hero headline split-text ---------------------------------------------
  const headline = document.querySelector('[data-hero-headline]');
  if (headline) {
    const split = new SplitType(headline as HTMLElement, { types: 'chars,words', tagName: 'span' });
    gsap.from(split.chars, {
      yPercent: 110,
      opacity: 0,
      filter: 'blur(12px)',
      duration: 0.95,
      ease: 'power4.out',
      stagger: 0.028,
      delay: 0.2,
    });
  }

  // -- Generic section reveals (blur-fade-up) -------------------------------
  document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
    gsap.from(el, {
      y: 48,
      opacity: 0,
      filter: 'blur(16px)',
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
    });
  });

  // -- Char-by-char scroll-driven opacity reveal ---------------------------
  // Groups chars into word wrappers (inline-block) so words never break mid-character on narrow mobile.
  document.querySelectorAll<HTMLElement>('[data-animated-text]').forEach((host) => {
    const text = host.textContent ?? '';
    host.textContent = '';
    const spans: HTMLElement[] = [];
    const words = text.split(/(\s+)/);
    for (const word of words) {
      if (/^\s+$/.test(word)) {
        host.appendChild(document.createTextNode(word));
        continue;
      }
      const wrap = document.createElement('span');
      wrap.style.display = 'inline-block';
      wrap.style.whiteSpace = 'nowrap';
      for (const ch of Array.from(word)) {
        const s = document.createElement('span');
        s.textContent = ch;
        s.style.opacity = '0.55';
        s.style.transition = 'opacity 0.18s linear';
        wrap.appendChild(s);
        spans.push(s);
      }
      host.appendChild(wrap);
    }
    ScrollTrigger.create({
      trigger: host,
      start: 'top 80%',
      end: 'bottom 35%',
      scrub: 0.5,
      onUpdate: (self) => {
        const cutoff = Math.floor(self.progress * spans.length * 1.1);
        for (let i = 0; i < spans.length; i++) {
          spans[i].style.opacity = i < cutoff ? '1' : '0.55';
        }
      },
    });
  });

  // -- Tech pills wave entrance ---------------------------------------------
  document.querySelectorAll<HTMLElement>('#stack .reveal').forEach((row) => {
    const pills = row.querySelectorAll<HTMLElement>('.tech-pill');
    if (!pills.length) return;
    gsap.from(pills, {
      opacity: 0,
      y: 24,
      filter: 'blur(8px)',
      duration: 0.55,
      ease: 'power2.out',
      stagger: 0.04,
      scrollTrigger: { trigger: row, start: 'top 85%', toggleActions: 'play none none reverse' },
    });
  });

  // -- Timeline line scrub --------------------------------------------------
  const line = document.querySelector<HTMLElement>('[data-timeline-line]');
  if (line) {
    gsap.fromTo(line, { scaleY: 0 }, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: '#experience', start: 'top 70%', end: 'bottom 80%', scrub: 0.6 },
    });
  }

  // -- Sticky-stack scale-down on project cards (per group, md+ only) -----
  const mm = gsap.matchMedia();
  mm.add('(min-width: 768px)', () => {
    const stackGroups = new Map<string, HTMLElement[]>();
    document.querySelectorAll<HTMLElement>('[data-stack-card]').forEach((card) => {
      const group = card.dataset.stackGroup ?? 'default';
      if (!stackGroups.has(group)) stackGroups.set(group, []);
      stackGroups.get(group)!.push(card);
    });
    stackGroups.forEach((cards, group) => {
      const total = cards.length;
      const endSentinel = document.querySelector(`[data-stack-end="${group}"]`) ?? '[data-stack-end]';
      cards.forEach((card, i) => {
        if (i === total - 1) return;
        const targetScale = 1 - (total - 1 - i) * 0.05;
        gsap.to(card, {
          scale: targetScale,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top 140px',
            endTrigger: endSentinel as Element | string,
            end: 'top 60%',
            scrub: 0.6,
          },
        });
      });
    });
  });

  // -- Tech marquee: continuous CSS-driven opposing rows (see global.css)
  //    Animation handled by `.marquee-left` / `.marquee-right` keyframes for
  //    consistent, GPU-friendly motion that doesn't depend on scroll position.

  // -- Magnetic buttons -----------------------------------------------------
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const strength = 0.3;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      gsap.to(el, { x: x * strength, y: y * strength, duration: 0.4, ease: 'power3.out' });
    };
    const onLeave = () =>
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
  });

  // -- Word-by-word blur-in headlines --------------------------------------
  document.querySelectorAll<HTMLElement>('[data-blur-words]').forEach((host) => {
    const split = new SplitType(host, { types: 'words', tagName: 'span' });
    split.words?.forEach((w) => {
      (w as HTMLElement).style.display = 'inline-block';
      (w as HTMLElement).style.willChange = 'transform, filter, opacity';
    });
    gsap.from(split.words ?? [], {
      yPercent: 60,
      opacity: 0,
      filter: 'blur(10px)',
      duration: 0.95,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: { trigger: host, start: 'top 85%', toggleActions: 'play none none none' },
    });
  });

  // -- Animated counter stats (count-up on scroll into view) ---------------
  // Skipped for elements that use [data-stat-roll] (slot-machine variant below).
  document.querySelectorAll<HTMLElement>('[data-stat-card]').forEach((card, idx) => {
    const numEl = card.querySelector<HTMLElement>('[data-stat-value]');
    if (!numEl) return;
    if (numEl.hasAttribute('data-stat-roll')) {
      // entrance only, no count-up — the digit-roll engine handles the value
      gsap.from(card, {
        y: 32,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 0.8,
        ease: 'power3.out',
        delay: idx * 0.05,
        scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none reverse' },
      });
      return;
    }
    const raw = numEl.dataset.statValue ?? numEl.textContent ?? '';
    const m = raw.match(/^([\d.]+)(.*)$/);
    const target = m ? parseFloat(m[1]) : 0;
    const suffix = m ? m[2] : '';
    const isFloat = m ? m[1].includes('.') : false;
    const obj = { v: 0 };
    numEl.textContent = `0${suffix}`;

    gsap.from(card, {
      y: 32,
      opacity: 0,
      filter: 'blur(10px)',
      duration: 0.8,
      ease: 'power3.out',
      delay: idx * 0.05,
      scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none reverse' },
    });

    gsap.to(obj, {
      v: target,
      duration: 1.6,
      ease: 'power2.out',
      delay: idx * 0.05 + 0.15,
      scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reset' },
      onUpdate: () => {
        const val = isFloat ? obj.v.toFixed(1) : Math.round(obj.v).toString();
        numEl.textContent = `${val}${suffix}`;
      },
    });
  });

  // -- Showcase project cards: 3D mouse tilt + entrance --------------------
  document.querySelectorAll<HTMLElement>('[data-showcase-card]').forEach((card) => {
    gsap.from(card, {
      y: 60,
      opacity: 0,
      filter: 'blur(14px)',
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none reverse' },
    });

    if (window.matchMedia('(pointer: coarse)').matches) return;
    const inner = card.querySelector<HTMLElement>('[data-showcase-inner]') ?? card;
    inner.style.transformStyle = 'preserve-3d';
    inner.style.willChange = 'transform';
    const onMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(inner, {
        rotateX: -py * 6,
        rotateY: px * 8,
        duration: 0.5,
        ease: 'power3.out',
      });
      card.querySelectorAll<HTMLElement>('[data-showcase-float]').forEach((el) => {
        const depth = parseFloat(el.dataset.showcaseFloat ?? '1');
        gsap.to(el, { x: px * 18 * depth, y: py * 18 * depth, duration: 0.6, ease: 'power3.out' });
      });
    };
    const onLeave = () => {
      gsap.to(inner, { rotateX: 0, rotateY: 0, duration: 0.9, ease: 'power3.out' });
      card.querySelectorAll<HTMLElement>('[data-showcase-float]').forEach((el) => {
        gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'power3.out' });
      });
    };
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
  });

  // ── Generic 3D mouse tilt (reusable across stat cards / aside / timeline) ──
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  if (!isCoarse) {
    document.querySelectorAll<HTMLElement>('[data-tilt-3d]').forEach((card) => {
      const strength = parseFloat(card.dataset.tiltStrength ?? '10');
      card.style.transformStyle = 'preserve-3d';
      card.style.willChange = 'transform';
      const parent = card.parentElement;
      if (parent && !parent.style.perspective) parent.style.perspective = '1200px';

      const onMove = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, {
          rotateX: -py * strength,
          rotateY: px * strength,
          z: 6,
          duration: 0.45,
          ease: 'power3.out',
        });
        card.querySelectorAll<HTMLElement>('[data-tilt-layer]').forEach((layer) => {
          const depth = parseFloat(layer.dataset.tiltLayer ?? '20');
          gsap.to(layer, { x: px * depth, y: py * depth, z: depth * 0.6, duration: 0.45, ease: 'power3.out' });
        });
      };
      const onLeave = () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, z: 0, duration: 0.8, ease: 'power3.out' });
        card.querySelectorAll<HTMLElement>('[data-tilt-layer]').forEach((layer) => {
          gsap.to(layer, { x: 0, y: 0, z: 0, duration: 0.8, ease: 'power3.out' });
        });
      };
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    });

    // ── Tech-pill 3D hover: icon lifts forward in z, pill tilts ─────────────
    document.querySelectorAll<HTMLElement>('.tech-pill').forEach((pill) => {
      pill.style.transformStyle = 'preserve-3d';
      pill.style.willChange = 'transform';
      const parent = pill.parentElement;
      if (parent && !parent.style.perspective) parent.style.perspective = '900px';
      const icon = pill.querySelector<HTMLElement>('span[aria-hidden="true"]');
      if (icon) icon.style.transformStyle = 'preserve-3d';

      const onMove = (e: MouseEvent) => {
        const r = pill.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(pill, { rotateX: -py * 14, rotateY: px * 16, duration: 0.35, ease: 'power3.out' });
        if (icon) gsap.to(icon, { z: 28, scale: 1.18, rotateZ: px * 8, duration: 0.35, ease: 'power3.out' });
      };
      const onLeave = () => {
        gsap.to(pill, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'power3.out' });
        if (icon) gsap.to(icon, { z: 0, scale: 1, rotateZ: 0, duration: 0.7, ease: 'power3.out' });
      };
      pill.addEventListener('mousemove', onMove);
      pill.addEventListener('mouseleave', onLeave);
    });
  }

  // ── Mobile (coarse pointer) 3D motion: scroll-driven + gyroscope ──────────
  // On touch devices there's no cursor, so the cursor-based tilts above never
  // fire. We rebuild equivalent depth via (a) scroll-position-driven rotation
  // on cards/pills and (b) optional device-orientation gyroscope on the hero.
  if (isCoarse) {
    // (a) Scroll-driven 3D tilt on every [data-tilt-3d] card.
    document.querySelectorAll<HTMLElement>('[data-tilt-3d]').forEach((card, idx) => {
      const strength = parseFloat(card.dataset.tiltStrength ?? '10');
      card.style.transformStyle = 'preserve-3d';
      card.style.willChange = 'transform';
      const parent = card.parentElement;
      if (parent && !parent.style.perspective) parent.style.perspective = '1200px';

      // Pop-in (rotate3D + translateY) the first time the card enters viewport.
      gsap.from(card, {
        opacity: 0,
        y: 40,
        rotateX: 28,
        rotateY: idx % 2 === 0 ? -14 : 14,
        z: -60,
        duration: 0.95,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none reverse' },
      });

      // Continuous scroll-tied subtle rotation: feels like the card "floats"
      // as you scroll past it. Range is +strength to -strength on rotateX,
      // and ±half on rotateY so it's directional but never disorienting.
      gsap.fromTo(
        card,
        { rotateX: strength * 0.6, rotateY: (idx % 2 === 0 ? -1 : 1) * strength * 0.4 },
        {
          rotateX: -strength * 0.6,
          rotateY: (idx % 2 === 0 ? 1 : -1) * strength * 0.4,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        },
      );

      // Layered parallax for any inner [data-tilt-layer] elements.
      card.querySelectorAll<HTMLElement>('[data-tilt-layer]').forEach((layer) => {
        const depth = parseFloat(layer.dataset.tiltLayer ?? '20');
        gsap.fromTo(
          layer,
          { y: depth * 0.4, z: depth * 0.3 },
          {
            y: -depth * 0.4,
            z: -depth * 0.3,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          },
        );
      });
    });

    // (b) Subtle pop-in for tech pills (no hover on mobile).
    document.querySelectorAll<HTMLElement>('.tech-pill').forEach((pill) => {
      pill.style.transformStyle = 'preserve-3d';
      const parent = pill.parentElement;
      if (parent && !parent.style.perspective) parent.style.perspective = '900px';
    });

    // (c) Personal project showcase: scroll-driven 3D rotation on the inner card.
    document.querySelectorAll<HTMLElement>('[data-showcase-inner]').forEach((inner, idx) => {
      inner.style.transformStyle = 'preserve-3d';
      const parent = inner.parentElement;
      if (parent && !(parent as HTMLElement).style.perspective)
        (parent as HTMLElement).style.perspective = '1600px';
      gsap.fromTo(
        inner,
        { rotateX: 12, rotateY: idx % 2 === 0 ? -6 : 6, y: 30, opacity: 0.85 },
        {
          rotateX: -8,
          rotateY: idx % 2 === 0 ? 4 : -4,
          y: -30,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: inner,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        },
      );
    });

    // (d) Optional device-orientation gyroscope tilt on the hero terminal.
    // Requires the `react-term` container to exist; iOS 13+ needs explicit user
    // permission, which we ask for on first tap.
    const heroSurfaces = document.querySelectorAll<HTMLElement>('.term-frame, [data-hero-gyro]');
    if (heroSurfaces.length && 'DeviceOrientationEvent' in window) {
      heroSurfaces.forEach((el) => {
        el.style.transformStyle = 'preserve-3d';
        const p = el.parentElement as HTMLElement | null;
        if (p && !p.style.perspective) p.style.perspective = '1200px';
      });

      const handler = (e: DeviceOrientationEvent) => {
        // beta = front-back tilt (-180..180), gamma = left-right (-90..90).
        const bx = Math.max(-30, Math.min(30, e.beta ?? 0)) / 30;   // -1..1
        const by = Math.max(-30, Math.min(30, e.gamma ?? 0)) / 30;  // -1..1
        heroSurfaces.forEach((el) => {
          gsap.to(el, {
            rotateX: -bx * 4,
            rotateY: by * 5,
            duration: 0.6,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        });
      };

      const startGyro = () => window.addEventListener('deviceorientation', handler, { passive: true });

      // iOS Safari requires permission via a user gesture.
      type DOE = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<'granted' | 'denied'> };
      const DOEMaybe = DeviceOrientationEvent as unknown as DOE;
      if (typeof DOEMaybe.requestPermission === 'function') {
        const ask = () => {
          DOEMaybe.requestPermission!()
            .then((state) => { if (state === 'granted') startGyro(); })
            .catch(() => {});
          window.removeEventListener('touchend', ask);
        };
        window.addEventListener('touchend', ask, { once: true, passive: true });
      } else {
        startGyro();
      }
    }
  }

  // ── Timeline articles: 3D unfold entrance + ambient drift ──────────────
  document.querySelectorAll<HTMLElement>('[data-timeline-item]').forEach((item, idx) => {
    gsap.from(item, {
      opacity: 0,
      x: -28,
      rotateY: -22,
      rotateX: 6,
      transformPerspective: 900,
      transformOrigin: 'left center',
      filter: 'blur(8px)',
      duration: 1,
      ease: 'power3.out',
      delay: idx * 0.05,
      scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none reverse' },
    });
  });

  // ── Current timeline dot: breathing pulse ──────────────────────────────
  document.querySelectorAll<HTMLElement>('[data-timeline-current-dot]').forEach((dot) => {
    gsap.to(dot, {
      scale: 1.35,
      boxShadow: '0 0 28px rgba(59,130,246,0.9)',
      duration: 1.6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  });

  // ── Stat card numbers: tiny scale punch when counter finishes ──────────
  document.querySelectorAll<HTMLElement>('[data-stat-card]').forEach((card) => {
    const num = card.querySelector<HTMLElement>('[data-stat-value]');
    if (!num) return;
    ScrollTrigger.create({
      trigger: card,
      start: 'top 70%',
      once: true,
      onEnter: () => {
        gsap.fromTo(
          num,
          { scale: 0.92 },
          { scale: 1, duration: 1.8, ease: 'elastic.out(1, 0.5)', delay: 0.35 },
        );
      },
    });
  });

  // ── Text scramble decode (TechStack pills, etc.) ───────────────────────
  // Each [data-scramble] element resolves its target text via a slot-machine
  // cycle through random glyphs, settling per-character left→right.
  const scrambleChars = '!<>-_\\/[]{}=+*^?#abcdef0123456789';
  document.querySelectorAll<HTMLElement>('[data-scramble]').forEach((el, idx) => {
    const target = el.dataset.scramble ?? el.textContent ?? '';
    if (!target) return;
    el.textContent = target.replace(/\S/g, scrambleChars[0]);
    const stagger = (parseInt(el.dataset.scrambleStagger ?? '0', 10) || idx * 35);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        const duration = 0.85;
        const totalFrames = Math.floor(duration * 60);
        const reveal = Array.from(target).map((_, i) =>
          Math.floor((i / Math.max(target.length, 1)) * totalFrames * 0.72),
        );
        let frame = 0;
        const tick = () => {
          if (cancelledByLeave) return;
          let out = '';
          for (let i = 0; i < target.length; i++) {
            const ch = target[i];
            if (ch === ' ') { out += ' '; continue; }
            if (frame >= reveal[i] + 6) out += ch;
            else out += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          }
          el.textContent = out;
          frame++;
          if (frame < totalFrames + 10) requestAnimationFrame(tick);
          else el.textContent = target;
        };
        let cancelledByLeave = false;
        setTimeout(tick, stagger);
      },
    });
  });

  // ── Typewriter reveal (Experience role titles) ─────────────────────────
  document.querySelectorAll<HTMLElement>('[data-typewriter]').forEach((el) => {
    const target = el.textContent ?? '';
    if (!target) return;
    el.textContent = '';
    // append a caret span at render time
    const caret = document.createElement('span');
    caret.className = 'tw-caret';
    caret.setAttribute('aria-hidden', 'true');
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        el.appendChild(caret);
        const total = target.length;
        const speed = 38; // ms per char
        let i = 0;
        const step = () => {
          if (i > total) {
            // fade caret out at the end
            gsap.to(caret, { opacity: 0, duration: 0.4, delay: 0.6, onComplete: () => caret.remove() });
            return;
          }
          el.textContent = target.slice(0, i);
          el.appendChild(caret);
          i++;
          setTimeout(step, speed + Math.random() * 32);
        };
        step();
      },
    });
  });

  // ── Experience bullet sequential reveal with arrow draw ────────────────
  document.querySelectorAll<HTMLElement>('[data-bullet-list]').forEach((list) => {
    const items = list.querySelectorAll<HTMLElement>('[data-bullet-item]');
    if (!items.length) return;
    gsap.set(items, { opacity: 0, x: -16 });
    items.forEach((item) => {
      const arrow = item.querySelector<HTMLElement>('[data-bullet-arrow]');
      if (arrow) gsap.set(arrow, { scaleX: 0, transformOrigin: 'left center' });
    });
    ScrollTrigger.create({
      trigger: list,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();
        items.forEach((item, i) => {
          const arrow = item.querySelector<HTMLElement>('[data-bullet-arrow]');
          tl.to(item, { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out' }, i * 0.12);
          if (arrow) tl.to(arrow, { scaleX: 1, duration: 0.35, ease: 'power2.out' }, i * 0.12 + 0.05);
        });
      },
    });
  });

  // ── Slot-machine digit roll for stat numbers ───────────────────────────
  // Replaces the simple tween: each character position rolls through
  // pseudo-random digits before locking onto its final glyph.
  document.querySelectorAll<HTMLElement>('[data-stat-roll]').forEach((el) => {
    const target = el.dataset.statRoll ?? el.textContent ?? '';
    if (!target) return;
    el.textContent = target.replace(/\d/g, '0');
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        const total = 1100; // ms
        const start = performance.now();
        const lockTimes = Array.from(target).map((ch, i) =>
          /\d/.test(ch) ? 350 + (i / target.length) * (total - 350) : 0,
        );
        const tick = () => {
          const t = performance.now() - start;
          let out = '';
          for (let i = 0; i < target.length; i++) {
            const ch = target[i];
            if (!/\d/.test(ch)) { out += ch; continue; }
            if (t >= lockTimes[i]) out += ch;
            else out += String(Math.floor(Math.random() * 10));
          }
          el.textContent = out;
          if (t < total) requestAnimationFrame(tick);
          else el.textContent = target;
        };
        requestAnimationFrame(tick);
      },
    });
  });

  // ── Contact headline: magnetic letter pull on cursor proximity ─────────
  if (!window.matchMedia('(pointer: coarse)').matches) {
    document.querySelectorAll<HTMLElement>('[data-magnetic-letters]').forEach((host) => {
      const split = new SplitType(host, { types: 'chars' });
      const chars = split.chars ?? [];
      chars.forEach((c) => {
        (c as HTMLElement).style.display = 'inline-block';
        (c as HTMLElement).style.willChange = 'transform';
      });
      const radius = 110;
      const strength = 18;
      const onMove = (e: MouseEvent) => {
        chars.forEach((c) => {
          const r = (c as HTMLElement).getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          const dist = Math.hypot(dx, dy);
          if (dist < radius) {
            const f = (1 - dist / radius) * strength;
            const ang = Math.atan2(dy, dx);
            gsap.to(c, {
              x: Math.cos(ang) * f,
              y: Math.sin(ang) * f,
              duration: 0.5,
              ease: 'power3.out',
              overwrite: 'auto',
            });
          } else {
            gsap.to(c, { x: 0, y: 0, duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
          }
        });
      };
      const onLeave = () => {
        gsap.to(chars, { x: 0, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.01 });
      };
      host.addEventListener('mousemove', onMove);
      host.addEventListener('mouseleave', onLeave);
    });
  }

  // ── Hero floating code glyphs: drift + mouse parallax ──────────────────
  const heroGlyphHost = document.querySelector<HTMLElement>('[data-hero-glyphs]');
  if (heroGlyphHost) {
    const symbols = ['{ }', '[ ]', '→', 'λ', 'Σ', '⌘', '/*', '*/', '$', '0x1F', '<>', '::', '//', '∞', 'π'];
    const isSmall = window.matchMedia('(max-width: 640px)').matches;
    const isMedium = window.matchMedia('(max-width: 1024px)').matches;
    const COUNT = isSmall ? 7 : isMedium ? 11 : 14;
    const MAX_SIZE = isSmall ? 28 : 52;
    const MIN_SIZE = isSmall ? 11 : 14;
    const created: HTMLElement[] = [];
    for (let i = 0; i < COUNT; i++) {
      const el = document.createElement('span');
      el.className = 'hero-glyph';
      el.textContent = symbols[i % symbols.length];
      const size = MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE);
      const depth = 0.3 + Math.random() * 1.4;
      el.style.fontSize = `${size}px`;
      el.style.top = `${6 + Math.random() * 84}%`;
      el.style.left = `${5 + Math.random() * 90}%`;
      el.style.opacity = String((isSmall ? 0.06 : 0.08) + Math.random() * 0.16);
      el.dataset.depth = depth.toString();
      heroGlyphHost.appendChild(el);
      created.push(el);
      gsap.to(el, {
        y: (Math.random() > 0.5 ? -1 : 1) * (30 + Math.random() * 60),
        x: (Math.random() > 0.5 ? -1 : 1) * (20 + Math.random() * 40),
        rotation: (Math.random() - 0.5) * 20,
        duration: 8 + Math.random() * 10,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }
    if (!window.matchMedia('(pointer: coarse)').matches) {
      heroGlyphHost.addEventListener('mousemove', (e: MouseEvent) => {
        const r = heroGlyphHost.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        created.forEach((el) => {
          const d = parseFloat(el.dataset.depth ?? '1');
          gsap.to(el, {
            xPercent: nx * d * 36,
            yPercent: ny * d * 36,
            duration: 1.2,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        });
      });
      heroGlyphHost.addEventListener('mouseleave', () => {
        created.forEach((el) => {
          gsap.to(el, { xPercent: 0, yPercent: 0, duration: 1.4, ease: 'power3.out' });
        });
      });
    }
  }

  // ── TechStack constellation: SVG network lines with traveling pulses ────
  // Desktop/tablet only — vertical mobile stack makes the lines look chaotic.
  const stackHost = document.querySelector<HTMLElement>('[data-constellation]');
  if (stackHost && window.matchMedia('(min-width: 768px)').matches) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'absolute inset-0 w-full h-full pointer-events-none');
    svg.style.zIndex = '0';
    stackHost.style.position = 'relative';
    stackHost.prepend(svg);

    const pulseTimers = new Set<number>();
    const clearPulses = () => {
      pulseTimers.forEach((id) => window.clearTimeout(id));
      pulseTimers.clear();
    };

    const buildLines = () => {
      clearPulses();
      svg.innerHTML = '';
      const hostRect = stackHost.getBoundingClientRect();
      svg.setAttribute('viewBox', `0 0 ${hostRect.width} ${hostRect.height}`);
      svg.setAttribute('width', String(hostRect.width));
      svg.setAttribute('height', String(hostRect.height));
      const pills = Array.from(stackHost.querySelectorAll<HTMLElement>('.tech-pill'));
      const points = pills.map((p) => {
        const r = p.getBoundingClientRect();
        return {
          x: r.left - hostRect.left + r.width / 2,
          y: r.top - hostRect.top + r.height / 2,
        };
      });
      const drawn = new Set<string>();
      points.forEach((a, i) => {
        const dists = points
          .map((b, j) => ({ j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
          .filter((x) => x.j !== i)
          .sort((u, v) => u.d - v.d)
          .slice(0, 2);
        dists.forEach(({ j }) => {
          const key = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (drawn.has(key)) return;
          drawn.add(key);
          const b = points[j];
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', String(a.x));
          line.setAttribute('y1', String(a.y));
          line.setAttribute('x2', String(b.x));
          line.setAttribute('y2', String(b.y));
          line.setAttribute('stroke', 'rgba(96,165,250,0.16)');
          line.setAttribute('stroke-width', '1');
          line.setAttribute('stroke-dasharray', '320');
          line.setAttribute('stroke-dashoffset', '320');
          svg.appendChild(line);
          gsap.to(line, {
            attr: { 'stroke-dashoffset': 0 },
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: { trigger: stackHost, start: 'top 80%', once: true },
            delay: Math.random() * 0.6,
          });

          const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          pulse.setAttribute('r', '2.5');
          pulse.setAttribute('fill', '#60a5fa');
          pulse.setAttribute('opacity', '0');
          svg.appendChild(pulse);
          const animate = () => {
            gsap.fromTo(
              pulse,
              { attr: { cx: a.x, cy: a.y }, opacity: 0 },
              {
                attr: { cx: b.x, cy: b.y },
                opacity: 1,
                duration: 1.4 + Math.random() * 0.8,
                ease: 'power1.inOut',
                onComplete: () => {
                  gsap.to(pulse, { opacity: 0, duration: 0.3 });
                  const id = window.setTimeout(animate, 2000 + Math.random() * 4000);
                  pulseTimers.add(id);
                },
              },
            );
          };
          const initId = window.setTimeout(animate, 2000 + Math.random() * 5000);
          pulseTimers.add(initId);
        });
      });
    };

    ScrollTrigger.create({
      trigger: stackHost,
      start: 'top 90%',
      once: true,
      onEnter: buildLines,
    });
    let resizeTO: number | null = null;
    window.addEventListener('resize', () => {
      if (resizeTO) window.clearTimeout(resizeTO);
      resizeTO = window.setTimeout(buildLines, 220);
    });
  }

  // ── Contact heading: cursor-following spotlight ─────────────────────────
  if (!window.matchMedia('(pointer: coarse)').matches) {
    document.querySelectorAll<HTMLElement>('[data-spotlight-text]').forEach((el) => {
      el.addEventListener('mousemove', (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
      el.addEventListener('mouseleave', () => {
        el.style.setProperty('--mx', '50%');
        el.style.setProperty('--my', '50%');
      });
    });
  }
}

ScrollTrigger.refresh();

// ── Blur-fade-up entrance engine (cinematic stagger reveal) ────────────────
// Elements marked `[data-blur-fade]` animate in via the `.blur-fade-up` class
// when they enter the viewport. Per-element delay comes from inline
// `style="--bf-delay:Nms"`. Respects prefers-reduced-motion.
{
  const targets = document.querySelectorAll<HTMLElement>('[data-blur-fade]');
  if (targets.length) {
    if (reduce) {
      targets.forEach((el) => {
        el.style.opacity = '1';
      });
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            const delay = el.style.getPropertyValue('--bf-delay') || '0ms';
            el.style.animationDelay = delay;
            el.classList.add('blur-fade-up');
            io.unobserve(el);
          });
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
      );
      targets.forEach((el) => io.observe(el));
    }
  }
}

// ── Project pipeline beam state machine ────────────────────────────────────
// Animates a sliding-window linear-gradient along a path connecting three
// neumorphic nodes (left → center → right). State machine: p1 (left → center,
// activate left), splash (radial pulse at center), p2 (center → right,
// activate right), idle, loop. Reduced-motion users get a static "complete"
// beam and no splash.
{
  const pipelines = document.querySelectorAll<HTMLElement>('[data-pp-pipeline]');
  pipelines.forEach((pp) => {
    const uid = pp.getAttribute('data-pp-uid') || '';
    const beamGlow = pp.querySelector<SVGPathElement>('[data-pp-beam-glow]');
    const beamCore = pp.querySelector<SVGPathElement>('[data-pp-beam-core]');
    const grad = pp.querySelector<SVGLinearGradientElement>(`#pp-beam-${uid}`);
    const splash = pp.querySelector<HTMLElement>('[data-pp-splash]');
    const nodeL = pp.querySelector<HTMLElement>('[data-pp-node-left]');
    const nodeR = pp.querySelector<HTMLElement>('[data-pp-node-right]');
    const nodeC = pp.querySelector<HTMLElement>('[data-pp-node-center]');
    if (!beamGlow || !beamCore || !grad || !splash || !nodeL || !nodeR || !nodeC) return;

    let pathLen = 0;
    let startX = 0;
    let endX = 0;
    let beamY = 0;

    function rebuildPath() {
      const ppRect = pp.getBoundingClientRect();
      const lRect = nodeL!.getBoundingClientRect();
      const rRect = nodeR!.getBoundingClientRect();
      const cRect = nodeC!.getBoundingClientRect();
      startX = lRect.right - ppRect.left;
      endX = rRect.left - ppRect.left;
      beamY = (cRect.top + cRect.bottom) / 2 - ppRect.top;
      // straight line, slight curve up via quadratic to feel more organic
      const midX = (startX + endX) / 2;
      const midY = beamY - 6;
      const d = `M ${startX} ${beamY} Q ${midX} ${midY} ${endX} ${beamY}`;
      beamGlow!.setAttribute('d', d);
      beamCore!.setAttribute('d', d);
      pathLen = endX - startX;
    }
    rebuildPath();
    window.addEventListener('resize', rebuildPath);
    // re-measure after fonts/layout settle
    setTimeout(rebuildPath, 250);
    setTimeout(rebuildPath, 800);

    if (reduce) {
      // Static fully-lit beam, no state machine
      grad.setAttribute('x1', String(startX - 20));
      grad.setAttribute('x2', String(endX + 20));
      nodeL.classList.add('active');
      nodeR.classList.add('active');
      return;
    }

    type Phase = 'p1' | 'splash' | 'p2' | 'idle';
    let phase: Phase = 'idle';
    let phaseStart = performance.now();
    const D = { p1: 900, splash: 700, p2: 900, idle: 900 };

    function setBeam(progress: number, alpha = 1) {
      // progress 0..1 along the path; gradient window is ~25% of pathLen wide
      const win = pathLen * 0.45;
      const trailX = startX + progress * pathLen - win * 0.5;
      const leadX = startX + progress * pathLen + win * 0.5;
      grad!.setAttribute('x1', String(trailX));
      grad!.setAttribute('x2', String(leadX));
      beamGlow!.setAttribute('opacity', String(0.6 * alpha));
      beamCore!.setAttribute('opacity', String(alpha));
    }
    function hideBeam() {
      beamGlow!.setAttribute('opacity', '0');
      beamCore!.setAttribute('opacity', '0');
    }

    function tick(now: number) {
      const elapsed = now - phaseStart;
      if (phase === 'p1') {
        const t = Math.min(1, elapsed / D.p1);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        setBeam(eased * 0.55);
        nodeL!.classList.add('active');
        if (t >= 1) {
          // trigger splash, hide beam during splash
          splash!.classList.remove('fire');
          // restart animation by forcing reflow
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          (splash as HTMLElement).offsetWidth;
          splash!.classList.add('fire');
          hideBeam();
          phase = 'splash';
          phaseStart = now;
        }
      } else if (phase === 'splash') {
        if (elapsed >= D.splash) {
          phase = 'p2';
          phaseStart = now;
        }
      } else if (phase === 'p2') {
        const t = Math.min(1, elapsed / D.p2);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        setBeam(0.55 + eased * 0.45);
        nodeR!.classList.add('active');
        if (t >= 1) {
          hideBeam();
          phase = 'idle';
          phaseStart = now;
        }
      } else {
        // idle — clear node highlights toward end of idle
        if (elapsed > D.idle * 0.5) {
          nodeL!.classList.remove('active');
          nodeR!.classList.remove('active');
        }
        if (elapsed >= D.idle) {
          phase = 'p1';
          phaseStart = now;
        }
      }
      rafId = requestAnimationFrame(tick);
    }

    let rafId = 0;
    let running = false;
    const start = () => {
      if (running) return;
      running = true;
      phase = 'p1';
      phaseStart = performance.now();
      rafId = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
      hideBeam();
      nodeL.classList.remove('active');
      nodeR.classList.remove('active');
    };

    // Run only while pipeline is in view
    const vis = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? start() : stop()));
      },
      { threshold: 0.15 }
    );
    vis.observe(pp);
  });
}

export {};
