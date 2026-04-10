/** Kleines KI-/Netzwerk-Icon (3 Knoten) wie bei Portal-Referenzen */
export function FlipoNodesIcon({ className = "h-5 w-5 shrink-0 text-cyan-600" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="2.5" fill="currentColor" />
      <circle cx="18" cy="8" r="2.5" fill="currentColor" />
      <circle cx="10" cy="18" r="2.5" fill="currentColor" />
      <path
        d="M8 7.5l6 1.5M15.5 9.5l-4 7M8.5 7.5l2 9"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
        opacity={0.85}
      />
    </svg>
  );
}
