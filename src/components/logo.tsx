import Link from "next/link";

export function LogoMark({ className = "size-9" }: { className?: string }) {
  return (
    <span
      className={`relative grid place-items-center overflow-hidden rounded-[11px] bg-gradient-to-br from-[#4ade80] via-[#34d399] to-[#0d9488] shadow-[0_0_26px_-8px_rgba(52,211,153,0.85)] ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="size-[60%]"
        aria-hidden="true"
      >
        <path
          d="M6 17.5V9.2c0-1.2.9-2.2 2.1-2.2H14"
          stroke="#03140d"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M9 12.5h4.5M9 17.5h6.5M16.5 8v9.5"
          stroke="#03140d"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity=".55"
        />
      </svg>
    </span>
  );
}

export function Logo({
  href = "/",
  compact = false,
}: {
  href?: string;
  compact?: boolean;
}) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2.5">
      <LogoMark />
      {!compact && (
        <span className="text-[17px] font-semibold tracking-tight text-text">
          finora<span className="text-mint">.</span>
        </span>
      )}
    </Link>
  );
}
