import { useEffect, useRef, useState } from 'react';

type Line =
  | { kind: 'cmd'; text: string }
  | { kind: 'out'; text: string; cls?: string }
  | { kind: 'pause'; ms: number }
  | { kind: 'clear' };

const PROMPT = 'shashank@portfolio';
const CWD = '~/services';

const SCRIPT: Line[] = [
  { kind: 'cmd', text: 'kubectl get pods -n production' },
  { kind: 'out', text: 'NAME                          READY   STATUS    AGE',  cls: 'dim' },
  { kind: 'out', text: 'api-gateway-7b8c9-x4k2j       1/1     Running   14d',  cls: 'ok-line' },
  { kind: 'out', text: 'fhir-ingest-65fdb8-q9w7m      1/1     Running    7d',  cls: 'ok-line' },
  { kind: 'out', text: 'camel-router-9c4d-z3n1p       1/1     Running   21h',  cls: 'ok-line' },
  { kind: 'out', text: 'redis-cache-3a1f-bbk2n        1/1     Running   42d',  cls: 'ok-line' },
  { kind: 'pause', ms: 2400 },
  { kind: 'cmd', text: "curl -s https://api/fhir/Patient/p-8f29c1" },
  { kind: 'out', text: '{',                                cls: 'json' },
  { kind: 'out', text: '  "resourceType": "Patient",',    cls: 'json-key' },
  { kind: 'out', text: '  "id": "p-8f29c1",',             cls: 'json-key' },
  { kind: 'out', text: '  "status": "active",',           cls: 'json-key' },
  { kind: 'out', text: '  "processed_ms": 47',            cls: 'json-num' },
  { kind: 'out', text: '}',                                cls: 'json' },
  { kind: 'pause', ms: 2400 },
  { kind: 'cmd', text: 'kafka-topics --describe --topic patient-events' },
  { kind: 'out', text: 'Topic: patient-events  Partitions: 12  Replication: 3', cls: '' },
  { kind: 'pause', ms: 1800 },
  { kind: 'cmd', text: './deploy.sh --env prod' },
  { kind: 'out', text: '[INFO]  running 247 tests...',          cls: 'info' },
  { kind: 'pause', ms: 600 },
  { kind: 'out', text: '[INFO]  ✓ all passed in 12.4s',         cls: 'ok' },
  { kind: 'out', text: '[INFO]  building image v2.4.1',         cls: 'info' },
  { kind: 'pause', ms: 500 },
  { kind: 'out', text: '[INFO]  pushing to ECR... done',        cls: 'info' },
  { kind: 'out', text: '[INFO]  rolling out to EKS prod-1...',  cls: 'info' },
  { kind: 'pause', ms: 700 },
  { kind: 'out', text: '[OK]    ✓ deployed in 38s · 0 errors',  cls: 'ok' },
  { kind: 'pause', ms: 3800 },
  { kind: 'clear' },
];

const TYPE_SPEED_MS = 72;       // per character (was 32 — slower, more readable)
const OUTPUT_LINE_DELAY = 240;  // ms between output lines (was 90)
const PRE_CMD_PAUSE_MS = 950;   // pause before starting to type a command
const POST_CMD_PAUSE_MS = 480;  // think-pause after typing, before pressing enter

type RenderedLine = {
  kind: 'cmd' | 'out';
  text: string;
  cls?: string;
  typed: boolean;
};

function colorize(text: string, cls?: string) {
  // simple syntax tinting based on line class
  if (cls === 'json-key' || cls === 'json-num') {
    // highlight quoted strings and numbers
    return text
      .replace(/"([^"]+)":/g, '<span class="t-key">"$1"</span>:')
      .replace(/: "([^"]+)"/g, ': <span class="t-str">"$1"</span>')
      .replace(/: (\d+)/g, ': <span class="t-num">$1</span>');
  }
  if (cls === 'info') {
    return text.replace(/^(\[INFO\])/, '<span class="t-info">$1</span>');
  }
  if (cls === 'ok' || cls === 'ok-line') {
    return text
      .replace(/^(\[OK\])/, '<span class="t-ok">$1</span>')
      .replace(/✓/g, '<span class="t-ok">✓</span>')
      .replace(/\bRunning\b/g, '<span class="t-ok">Running</span>');
  }
  return text;
}

export default function HeroTerminal() {
  const [lines, setLines] = useState<RenderedLine[]>([]);
  const [typing, setTyping] = useState<string>('');
  const bodyRef = useRef<HTMLDivElement>(null);
  const cancelledRef = useRef(false);

  // autoscroll to bottom on changes
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, typing]);

  useEffect(() => {
    cancelledRef.current = false;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let i = 0;
    let stopped = false;

    const sleep = (ms: number) =>
      new Promise<void>((r) => {
        const t = window.setTimeout(r, ms);
        if (stopped) clearTimeout(t);
      });

    async function typeCmd(text: string) {
      let buf = '';
      for (let idx = 0; idx < text.length; idx++) {
        const ch = text[idx];
        if (cancelledRef.current) return;
        buf += ch;
        setTyping(buf);
        // small extra dwell after spaces or punctuation to feel human
        const extra = /[ /\-_]/.test(ch) ? 60 : 0;
        await sleep(reduce ? 0 : TYPE_SPEED_MS + Math.random() * 38 + extra);
      }
      // brief pause before "pressing enter"
      await sleep(reduce ? 0 : POST_CMD_PAUSE_MS);
      setTyping('');
      setLines((prev) => [...prev, { kind: 'cmd', text, typed: true }]);
    }

    async function emit(line: RenderedLine) {
      setLines((prev) => [...prev, line]);
      await sleep(reduce ? 0 : OUTPUT_LINE_DELAY);
    }

    async function loop() {
      while (!cancelledRef.current) {
        const step = SCRIPT[i % SCRIPT.length];
        if (step.kind === 'cmd') {
          await sleep(reduce ? 0 : PRE_CMD_PAUSE_MS);
          await typeCmd(step.text);
        } else if (step.kind === 'out') {
          await emit({ kind: 'out', text: step.text, cls: step.cls, typed: true });
        } else if (step.kind === 'pause') {
          await sleep(reduce ? 0 : step.ms);
        } else if (step.kind === 'clear') {
          await sleep(reduce ? 0 : 200);
          setLines([]);
          setTyping('');
        }
        i++;
        if (reduce && i >= SCRIPT.length) break; // single pass for reduced motion
      }
    }

    loop();

    return () => {
      cancelledRef.current = true;
      stopped = true;
    };
  }, []);

  return (
    <div className="hero-terminal relative w-full h-full grid place-items-center">
      <style>{`
        .term-frame {
          width: min(100%, 580px);
          background: linear-gradient(180deg, #15151c 0%, #0f0f15 100%);
          border-radius: 16px;
          border: 1px solid #26262f;
          box-shadow:
            0 30px 80px -30px rgba(0,0,0,0.7),
            0 0 0 1px rgba(59,130,246,0.08),
            0 0 60px -10px rgba(59,130,246,0.18);
          overflow: hidden;
          transform: rotateX(2deg) rotateY(-3deg);
          transform-style: preserve-3d;
        }
        .term-bar {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 14px;
          background: linear-gradient(180deg, #1c1c26 0%, #15151c 100%);
          border-bottom: 1px solid #26262f;
        }
        .term-dot { width: 12px; height: 12px; border-radius: 50%; }
        .term-dot--r { background: #ff5f56; }
        .term-dot--y { background: #ffbd2e; }
        .term-dot--g { background: #27c93f; }
        .term-title {
          flex: 1; text-align: center;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 11px; color: #94a3b8; letter-spacing: 0.04em;
        }
        .term-body {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: clamp(10.5px, 1.05vw, 13.5px);
          line-height: 1.6;
          padding: 14px 14px 18px;
          height: clamp(260px, 40vh, 480px);
          overflow: hidden;
          color: #d4d4dc;
          background:
            radial-gradient(ellipse at top right, rgba(59,130,246,0.08), transparent 60%),
            #0c0c12;
        }
        .term-body > div { white-space: pre; }
        .t-prompt { color: #34d399; }
        .t-host { color: #cbd5e1; }
        .t-cwd { color: #60a5fa; }
        .t-sym  { color: #94a3b8; }
        .t-cmd { color: #f8f8f2; }
        .t-key  { color: #93c5fd; }
        .t-str  { color: #fbbf24; }
        .t-num  { color: #7dd3fc; }
        .t-info { color: #60a5fa; }
        .t-ok   { color: #34d399; font-weight: 600; }
        .t-dim  { color: #94a3b8; }
        .t-json { color: #d4d4dc; }
        .caret {
          display: inline-block;
          width: 7px;
          height: 1.05em;
          background: #34d399;
          vertical-align: -2px;
          margin-left: 2px;
          animation: caret-blink 1.05s steps(1) infinite;
        }
        @keyframes caret-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .term-aura {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse at 70% 40%, rgba(59,130,246,0.18), transparent 60%);
          z-index: -1;
        }
        @media (prefers-reduced-motion: reduce) {
          .caret { animation: none; opacity: 1; }
          .term-frame { transform: none; }
        }
      `}</style>

      <div className="term-aura" aria-hidden="true" />
      <div className="term-frame" role="img" aria-label="Animated developer terminal showing live backend commands">
        <div className="term-bar">
          <span className="term-dot term-dot--r" />
          <span className="term-dot term-dot--y" />
          <span className="term-dot term-dot--g" />
          <span className="term-title">zsh — {PROMPT} — 124×38</span>
        </div>

        <div className="term-body" ref={bodyRef}>
          {lines.map((l, idx) => {
            if (l.kind === 'cmd') {
              return (
                <div key={idx}>
                  <span className="t-prompt">{PROMPT}</span>
                  <span className="t-sym">:</span>
                  <span className="t-cwd">{CWD}</span>
                  <span className="t-sym">$ </span>
                  <span
                    className="t-cmd"
                    dangerouslySetInnerHTML={{ __html: l.text }}
                  />
                </div>
              );
            }
            return (
              <div
                key={idx}
                className={`t-${l.cls || 'json'}`}
                dangerouslySetInnerHTML={{ __html: colorize(l.text, l.cls) }}
              />
            );
          })}

          {/* active typing line */}
          <div>
            <span className="t-prompt">{PROMPT}</span>
            <span className="t-sym">:</span>
            <span className="t-cwd">{CWD}</span>
            <span className="t-sym">$ </span>
            <span className="t-cmd">{typing}</span>
            <span className="caret" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}
