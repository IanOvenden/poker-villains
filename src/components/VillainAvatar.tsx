const ICONS: Record<string, React.ReactNode> = {
  shark: (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Card body */}
      <rect x="13" y="15" width="14" height="18" rx="2" />
      {/* Shark fin breaking through */}
      <path d="M20 15 L17 7 L24 13" />
      {/* Spade pip */}
      <path d="M18 26 L20 23 L22 26 Q22 28 20 27 Q18 28 18 26 Z" fill="currentColor" stroke="none" />
      <line x1="18" y1="29" x2="22" y2="29" />
    </svg>
  ),

  hustler: (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Hat crown */}
      <path d="M14 26 L14 13 Q14 11 16 11 L24 11 Q26 11 26 13 L26 26" />
      {/* Hat band */}
      <line x1="14" y1="22" x2="26" y2="22" />
      {/* Brim */}
      <path d="M7 27 Q13 25 20 25 Q27 25 33 27 Q28 31 20 31 Q12 31 7 27 Z" />
      {/* Card in band */}
      <rect x="22" y="20" width="3" height="5" rx="0.5" strokeWidth="1.5" />
    </svg>
  ),

  ghost: (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 33 L11 20 Q11 8 20 8 Q29 8 29 20 L29 33 L26 29 L23 33 L20 29 L17 33 L14 29 Z" />
      <circle cx="16" cy="20" r="2" fill="currentColor" stroke="none" />
      <circle cx="24" cy="20" r="2" fill="currentColor" stroke="none" />
    </svg>
  ),

  gunslinger: (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Crown */}
      <path d="M14 26 Q13 15 20 13 Q27 15 26 26 Z" />
      {/* Crown indent */}
      <path d="M16 17 Q20 19 24 17" strokeWidth="1.5" />
      {/* Brim */}
      <path d="M6 29 Q13 26 20 26 Q27 26 34 29 Q28 33 20 33 Q12 33 6 29 Z" />
    </svg>
  ),

  viper: (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Body coil */}
      <path d="M13 32 Q6 26 9 19 Q12 12 19 12 Q26 12 26 19 Q26 26 33 23" />
      {/* Forked tongue */}
      <path d="M33 23 L36 20 M33 23 L36 26" strokeWidth="1.5" />
      {/* Eye */}
      <circle cx="16" cy="15" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),

  don: (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Crown points */}
      <path d="M8 31 L10 19 L16 25 L20 11 L24 25 L30 19 L32 31 Z" />
      {/* Base band */}
      <line x1="8" y1="31" x2="32" y2="31" />
      {/* Gems */}
      <circle cx="14" cy="29" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="20" cy="29" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="26" cy="29" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),

  fox: (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Ears */}
      <path d="M11 20 L8 9 L17 17" />
      <path d="M29 20 L32 9 L23 17" />
      {/* Head */}
      <circle cx="20" cy="24" r="9" />
      {/* Snout */}
      <ellipse cx="20" cy="28" rx="5" ry="3" />
      {/* Eyes */}
      <circle cx="16" cy="22" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="24" cy="22" r="1.5" fill="currentColor" stroke="none" />
      {/* Nose */}
      <path d="M19 27 L20 26 L21 27" strokeWidth="1.5" />
    </svg>
  ),

  machine: (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Antenna */}
      <line x1="20" y1="10" x2="20" y2="13" />
      <circle cx="20" cy="9" r="2" />
      {/* Head */}
      <rect x="10" y="13" width="20" height="19" rx="3" />
      {/* Eyes */}
      <rect x="12" y="17" width="6" height="5" rx="1.5" />
      <rect x="22" y="17" width="6" height="5" rx="1.5" />
      {/* Mouth grid */}
      <path d="M12 26 L14 28 L16 26 L18 28 L20 26 L22 28 L24 26 L26 28 L28 26" strokeWidth="1.5" />
    </svg>
  ),

  joker: (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Hat body */}
      <path d="M11 31 Q12 23 15 19 L20 11 L25 19 Q28 23 29 31 Z" />
      {/* Bell tips */}
      <circle cx="20" cy="10" r="3" fill="currentColor" stroke="none" />
      <circle cx="15" cy="19" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="25" cy="19" r="2.5" fill="currentColor" stroke="none" />
      {/* Diamond motif */}
      <path d="M20 22 L18 25 L20 28 L22 25 Z" fill="currentColor" stroke="none" />
    </svg>
  ),

  devil: (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Horns */}
      <path d="M14 21 Q11 14 14 10 Q17 12 16 21" />
      <path d="M26 21 Q29 14 26 10 Q23 12 24 21" />
      {/* Face */}
      <circle cx="20" cy="26" r="9" />
      {/* Eyes */}
      <circle cx="16" cy="24" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="24" cy="24" r="1.5" fill="currentColor" stroke="none" />
      {/* Wicked smile */}
      <path d="M15 29 Q17 32 20 30 Q23 32 25 29" />
    </svg>
  ),
};

type Props = {
  villainId: string;
  size?: number;
  className?: string;
};

export default function VillainAvatar({ villainId, size = 40, className = "" }: Props) {
  const icon = ICONS[villainId];
  if (!icon) return null;

  const iconSize = Math.round(size * 0.58);

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-accent/10 text-accent flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <div style={{ width: iconSize, height: iconSize }}>{icon}</div>
    </div>
  );
}
