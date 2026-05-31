/**
 * RobotBackground — renders a page-specific robot SVG as a fixed,
 * semi-transparent background decoration.
 *
 * variant: 'smile' | 'salute' | 'heart'
 */
export default function RobotBackground({ variant = 'smile' }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        width: '52%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {variant === 'smile' && <RobotSmile />}
      {variant === 'salute' && <RobotSalute />}
      {variant === 'heart' && <RobotHeart />}
    </div>
  );
}

/* ─── shared palette ────────────────────────────────────────────── */
const C = {
  body:     '#0D1F3C',
  bodyEdge: '#1A3A5C',
  metal:    '#1E3A5F',
  shine:    '#2E5A8A',
  teal:     '#00E5CC',
  tealDim:  '#007A6E',
  glow:     'rgba(0,229,204,0.18)',
  eye:      '#00E5CC',
  eyeGlow:  'rgba(0,229,204,0.6)',
  joint:    '#0A1628',
  screw:    '#2A4A6A',
};

/* ─── SMILE robot (Dashboard) ───────────────────────────────────── */
function RobotSmile() {
  return (
    <svg
      viewBox="0 0 520 700"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', opacity: 0.22 }}
      preserveAspectRatio="xMaxYMid meet"
    >
      <defs>
        <radialGradient id="bodyGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={C.shine} />
          <stop offset="100%" stopColor={C.body} />
        </radialGradient>
        <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.teal} stopOpacity="1" />
          <stop offset="100%" stopColor={C.teal} stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Antenna ── */}
      <rect x="248" y="30" width="8" height="60" rx="4" fill={C.metal} />
      <circle cx="252" cy="26" r="14" fill={C.teal} filter="url(#glow)" />
      <circle cx="252" cy="26" r="7" fill="white" />

      {/* ── Head ── */}
      <rect x="142" y="90" width="220" height="160" rx="28" fill="url(#bodyGrad)" stroke={C.bodyEdge} strokeWidth="3" />

      {/* visor strip */}
      <rect x="160" y="118" width="184" height="56" rx="14" fill={C.joint} stroke={C.shine} strokeWidth="1.5" />

      {/* eyes */}
      <circle cx="222" cy="147" r="22" fill={C.joint} />
      <circle cx="222" cy="147" r="14" fill={C.eye} filter="url(#glow)" />
      <circle cx="222" cy="147" r="7" fill="white" />
      <circle cx="227" cy="142" r="3" fill="white" opacity="0.8" />

      <circle cx="282" cy="147" r="22" fill={C.joint} />
      <circle cx="282" cy="147" r="14" fill={C.eye} filter="url(#glow)" />
      <circle cx="282" cy="147" r="7" fill="white" />
      <circle cx="287" cy="142" r="3" fill="white" opacity="0.8" />

      {/* BIG SMILE */}
      <path d="M 200 192 Q 252 228 304 192" stroke={C.teal} strokeWidth="5" fill="none"
            strokeLinecap="round" filter="url(#glow)" />
      {/* smile teeth */}
      <path d="M 213 200 Q 252 230 291 200" stroke="none" fill={C.tealDim} opacity="0.5" />

      {/* ear bolts */}
      <circle cx="142" cy="150" r="12" fill={C.metal} stroke={C.shine} strokeWidth="2" />
      <circle cx="142" cy="150" r="5" fill={C.teal} />
      <circle cx="362" cy="150" r="12" fill={C.metal} stroke={C.shine} strokeWidth="2" />
      <circle cx="362" cy="150" r="5" fill={C.teal} />

      {/* ── Neck ── */}
      <rect x="230" y="250" width="44" height="30" rx="6" fill={C.metal} stroke={C.bodyEdge} strokeWidth="2" />

      {/* ── Torso ── */}
      <rect x="110" y="280" width="284" height="220" rx="22" fill="url(#bodyGrad)" stroke={C.bodyEdge} strokeWidth="3" />

      {/* chest panel */}
      <rect x="168" y="310" width="168" height="100" rx="12" fill={C.joint} stroke={C.shine} strokeWidth="1.5" />
      {/* power core */}
      <circle cx="252" cy="345" r="28" fill={C.joint} stroke={C.teal} strokeWidth="2" filter="url(#glow)" />
      <circle cx="252" cy="345" r="18" fill={C.teal} opacity="0.3" />
      <circle cx="252" cy="345" r="10" fill={C.teal} filter="url(#glow)" />
      {/* indicator lights */}
      <circle cx="200" cy="390" r="7" fill={C.teal} filter="url(#glow)" />
      <circle cx="222" cy="390" r="7" fill="#FFA500" />
      <circle cx="244" cy="390" r="7" fill="#FF4D4D" />

      {/* shoulder bolts */}
      <circle cx="110" cy="295" r="10" fill={C.metal} stroke={C.shine} strokeWidth="2" />
      <circle cx="394" cy="295" r="10" fill={C.metal} stroke={C.shine} strokeWidth="2" />

      {/* ── LEFT ARM (relaxed down) ── */}
      <rect x="44" y="285" width="60" height="180" rx="20" fill="url(#bodyGrad)" stroke={C.bodyEdge} strokeWidth="2.5" />
      {/* elbow joint */}
      <ellipse cx="74" cy="400" rx="24" ry="16" fill={C.metal} stroke={C.shine} strokeWidth="2" />
      {/* hand */}
      <ellipse cx="74" cy="464" rx="26" ry="20" fill={C.metal} stroke={C.bodyEdge} strokeWidth="2" />
      <rect x="54" y="468" width="14" height="28" rx="6" fill={C.shine} />
      <rect x="71" y="470" width="14" height="30" rx="6" fill={C.shine} />
      <rect x="88" y="468" width="12" height="26" rx="6" fill={C.shine} />

      {/* ── RIGHT ARM (relaxed down) ── */}
      <rect x="400" y="285" width="60" height="180" rx="20" fill="url(#bodyGrad)" stroke={C.bodyEdge} strokeWidth="2.5" />
      <ellipse cx="430" cy="400" rx="24" ry="16" fill={C.metal} stroke={C.shine} strokeWidth="2" />
      <ellipse cx="430" cy="464" rx="26" ry="20" fill={C.metal} stroke={C.bodyEdge} strokeWidth="2" />
      <rect x="412" y="468" width="14" height="28" rx="6" fill={C.shine} />
      <rect x="429" y="470" width="14" height="30" rx="6" fill={C.shine} />
      <rect x="445" y="468" width="12" height="26" rx="6" fill={C.shine} />

      {/* ── Waist ── */}
      <rect x="150" y="500" width="204" height="30" rx="8" fill={C.metal} stroke={C.bodyEdge} strokeWidth="2" />

      {/* ── Legs ── */}
      <rect x="160" y="530" width="76" height="140" rx="18" fill="url(#bodyGrad)" stroke={C.bodyEdge} strokeWidth="2.5" />
      <rect x="268" y="530" width="76" height="140" rx="18" fill="url(#bodyGrad)" stroke={C.bodyEdge} strokeWidth="2.5" />
      {/* knee joints */}
      <ellipse cx="198" cy="622" rx="28" ry="18" fill={C.metal} stroke={C.shine} strokeWidth="2" />
      <ellipse cx="306" cy="622" rx="28" ry="18" fill={C.metal} stroke={C.shine} strokeWidth="2" />
      {/* feet */}
      <rect x="144" y="660" width="104" height="30" rx="12" fill={C.metal} stroke={C.bodyEdge} strokeWidth="2" />
      <rect x="252" y="660" width="104" height="30" rx="12" fill={C.metal} stroke={C.bodyEdge} strokeWidth="2" />

      {/* floor glow */}
      <ellipse cx="252" cy="694" rx="120" ry="10" fill={C.teal} opacity="0.12" />
    </svg>
  );
}

/* ─── SALUTE robot (Trackers page) ─────────────────────────────── */
function RobotSalute() {
  return (
    <svg
      viewBox="0 0 520 700"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', opacity: 0.22 }}
      preserveAspectRatio="xMaxYMid meet"
    >
      <defs>
        <radialGradient id="bodyGrad2" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={C.shine} />
          <stop offset="100%" stopColor={C.body} />
        </radialGradient>
        <filter id="glow2">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Antenna ── */}
      <rect x="248" y="30" width="8" height="60" rx="4" fill={C.metal} />
      <circle cx="252" cy="26" r="14" fill={C.teal} filter="url(#glow2)" />
      <circle cx="252" cy="26" r="7" fill="white" />

      {/* ── Head ── */}
      <rect x="142" y="90" width="220" height="160" rx="28" fill="url(#bodyGrad2)" stroke={C.bodyEdge} strokeWidth="3" />
      <rect x="160" y="118" width="184" height="56" rx="14" fill={C.joint} stroke={C.shine} strokeWidth="1.5" />

      {/* eyes — serious/alert look */}
      <circle cx="222" cy="147" r="22" fill={C.joint} />
      <circle cx="222" cy="147" r="14" fill={C.eye} filter="url(#glow2)" />
      <circle cx="222" cy="147" r="7" fill="white" />
      <circle cx="226" cy="143" r="3" fill="white" opacity="0.8" />

      <circle cx="282" cy="147" r="22" fill={C.joint} />
      <circle cx="282" cy="147" r="14" fill={C.eye} filter="url(#glow2)" />
      <circle cx="282" cy="147" r="7" fill="white" />
      <circle cx="286" cy="143" r="3" fill="white" opacity="0.8" />

      {/* eyebrows — stern/determined */}
      <rect x="204" y="122" width="30" height="6" rx="3" fill={C.teal} transform="rotate(-8, 219, 125)" />
      <rect x="270" y="122" width="30" height="6" rx="3" fill={C.teal} transform="rotate(8, 285, 125)" />

      {/* neutral firm mouth */}
      <rect x="214" y="196" width="76" height="7" rx="3.5" fill={C.teal} filter="url(#glow2)" />

      {/* ear bolts */}
      <circle cx="142" cy="150" r="12" fill={C.metal} stroke={C.shine} strokeWidth="2" />
      <circle cx="142" cy="150" r="5" fill={C.teal} />
      <circle cx="362" cy="150" r="12" fill={C.metal} stroke={C.shine} strokeWidth="2" />
      <circle cx="362" cy="150" r="5" fill={C.teal} />

      {/* ── Neck ── */}
      <rect x="230" y="250" width="44" height="30" rx="6" fill={C.metal} stroke={C.bodyEdge} strokeWidth="2" />

      {/* ── Torso ── */}
      <rect x="110" y="280" width="284" height="220" rx="22" fill="url(#bodyGrad2)" stroke={C.bodyEdge} strokeWidth="3" />
      <rect x="168" y="310" width="168" height="100" rx="12" fill={C.joint} stroke={C.shine} strokeWidth="1.5" />
      <circle cx="252" cy="345" r="28" fill={C.joint} stroke={C.teal} strokeWidth="2" filter="url(#glow2)" />
      <circle cx="252" cy="345" r="18" fill={C.teal} opacity="0.3" />
      <circle cx="252" cy="345" r="10" fill={C.teal} filter="url(#glow2)" />
      <circle cx="200" cy="390" r="7" fill={C.teal} filter="url(#glow2)" />
      <circle cx="222" cy="390" r="7" fill="#FFA500" />
      <circle cx="244" cy="390" r="7" fill="#FF4D4D" />

      <circle cx="110" cy="295" r="10" fill={C.metal} stroke={C.shine} strokeWidth="2" />
      <circle cx="394" cy="295" r="10" fill={C.metal} stroke={C.shine} strokeWidth="2" />

      {/* ── LEFT ARM (down, relaxed) ── */}
      <rect x="44" y="285" width="60" height="180" rx="20" fill="url(#bodyGrad2)" stroke={C.bodyEdge} strokeWidth="2.5" />
      <ellipse cx="74" cy="400" rx="24" ry="16" fill={C.metal} stroke={C.shine} strokeWidth="2" />
      <ellipse cx="74" cy="464" rx="26" ry="20" fill={C.metal} stroke={C.bodyEdge} strokeWidth="2" />
      <rect x="54" y="468" width="14" height="28" rx="6" fill={C.shine} />
      <rect x="71" y="470" width="14" height="30" rx="6" fill={C.shine} />
      <rect x="88" y="468" width="12" height="26" rx="6" fill={C.shine} />

      {/* ── RIGHT ARM — SALUTE (raised to forehead) ── */}
      {/* upper arm going up-right */}
      <rect x="390" y="200" width="56" height="110" rx="20"
            fill="url(#bodyGrad2)" stroke={C.bodyEdge} strokeWidth="2.5"
            transform="rotate(-55, 418, 255)" />
      {/* elbow joint */}
      <circle cx="446" cy="220" r="18" fill={C.metal} stroke={C.shine} strokeWidth="2" />
      {/* forearm going horizontally to forehead */}
      <rect x="420" y="138" width="110" height="48" rx="20"
            fill="url(#bodyGrad2)" stroke={C.bodyEdge} strokeWidth="2.5" />
      {/* saluting hand at forehead */}
      <ellipse cx="426" cy="162" rx="26" ry="20" fill={C.metal} stroke={C.bodyEdge} strokeWidth="2" />
      {/* fingers flat for salute */}
      <rect x="406" y="147" width="14" height="28" rx="5" fill={C.shine} />
      <rect x="423" y="144" width="14" height="32" rx="5" fill={C.shine} />
      <rect x="440" y="146" width="14" height="30" rx="5" fill={C.shine} />

      {/* ── Waist ── */}
      <rect x="150" y="500" width="204" height="30" rx="8" fill={C.metal} stroke={C.bodyEdge} strokeWidth="2" />

      {/* ── Legs ── */}
      <rect x="160" y="530" width="76" height="140" rx="18" fill="url(#bodyGrad2)" stroke={C.bodyEdge} strokeWidth="2.5" />
      <rect x="268" y="530" width="76" height="140" rx="18" fill="url(#bodyGrad2)" stroke={C.bodyEdge} strokeWidth="2.5" />
      <ellipse cx="198" cy="622" rx="28" ry="18" fill={C.metal} stroke={C.shine} strokeWidth="2" />
      <ellipse cx="306" cy="622" rx="28" ry="18" fill={C.metal} stroke={C.shine} strokeWidth="2" />
      <rect x="144" y="660" width="104" height="30" rx="12" fill={C.metal} stroke={C.bodyEdge} strokeWidth="2" />
      <rect x="252" y="660" width="104" height="30" rx="12" fill={C.metal} stroke={C.bodyEdge} strokeWidth="2" />

      {/* floor glow */}
      <ellipse cx="252" cy="694" rx="120" ry="10" fill={C.teal} opacity="0.12" />
    </svg>
  );
}

/* ─── HEART robot (Payment page) ───────────────────────────────── */
function RobotHeart() {
  return (
    <svg
      viewBox="0 0 520 700"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', opacity: 0.22 }}
      preserveAspectRatio="xMaxYMid meet"
    >
      <defs>
        <radialGradient id="bodyGrad3" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={C.shine} />
          <stop offset="100%" stopColor={C.body} />
        </radialGradient>
        <filter id="glow3">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Antenna ── */}
      <rect x="248" y="30" width="8" height="60" rx="4" fill={C.metal} />
      {/* heart on antenna tip */}
      <path d="M252 10 C252 10 238 0 238 10 C238 18 252 26 252 26 C252 26 266 18 266 10 C266 0 252 10 252 10Z"
            fill={C.teal} filter="url(#glow3)" />

      {/* ── Head ── */}
      <rect x="142" y="90" width="220" height="160" rx="28" fill="url(#bodyGrad3)" stroke={C.bodyEdge} strokeWidth="3" />
      <rect x="160" y="118" width="184" height="56" rx="14" fill={C.joint} stroke={C.shine} strokeWidth="1.5" />

      {/* eyes — soft/happy half-moon */}
      <circle cx="222" cy="147" r="22" fill={C.joint} />
      <circle cx="222" cy="147" r="14" fill={C.eye} filter="url(#glow3)" />
      <circle cx="222" cy="147" r="7" fill="white" />
      <circle cx="227" cy="142" r="3" fill="white" opacity="0.8" />
      {/* happy squint */}
      <path d="M204 136 Q222 128 240 136" stroke={C.teal} strokeWidth="4" fill="none" strokeLinecap="round" filter="url(#glow3)" />

      <circle cx="282" cy="147" r="22" fill={C.joint} />
      <circle cx="282" cy="147" r="14" fill={C.eye} filter="url(#glow3)" />
      <circle cx="282" cy="147" r="7" fill="white" />
      <circle cx="287" cy="142" r="3" fill="white" opacity="0.8" />
      <path d="M264 136 Q282 128 300 136" stroke={C.teal} strokeWidth="4" fill="none" strokeLinecap="round" filter="url(#glow3)" />

      {/* big smile with rosy cheeks */}
      <path d="M 198 194 Q 252 234 306 194" stroke={C.teal} strokeWidth="5" fill="none" strokeLinecap="round" filter="url(#glow3)" />
      <circle cx="190" cy="188" r="14" fill="#FF6B8A" opacity="0.4" />
      <circle cx="314" cy="188" r="14" fill="#FF6B8A" opacity="0.4" />

      {/* ear bolts */}
      <circle cx="142" cy="150" r="12" fill={C.metal} stroke={C.shine} strokeWidth="2" />
      <circle cx="142" cy="150" r="5" fill={C.teal} />
      <circle cx="362" cy="150" r="12" fill={C.metal} stroke={C.shine} strokeWidth="2" />
      <circle cx="362" cy="150" r="5" fill={C.teal} />

      {/* ── Neck ── */}
      <rect x="230" y="250" width="44" height="30" rx="6" fill={C.metal} stroke={C.bodyEdge} strokeWidth="2" />

      {/* ── Torso ── */}
      <rect x="110" y="280" width="284" height="220" rx="22" fill="url(#bodyGrad3)" stroke={C.bodyEdge} strokeWidth="3" />
      <rect x="168" y="310" width="168" height="100" rx="12" fill={C.joint} stroke={C.shine} strokeWidth="1.5" />
      {/* chest heart instead of circle */}
      <path d="M252 370 C252 370 222 348 222 330 C222 318 252 314 252 330 C252 314 282 318 282 330 C282 348 252 370 252 370Z"
            fill={C.teal} opacity="0.7" filter="url(#glow3)" />
      <circle cx="200" cy="390" r="7" fill="#FF6B8A" filter="url(#glow3)" />
      <circle cx="222" cy="390" r="7" fill={C.teal} />
      <circle cx="244" cy="390" r="7" fill="#FF6B8A" />

      <circle cx="110" cy="295" r="10" fill={C.metal} stroke={C.shine} strokeWidth="2" />
      <circle cx="394" cy="295" r="10" fill={C.metal} stroke={C.shine} strokeWidth="2" />

      {/* ── LEFT ARM — raised, forming left half of heart ── */}
      <rect x="40" y="230" width="58" height="130" rx="20"
            fill="url(#bodyGrad3)" stroke={C.bodyEdge} strokeWidth="2.5"
            transform="rotate(38, 69, 295)" />
      <circle cx="82" cy="310" r="18" fill={C.metal} stroke={C.shine} strokeWidth="2" />
      {/* forearm curling inward */}
      <rect x="90" y="240" width="54" height="100" rx="20"
            fill="url(#bodyGrad3)" stroke={C.bodyEdge} strokeWidth="2.5"
            transform="rotate(70, 117, 290)" />
      {/* left hand fingers curled */}
      <ellipse cx="142" cy="266" rx="22" ry="18" fill={C.metal} stroke={C.bodyEdge} strokeWidth="2" />
      <rect x="132" y="250" width="12" height="24" rx="6" fill={C.shine} />
      <rect x="147" y="248" width="12" height="26" rx="6" fill={C.shine} />

      {/* ── RIGHT ARM — raised, forming right half of heart ── */}
      <rect x="424" y="230" width="58" height="130" rx="20"
            fill="url(#bodyGrad3)" stroke={C.bodyEdge} strokeWidth="2.5"
            transform="rotate(-38, 453, 295)" />
      <circle cx="440" cy="310" r="18" fill={C.metal} stroke={C.shine} strokeWidth="2" />
      <rect x="356" y="240" width="54" height="100" rx="20"
            fill="url(#bodyGrad3)" stroke={C.bodyEdge} strokeWidth="2.5"
            transform="rotate(-70, 383, 290)" />
      <ellipse cx="378" cy="266" rx="22" ry="18" fill={C.metal} stroke={C.bodyEdge} strokeWidth="2" />
      <rect x="364" y="250" width="12" height="24" rx="6" fill={C.shine} />
      <rect x="379" y="248" width="12" height="26" rx="6" fill={C.shine} />

      {/* glowing heart between the hands */}
      <path d="M252 268 C252 268 214 244 214 222 C214 206 252 200 252 222 C252 200 290 206 290 222 C290 244 252 268 252 268Z"
            fill={C.teal} opacity="0.35" filter="url(#glow3)" />

      {/* ── Waist ── */}
      <rect x="150" y="500" width="204" height="30" rx="8" fill={C.metal} stroke={C.bodyEdge} strokeWidth="2" />

      {/* ── Legs ── */}
      <rect x="160" y="530" width="76" height="140" rx="18" fill="url(#bodyGrad3)" stroke={C.bodyEdge} strokeWidth="2.5" />
      <rect x="268" y="530" width="76" height="140" rx="18" fill="url(#bodyGrad3)" stroke={C.bodyEdge} strokeWidth="2.5" />
      <ellipse cx="198" cy="622" rx="28" ry="18" fill={C.metal} stroke={C.shine} strokeWidth="2" />
      <ellipse cx="306" cy="622" rx="28" ry="18" fill={C.metal} stroke={C.shine} strokeWidth="2" />
      <rect x="144" y="660" width="104" height="30" rx="12" fill={C.metal} stroke={C.bodyEdge} strokeWidth="2" />
      <rect x="252" y="660" width="104" height="30" rx="12" fill={C.metal} stroke={C.bodyEdge} strokeWidth="2" />

      {/* floor glow */}
      <ellipse cx="252" cy="694" rx="120" ry="10" fill={C.teal} opacity="0.12" />
    </svg>
  );
}
