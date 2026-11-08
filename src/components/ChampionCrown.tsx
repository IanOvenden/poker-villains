type Props = {
  className?: string;
  size?: number;
};

export default function ChampionCrown({ className = "", size }: Props) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path d="M5 19h14v2H5zm1-2L4 7l5 3 3-6 3 6 5-3-2 10z" />
    </svg>
  );
}
