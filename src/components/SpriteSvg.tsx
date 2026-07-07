import type { ReactElement } from "react";

interface SpriteArtProps {
  spriteId: string;
  size?: number;
  className?: string;
}

const BODY =
  "M50 8 C68 8 80 20 81 40 L82 86 C83 103 69 113 50 113 C31 113 17 103 18 86 L19 40 C20 20 32 8 50 8 Z";

const GHOST_BODY =
  "M50 10 C67 10 79 22 80 42 L81 98 L72 91 L64 101 L56 93 L50 101 L44 93 L36 101 L28 91 L19 98 L20 42 C21 22 33 10 50 10 Z";

const CRYSTAL_BODY =
  "M50 4 L70 14 L79 40 L74 72 L84 90 L60 112 L32 108 L18 92 L26 72 L20 42 L32 12 Z";


const HOODED_BODY =
  "M50 4 C30 4 18 16 18 36 L16 56 C12 62 10 68 14 76 L18 86 C18 106 32 114 50 114 C68 114 82 106 82 86 L86 76 C90 68 88 62 84 56 L82 36 C82 16 70 4 50 4 Z";

function Defs({ uid, top, bottom }: { uid: string; top: string; bottom: string }) {
  return (
    <defs>
      <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={top} />
        <stop offset="100%" stopColor={bottom} />
      </linearGradient>
      <filter id={`${uid}-glow`} x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="2.2" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <clipPath id={`${uid}-clip`}>
        <path d={BODY} />
      </clipPath>
    </defs>
  );
}

function BodyShading({ uid, bodyPath }: { uid: string; bodyPath?: string }) {
  const clip = bodyPath ? undefined : `url(#${uid}-clip)`;
  return (
    <g clipPath={clip}>
      {bodyPath && (
        <defs>
          <clipPath id={`${uid}-bodyClip`}>
            <path d={bodyPath} />
          </clipPath>
        </defs>
      )}
      <g clipPath={bodyPath ? `url(#${uid}-bodyClip)` : undefined}>
        {/* specular highlight */}
        <ellipse cx="40" cy="22" rx="20" ry="11" fill="#ffffff" opacity="0.22" />
        {/* rim highlight */}
        <ellipse cx="44" cy="18" rx="12" ry="6" fill="#ffffff" opacity="0.12" />
        {/* left edge shadow */}
        <path d="M18 30 Q14 60 18 100 L24 100 Q20 60 24 30 Z" fill="#000000" opacity="0.18" />
        {/* right edge shadow */}
        <path d="M82 30 Q86 60 82 100 L76 100 Q80 60 76 30 Z" fill="#000000" opacity="0.12" />
        {/* bottom shadow */}
        <ellipse cx="50" cy="108" rx="26" ry="10" fill="#000000" opacity="0.22" />
        {/* subtle reflected light */}
        <ellipse cx="56" cy="95" rx="14" ry="7" fill="#ffffff" opacity="0.06" />
      </g>
    </g>
  );
}

function water(uid: string): ReactElement {
  return (
    <>
      <Defs uid={uid} top="#a9f2ff" bottom="#17a9d6" />
      <path d={BODY} fill={`url(#${uid}-body)`} />
      <BodyShading uid={uid} />
      <circle cx="31" cy="7" r="4" fill="#d6faff" opacity="0.85" />
      <circle cx="39" cy="2" r="2.6" fill="#d6faff" opacity="0.7" />
      <circle cx="25" cy="13" r="2" fill="#d6faff" opacity="0.6" />
      <ellipse cx="50" cy="82" rx="20" ry="17" fill="#d9fbff" opacity="0.35" />
      <path
        d="M50 72 C54 78 56 81 56 84 A6 6 0 1 1 44 84 C44 81 46 78 50 72 Z"
        fill="#eafdff"
        opacity="0.9"
      />
      <ellipse cx="36" cy="40" rx="5.5" ry="6.5" fill="#123043" />
      <ellipse cx="64" cy="40" rx="5.5" ry="6.5" fill="#123043" />
      <circle cx="34" cy="37.5" r="2" fill="#ffffff" />
      <circle cx="62" cy="37.5" r="2" fill="#ffffff" />
      <path d="M45 51 Q50 57 55 51 Q50 54.5 45 51 Z" fill="#123043" />
    </>
  );
}

function air(uid: string): ReactElement {
  return (
    <>
      <Defs uid={uid} top="#ffffff" bottom="#bfd2ec" />
      <path d={BODY} fill={`url(#${uid}-body)`} opacity="0.96" />
      <BodyShading uid={uid} />
      <path d="M12 22 Q20 18 26 22" stroke="#e4eefb" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M74 16 Q82 12 88 16" stroke="#e4eefb" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M30 41 Q36 34 42 41" stroke="#2c3c54" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M58 41 Q64 34 70 41" stroke="#2c3c54" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M44 51 Q50 56 56 51" stroke="#2c3c54" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path
        d="M50 76 A8 8 0 1 1 42 84 A5.5 5.5 0 1 0 47.5 78.5"
        stroke="#9db6d8"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
    </>
  );
}

function cloud(uid: string): ReactElement {
  return (
    <>
      <Defs uid={uid} top="#e8eef8" bottom="#a0b4cc" />
      <path d={BODY} fill={`url(#${uid}-body)`} />
      <BodyShading uid={uid} />
      {/* puffy cloud bumps on head */}
      <circle cx="38" cy="8" r="10" fill="#f0f4fa" opacity="0.9" />
      <circle cx="55" cy="5" r="11" fill="#eaeef6" opacity="0.85" />
      <circle cx="48" cy="2" r="8" fill="#f4f7fc" opacity="0.9" />
      {/* sleepy closed eyes */}
      <path d="M30 42 Q36 36 42 42" stroke="#4a5a72" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <path d="M58 42 Q64 36 70 42" stroke="#4a5a72" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      {/* tiny yawn mouth */}
      <ellipse cx="50" cy="52" rx="4" ry="5" fill="#4a5a72" opacity="0.7" />
      {/* rain drops from bottom */}
      <path d="M38 110 L38 120 Q38 123 38 120" stroke="#8fb8e8" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M50 112 L50 122 Q50 125 50 122" stroke="#8fb8e8" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M62 110 L62 120 Q62 123 62 120" stroke="#8fb8e8" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* sleepy Z's */}
      <text x="72" y="20" fill="#8fa3bf" fontSize="10" fontWeight="bold" opacity="0.6">z</text>
      <text x="80" y="12" fill="#8fa3bf" fontSize="7" fontWeight="bold" opacity="0.4">z</text>
    </>
  );
}

function fishy(uid: string): ReactElement {
  return (
    <>
      <Defs uid={uid} top="#ff9a5c" bottom="#e86830" />
      <path d={BODY} fill={`url(#${uid}-body)`} />
      <BodyShading uid={uid} />
      {/* dorsal fin */}
      <path d="M46 8 L50 -4 L56 8 Z" fill="#d85a22" />
      <path d="M48 8 L50 0 L54 8 Z" fill="#ff8848" />
      {/* acorn cap / hat */}
      <ellipse cx="50" cy="10" rx="14" ry="4" fill="#a0622a" />
      {/* big round eyes — one bigger (reference shows asymmetric) */}
      <circle cx="38" cy="42" r="7" fill="#ffffff" />
      <circle cx="38" cy="43" r="4" fill="#1a2840" />
      <circle cx="36" cy="41" r="1.5" fill="#ffffff" />
      <circle cx="62" cy="44" r="5" fill="#ffffff" />
      <circle cx="62" cy="45" r="3" fill="#1a2840" />
      <circle cx="61" cy="43" r="1.2" fill="#ffffff" />
      {/* small smile */}
      <path d="M44 54 Q50 58 56 54" stroke="#8a3a10" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* side fins */}
      <path d="M16 54 L6 48 L10 60 Z" fill="#e87838" />
      <path d="M84 54 L94 48 L90 60 Z" fill="#e87838" />
      {/* belly scales */}
      <g clipPath={`url(#${uid}-clip)`} opacity="0.25" fill="none" stroke="#c05020">
        <path d="M35 72 Q42 70 50 72 Q58 74 65 72" strokeWidth="1.4" />
        <path d="M38 82 Q45 80 50 82 Q55 84 62 82" strokeWidth="1.4" />
        <path d="M40 92 Q47 90 50 92 Q53 94 60 92" strokeWidth="1.4" />
      </g>
    </>
  );
}

function fire(uid: string): ReactElement {
  return (
    <>
      <Defs uid={uid} top="#ff8a1e" bottom="#ffd23f" />
      <path d={BODY} fill={`url(#${uid}-body)`} />
      <BodyShading uid={uid} />
      <path
        d="M44 12 C43 4 48 -1 50 4 C51 -2 57 0 56 6 C60 3 62 9 58 13 C54 16 46 16 44 12 Z"
        fill="#ff6a10"
      />
      <path d="M48 11 C47 6 50 3 51 6 C53 4 54 8 52 11 C50 13 49 13 48 11 Z" fill="#ffd23f" />
      <path d="M28 36 L44 42" stroke="#5a1c04" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M72 36 L56 42" stroke="#5a1c04" strokeWidth="3.5" strokeLinecap="round" />
      <ellipse cx="37" cy="45" rx="5" ry="3" fill="#421403" transform="rotate(10 37 45)" />
      <ellipse cx="63" cy="45" rx="5" ry="3" fill="#421403" transform="rotate(-10 63 45)" />
      <path d="M44 55 L48 52 L52 55 L56 52" stroke="#5a1c04" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* peace symbol on belly (reference) */}
      <circle cx="50" cy="82" r="10" fill="#e86610" opacity="0.85" />
      <circle cx="50" cy="82" r="7" stroke="#ffd23f" strokeWidth="1.5" fill="none" />
      <path d="M50 75 L50 89 M43 80 L50 82 L57 80" stroke="#ffd23f" strokeWidth="1.5" fill="none" />
    </>
  );
}

function earth(uid: string): ReactElement {
  return (
    <>
      <Defs uid={uid} top="#9a6a3c" bottom="#5a3819" />
      <path d={BODY} fill={`url(#${uid}-body)`} />
      <BodyShading uid={uid} />
      <g clipPath={`url(#${uid}-clip)`} stroke="#452a10" strokeWidth="1.6" opacity="0.55" fill="none">
        <path d="M30 14 Q28 50 31 108" />
        <path d="M70 14 Q73 55 69 108" />
        <path d="M50 62 Q46 80 50 112" />
      </g>
      <path d="M50 9 L50 1" stroke="#3f7d2f" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M50 3 C45 -1 40 0 39 4 C42 7 48 6 50 3 Z" fill="#58c04a" />
      <path d="M50 3 C55 0 59 2 59 5 C56 8 51 6 50 3 Z" fill="#46a838" />
      <circle cx="36" cy="41" r="5" fill="#b06ee8" filter={`url(#${uid}-glow)`} />
      <circle cx="64" cy="41" r="5" fill="#b06ee8" filter={`url(#${uid}-glow)`} />
      <circle cx="36" cy="41" r="2" fill="#f0dcff" />
      <circle cx="64" cy="41" r="2" fill="#f0dcff" />
      <path d="M43 53 L57 53" stroke="#331e0a" strokeWidth="2" strokeLinecap="round" />
      <path d="M46 50.5 L46 55.5 M50 50.5 L50 55.5 M54 50.5 L54 55.5" stroke="#331e0a" strokeWidth="1.4" />
      {/* green belly orb (reference) */}
      <circle cx="50" cy="82" r="9" fill="#58c04a" opacity="0.9" filter={`url(#${uid}-glow)`} />
      <circle cx="50" cy="82" r="5" fill="#8fea80" opacity="0.7" />
    </>
  );
}

function spark(uid: string): ReactElement {
  return (
    <>
      <Defs uid={uid} top="#ffe84a" bottom="#e8a020" />
      <path d={BODY} fill={`url(#${uid}-body)`} />
      <BodyShading uid={uid} />
      {/* lightning bolt spike on head */}
      <path d="M46 10 L42 -2 L52 6 L48 -6 L58 8 Z" fill="#ffd020" stroke="#e8a020" strokeWidth="1" />
      {/* wide excited eyes */}
      <circle cx="36" cy="40" r="7" fill="#2a1a08" />
      <circle cx="64" cy="40" r="7" fill="#2a1a08" />
      <circle cx="34" cy="38" r="2.5" fill="#ffffff" />
      <circle cx="62" cy="38" r="2.5" fill="#ffffff" />
      <circle cx="37" cy="42" r="1" fill="#ffffff" />
      <circle cx="65" cy="42" r="1" fill="#ffffff" />
      {/* big excited grin */}
      <path d="M40 52 Q50 62 60 52" stroke="#2a1a08" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* energy zigzags */}
      <g stroke="#ffa010" strokeWidth="2" fill="none" strokeLinecap="round" filter={`url(#${uid}-glow)`}>
        <path d="M12 44 L6 38 L14 32" />
        <path d="M88 44 L94 38 L86 32" />
        <path d="M14 70 L6 64" />
        <path d="M86 70 L94 64" />
      </g>
      {/* belly bolt */}
      <path d="M46 74 L42 82 L50 80 L46 92 L56 78 L48 80 L54 72 Z" fill="#c88010" opacity="0.8" />
    </>
  );
}

function dream(uid: string): ReactElement {
  return (
    <>
      <Defs uid={uid} top="#d4a8e8" bottom="#8a5aaa" />
      <path d={BODY} fill={`url(#${uid}-body)`} />
      <BodyShading uid={uid} />
      {/* nightcap */}
      <path d="M32 14 Q30 -2 50 -8 Q70 -14 80 8 L78 16 Q60 8 32 14 Z" fill="#c48ad8" />
      <circle cx="78" cy="4" r="4" fill="#f0d0ff" />
      {/* droopy half-closed eyes */}
      <path d="M30 40 Q36 36 42 40" stroke="#3a2050" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="36" cy="42" rx="4" ry="2" fill="#3a2050" opacity="0.6" />
      <path d="M58 40 Q64 36 70 40" stroke="#3a2050" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="64" cy="42" rx="4" ry="2" fill="#3a2050" opacity="0.6" />
      {/* peaceful tiny smile */}
      <path d="M46 52 Q50 55 54 52" stroke="#3a2050" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* floating stars */}
      <g fill="#ffd87a" opacity="0.8" filter={`url(#${uid}-glow)`}>
        <path d="M14 18 L16 14 L18 18 L14 16 L18 16 Z" />
        <path d="M82 28 L84 24 L86 28 L82 26 L86 26 Z" />
        <path d="M20 32 L21.5 29 L23 32 L20 31 L23 31 Z" />
      </g>
      {/* crescent moon on belly */}
      <path d="M50 78 A8 8 0 1 1 50 94 A5 5 0 1 0 50 78 Z" fill="#e8d0a0" opacity="0.7" />
    </>
  );
}

function ghost(uid: string): ReactElement {
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6d4fa" />
          <stop offset="100%" stopColor="#cd8de6" />
        </linearGradient>
        <filter id={`${uid}-glow`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path d={GHOST_BODY} fill={`url(#${uid}-body)`} opacity="0.94" />
      <BodyShading uid={uid} bodyPath={GHOST_BODY} />
      <path d="M50 10 Q52 4 58 5" stroke="#e9bdf2" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <g filter={`url(#${uid}-glow)`}>
        <circle cx="36" cy="42" r="5.5" stroke="#ff4fd8" strokeWidth="2" fill="none" />
        <circle cx="36" cy="42" r="1.8" fill="#ff4fd8" />
        <circle cx="64" cy="42" r="5.5" stroke="#ff4fd8" strokeWidth="2" fill="none" />
        <circle cx="64" cy="42" r="1.8" fill="#ff4fd8" />
      </g>
      {/* sleepy Z's (reference) */}
      <text x="74" y="22" fill="#e0b0f0" fontSize="10" fontWeight="bold" opacity="0.5">z</text>
      <text x="82" y="14" fill="#e0b0f0" fontSize="7" fontWeight="bold" opacity="0.35">z</text>
    </>
  );
}

function duck(uid: string): ReactElement {
  return (
    <>
      <Defs uid={uid} top="#ffdf60" bottom="#eda619" />
      <path d={BODY} fill={`url(#${uid}-body)`} />
      <BodyShading uid={uid} />
      <path d="M48 9 Q46 2 52 2 Q50 5 54 6 Q50 8 48 9 Z" fill="#c98b12" />
      <rect x="23" y="33" width="54" height="14" rx="7" fill="#14161c" />
      <path d="M19 36 L24 34 M81 36 L76 34" stroke="#14161c" strokeWidth="3" strokeLinecap="round" />
      <path d="M30 37 L40 43" stroke="#4a5568" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <path d="M58 37 L68 43" stroke="#4a5568" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <ellipse cx="50" cy="57" rx="17" ry="7.5" fill="#f08018" />
      <path d="M33 57 Q50 63 67 57" stroke="#c9660f" strokeWidth="2" fill="none" />
      <circle cx="44" cy="53.5" r="1.2" fill="#b05a0c" />
      <circle cx="56" cy="53.5" r="1.2" fill="#b05a0c" />
    </>
  );
}

function punk(uid: string): ReactElement {
  return (
    <>
      <Defs uid={uid} top="#34343e" bottom="#131318" />
      <path d={BODY} fill={`url(#${uid}-body)`} />
      <BodyShading uid={uid} />
      <path
        d="M30 15 L35 1 L39 13 L45 -1 L49 12 L55 0 L59 13 L65 3 L69 15 Q50 8 30 15 Z"
        fill="#e8e8f0"
      />
      <path d="M17 46 L11 43 L17 40 Z" fill="#c8c8d4" />
      <path d="M83 46 L89 43 L83 40 Z" fill="#c8c8d4" />
      <path d="M31 37 L41 46 M41 37 L31 46" stroke="#f0f0f8" strokeWidth="3" strokeLinecap="round" />
      <circle cx="64" cy="42" r="3.2" fill="#f0f0f8" />
      <path d="M44 55 L56 55" stroke="#8a8a98" strokeWidth="2" strokeLinecap="round" />
      <path d="M48 52.5 L48 57.5 M52 52.5 L52 57.5" stroke="#8a8a98" strokeWidth="1.3" />
    </>
  );
}

function striker(uid: string): ReactElement {
  return (
    <>
      <Defs uid={uid} top="#4a7ae8" bottom="#1a3a8a" />
      <path d={BODY} fill={`url(#${uid}-body)`} />
      <BodyShading uid={uid} />
      {/* sports headband */}
      <g clipPath={`url(#${uid}-clip)`}>
        <rect x="15" y="24" width="70" height="8" fill="#e82030" rx="2" />
      </g>
      {/* athletic stripe */}
      <g clipPath={`url(#${uid}-clip)`} opacity="0.35">
        <rect x="68" y="40" width="14" height="72" fill="#ffffff" />
      </g>
      {/* determined eyes */}
      <circle cx="36" cy="42" r="5" fill="#ffffff" />
      <circle cx="64" cy="42" r="5" fill="#ffffff" />
      <circle cx="37" cy="43" r="3" fill="#1a1a30" />
      <circle cx="65" cy="43" r="3" fill="#1a1a30" />
      <circle cx="36" cy="41" r="1.2" fill="#ffffff" />
      <circle cx="64" cy="41" r="1.2" fill="#ffffff" />
      {/* confident grin */}
      <path d="M42 54 Q50 60 58 54" stroke="#0e1a40" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* jersey number */}
      <text x="50" y="88" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold" opacity="0.9" fontFamily="sans-serif">7</text>
    </>
  );
}

function aura(uid: string): ReactElement {
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2844" />
          <stop offset="100%" stopColor="#0a1020" />
        </linearGradient>
        <filter id={`${uid}-glow`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id={`${uid}-clip`}>
          <path d={HOODED_BODY} />
        </clipPath>
      </defs>
      <path d={HOODED_BODY} fill={`url(#${uid}-body)`} />
      <BodyShading uid={uid} bodyPath={HOODED_BODY} />
      {/* hood peak */}
      <path d="M50 4 L30 24 L70 24 Z" fill="#141e30" />
      <path d="M50 4 L36 20 L64 20 Z" fill="#1a2844" />
      {/* hood shadow interior */}
      <ellipse cx="50" cy="38" rx="20" ry="16" fill="#060a14" opacity="0.6" />
      {/* glowing teal eyes inside hood */}
      <circle cx="40" cy="42" r="4" fill="#3df5d0" filter={`url(#${uid}-glow)`} />
      <circle cx="60" cy="42" r="4" fill="#3df5d0" filter={`url(#${uid}-glow)`} />
      <circle cx="40" cy="42" r="1.5" fill="#ffffff" />
      <circle cx="60" cy="42" r="1.5" fill="#ffffff" />
      {/* energy wisps */}
      <g stroke="#3df5d0" strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round">
        <path d="M18 80 Q10 70 14 58" />
        <path d="M82 80 Q90 70 86 58" />
        <path d="M22 94 Q14 86 18 76" />
      </g>
    </>
  );
}

function demon(uid: string): ReactElement {
  return (
    <>
      <Defs uid={uid} top="#7c1a10" bottom="#2a0503" />
      <path d={BODY} fill={`url(#${uid}-body)`} />
      <BodyShading uid={uid} />
      <path d="M28 16 C22 10 22 2 30 4 C33 7 33 13 31 17 Z" fill="#3a0a06" />
      <path d="M72 16 C78 10 78 2 70 4 C67 7 67 13 69 17 Z" fill="#3a0a06" />
      <g
        clipPath={`url(#${uid}-clip)`}
        stroke="#ff7a20"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        filter={`url(#${uid}-glow)`}
      >
        <path d="M24 60 L30 66 L26 72 L33 79" />
        <path d="M76 56 L70 63 L75 70" />
        <path d="M48 96 L54 101 L50 107" />
      </g>
      <path d="M28 34 L43 40" stroke="#1c0301" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M72 34 L57 40" stroke="#1c0301" strokeWidth="3.5" strokeLinecap="round" />
      <ellipse cx="37" cy="43" rx="5" ry="2.8" fill="#ff3020" transform="rotate(12 37 43)" filter={`url(#${uid}-glow)`} />
      <ellipse cx="63" cy="43" rx="5" ry="2.8" fill="#ff3020" transform="rotate(-12 63 43)" filter={`url(#${uid}-glow)`} />
      <g clipPath={`url(#${uid}-clip)`}>
        <rect x="14" y="72" width="72" height="11" fill="#1a1a20" />
        <rect x="44" y="70" width="12" height="15" rx="2" fill="#c89020" />
        <rect x="47.5" y="73.5" width="5" height="8" rx="1" fill="#2a0503" />
      </g>
    </>
  );
}

function king(uid: string): ReactElement {
  return (
    <>
      <Defs uid={uid} top="#4a4a56" bottom="#1e1e28" />
      <path d={BODY} fill={`url(#${uid}-body)`} />
      <BodyShading uid={uid} />
      <path
        d="M30 16 L30 6 L38 12 L46 3 L54 12 L62 5 L70 16 Q50 10 30 16 Z"
        fill="#8a8a96"
      />
      <path d="M30 16 Q50 10 70 16 L69 20 Q50 14 31 20 Z" fill="#6c6c78" />
      <path
        d="M32 30 C32 24 68 24 68 30 L67 52 C67 60 33 60 33 52 Z"
        fill="#e6e6ea"
      />
      <circle cx="41" cy="40" r="6" fill="#17171d" />
      <circle cx="59" cy="40" r="6" fill="#17171d" />
      <path d="M50 46 L47 52 L53 52 Z" fill="#17171d" />
      <path d="M40 57 L60 57" stroke="#17171d" strokeWidth="1.6" />
      <path d="M44 55 L44 59 M50 55 L50 59 M56 55 L56 59" stroke="#17171d" strokeWidth="1.4" />
      {/* purple X on chest (reference) */}
      <path d="M42 78 L58 94 M58 78 L42 94" stroke="#6b3fa0" strokeWidth="3" strokeLinecap="round" />
    </>
  );
}

function peanut(_uid: string): ReactElement {
  // Render the official Burnt Peanut SVG asset exactly as provided.
  // The asset is 512×512; we embed it to fill the sprite viewBox (-6 -6 112 126).
  return (
    <image
      href="/burnt%20peanut.svg"
      x="-6"
      y="-6"
      width="112"
      height="126"
      preserveAspectRatio="xMidYMid meet"
    />
  );
}

function grim(uid: string): ReactElement {
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2030" />
          <stop offset="100%" stopColor="#0e0a14" />
        </linearGradient>
        <filter id={`${uid}-glow`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id={`${uid}-clip`}>
          <path d={HOODED_BODY} />
        </clipPath>
      </defs>
      <path d={HOODED_BODY} fill={`url(#${uid}-body)`} />
      <BodyShading uid={uid} bodyPath={HOODED_BODY} />
      {/* tattered hood */}
      <path d="M50 4 L26 28 L74 28 Z" fill="#1a1420" />
      <path d="M50 4 L32 24 L68 24 Z" fill="#221a2a" />
      {/* hood edge tatters */}
      <path d="M26 28 L22 34 L30 30 L28 36 L34 28" fill="#1a1420" />
      <path d="M74 28 L78 34 L70 30 L72 36 L66 28" fill="#1a1420" />
      {/* skull face */}
      <path d="M34 32 C34 26 66 26 66 32 L65 50 C65 56 35 56 35 50 Z" fill="#c8c0d0" />
      {/* hollow eyes */}
      <circle cx="42" cy="40" r="5" fill="#0a0610" />
      <circle cx="58" cy="40" r="5" fill="#0a0610" />
      <circle cx="42" cy="40" r="2" fill="#ff2080" filter={`url(#${uid}-glow)`} />
      <circle cx="58" cy="40" r="2" fill="#ff2080" filter={`url(#${uid}-glow)`} />
      {/* nose hole */}
      <path d="M50 46 L48 49 L52 49 Z" fill="#0a0610" />
      {/* teeth */}
      <path d="M42 53 L58 53" stroke="#0a0610" strokeWidth="1.2" />
      <path d="M45 51 L45 55 M49 51 L49 55 M53 51 L53 55 M57 51 L57 55" stroke="#0a0610" strokeWidth="1" />
      {/* spectral wisps */}
      <g stroke="#6040a0" strokeWidth="1.5" fill="none" opacity="0.35" strokeLinecap="round">
        <path d="M16 90 Q8 78 12 66" />
        <path d="M84 90 Q92 78 88 66" />
      </g>
    </>
  );
}

function boss(uid: string): ReactElement {
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c02020" />
          <stop offset="100%" stopColor="#4a0808" />
        </linearGradient>
        <filter id={`${uid}-glow`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id={`${uid}-clip`}>
          <path d={BODY} />
        </clipPath>
      </defs>
      <path d={BODY} fill={`url(#${uid}-body)`} />
      <BodyShading uid={uid} />
      {/* spiked crown */}
      <path d="M26 18 L30 2 L38 14 L46 -2 L54 14 L62 2 L70 14 L74 18 Q50 10 26 18 Z" fill="#1a1a24" />
      <path d="M26 18 Q50 10 74 18 L72 22 Q50 14 28 22 Z" fill="#2a2a38" />
      {/* crown jewel */}
      <circle cx="50" cy="8" r="3" fill="#ffd020" filter={`url(#${uid}-glow)`} />
      {/* menacing eyes */}
      <path d="M26 34 L44 40" stroke="#0a0202" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M74 34 L56 40" stroke="#0a0202" strokeWidth="3.5" strokeLinecap="round" />
      <ellipse cx="37" cy="43" rx="5.5" ry="3" fill="#ff2020" filter={`url(#${uid}-glow)`} />
      <ellipse cx="63" cy="43" rx="5.5" ry="3" fill="#ff2020" filter={`url(#${uid}-glow)`} />
      {/* V-shaped teeth grin */}
      <path d="M38 54 L42 58 L46 54 L50 58 L54 54 L58 58 L62 54" stroke="#0a0202" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* chest plate */}
      <g clipPath={`url(#${uid}-clip)`}>
        <path d="M30 68 L50 62 L70 68 L70 90 L50 96 L30 90 Z" fill="#1a1a24" opacity="0.7" />
        <path d="M50 70 L40 76 L50 82 L60 76 Z" fill="#ffd020" opacity="0.6" />
      </g>
    </>
  );
}

function frost(uid: string): ReactElement {
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#b8e8ff" />
          <stop offset="50%" stopColor="#60b0e8" />
          <stop offset="100%" stopColor="#2060a0" />
        </linearGradient>
        <filter id={`${uid}-glow`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.8" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id={`${uid}-clip`}>
          <path d={CRYSTAL_BODY} />
        </clipPath>
      </defs>
      {/* crystal body */}
      <path d={CRYSTAL_BODY} fill={`url(#${uid}-body)`} stroke="#a0d8ff" strokeWidth="1.2" />
      <BodyShading uid={uid} bodyPath={CRYSTAL_BODY} />
      {/* ice facet lines */}
      <g stroke="#ffffff" strokeWidth="1" opacity="0.3" fill="none">
        <path d="M50 4 L44 52 L18 92" />
        <path d="M79 40 L44 52 L32 108" />
        <path d="M74 72 L44 52" />
        <path d="M20 42 L44 52" />
      </g>
      {/* ice crown */}
      <path d="M36 14 L40 -2 L46 10 L50 -4 L54 10 L60 -2 L64 14" fill="#c0e8ff" stroke="#a0d8ff" strokeWidth="1" />
      {/* frost cracks */}
      <g clipPath={`url(#${uid}-clip)`} stroke="#d0f0ff" strokeWidth="1.8" fill="none" strokeLinecap="round" filter={`url(#${uid}-glow)`}>
        <path d="M30 30 L40 40 L34 50" />
        <path d="M70 35 L62 48 L68 58" />
        <path d="M38 80 L48 90 L42 100" />
      </g>
      {/* cool calm eyes */}
      <ellipse cx="39" cy="46" rx="5" ry="6" fill="#ffffff" />
      <ellipse cx="63" cy="46" rx="5" ry="6" fill="#ffffff" />
      <circle cx="39" cy="47" r="3" fill="#2060a0" />
      <circle cx="63" cy="47" r="3" fill="#2060a0" />
      <circle cx="38" cy="45" r="1.2" fill="#ffffff" />
      <circle cx="62" cy="45" r="1.2" fill="#ffffff" />
      {/* floating ice shards */}
      <path d="M6 40 L12 34 L11 46 Z" fill="#80c8ff" opacity="0.7" filter={`url(#${uid}-glow)`} />
      <path d="M90 58 L96 52 L94 64 Z" fill="#80c8ff" opacity="0.7" filter={`url(#${uid}-glow)`} />
    </>
  );
}

function zeropoint(uid: string): ReactElement {
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#6b2a66" />
          <stop offset="55%" stopColor="#341447" />
          <stop offset="100%" stopColor="#1a0b28" />
        </linearGradient>
        <filter id={`${uid}-glow`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id={`${uid}-clip`}>
          <path d={CRYSTAL_BODY} />
        </clipPath>
      </defs>
      <path d="M8 34 L14 30 L13 40 Z" fill="#4a1a46" stroke="#ff5fe0" strokeWidth="1" opacity="0.9" filter={`url(#${uid}-glow)`} />
      <path d="M88 62 L94 58 L92 68 Z" fill="#4a1a46" stroke="#ff5fe0" strokeWidth="1" opacity="0.9" filter={`url(#${uid}-glow)`} />
      <path d={CRYSTAL_BODY} fill={`url(#${uid}-body)`} stroke="#c85fd8" strokeWidth="1.8" filter={`url(#${uid}-glow)`} />
      <g stroke="#8a44a0" strokeWidth="1.2" opacity="0.9" fill="none">
        <path d="M50 4 L46 52 L26 72" />
        <path d="M79 40 L46 52 L32 108" />
        <path d="M74 72 L46 52" />
        <path d="M20 42 L46 52" />
      </g>
      <g
        clipPath={`url(#${uid}-clip)`}
        stroke="#ff5fe0"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
        filter={`url(#${uid}-glow)`}
      >
        <path d="M34 20 L44 32 L38 40 L48 50" />
        <path d="M68 30 L60 44 L68 54" />
        <path d="M40 78 L50 88 L44 100" />
        <path d="M66 76 L58 90" />
        <path d="M26 52 L34 60 L28 68" />
      </g>
      <ellipse cx="39" cy="46" rx="5.5" ry="6.5" fill="#ff5fe0" filter={`url(#${uid}-glow)`} />
      <ellipse cx="63" cy="46" rx="5.5" ry="6.5" fill="#ff5fe0" filter={`url(#${uid}-glow)`} />
      <circle cx="38" cy="43.5" r="1.8" fill="#ffd6f8" />
      <circle cx="62" cy="43.5" r="1.8" fill="#ffd6f8" />
    </>
  );
}

const RENDERERS: Record<string, (uid: string) => ReactElement> = {
  water,
  air,
  cloud,
  fishy,
  fire,
  earth,
  spark,
  dream,
  ghost,
  duck,
  punk,
  striker,
  aura,
  demon,
  king,
  peanut,
  grim,
  zeropoint,
  boss,
  frost,
};

export default function SpriteArt({ spriteId, size = 160, className }: SpriteArtProps) {
  const render = RENDERERS[spriteId] ?? air;
  const uid = `sp-${spriteId}`;
  return (
    <svg
      viewBox="-6 -6 112 126"
      width={size}
      height={size * 1.125}
      className={className}
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      {render(uid)}
    </svg>
  );
}
