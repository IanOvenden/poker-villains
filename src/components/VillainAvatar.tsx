const ICONS: Record<string, React.ReactNode> = {
  shark: (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/icons/avatars/shark.png"
      alt="shark"
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
    />
  ),

  // eslint-disable-next-line @next/next/no-img-element
  hustler: (
    <img
      src="/icons/avatars/hustler.png"
      alt="hustler"
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
    />
  ),

  // eslint-disable-next-line @next/next/no-img-element
  ghost: (
    <img
      src="/icons/avatars/ghost.png"
      alt="ghost"
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
    />
  ),

  // eslint-disable-next-line @next/next/no-img-element
  gunslinger: (
    <img
      src="/icons/avatars/gunslinger.png"
      alt="gunslinger"
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
    />
  ),

  // eslint-disable-next-line @next/next/no-img-element
  viper: (
    <img
      src="/icons/avatars/viper.png"
      alt="viper"
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
    />
  ),

  // eslint-disable-next-line @next/next/no-img-element
  don: (
    <img
      src="/icons/avatars/don.png"
      alt="don"
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
    />
  ),

  // eslint-disable-next-line @next/next/no-img-element
  fox: (
    <img
      src="/icons/avatars/fox.png"
      alt="fox"
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
    />
  ),

  // eslint-disable-next-line @next/next/no-img-element
  machine: (
    <img
      src="/icons/avatars/machine.png"
      alt="machine"
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
    />
  ),

  // eslint-disable-next-line @next/next/no-img-element
  joker: (
    <img
      src="/icons/avatars/joker.png"
      alt="joker"
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
    />
  ),

  // eslint-disable-next-line @next/next/no-img-element
  devil: (
    <img
      src="/icons/avatars/devil.png"
      alt="devil"
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
    />
  ),
};

type Props = {
  villainId: string;
  size?: number;
  className?: string;
};

export default function VillainAvatar({
  villainId,
  size = 40,
  className = "",
}: Props) {
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
