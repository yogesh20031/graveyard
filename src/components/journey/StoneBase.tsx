// Dirt mound + grass drawn over the bottom edge of whatever stands above
// it (negative top margin), so stones grow out of the ground instead of
// resting on top of the page.
export function StoneBase() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 600 36"
      preserveAspectRatio="none"
      className="-mt-4 h-9 w-full"
    >
      <path d="M0 36 Q 300 6 600 36 Z" className="fill-surface" />
      <g className="fill-foreground/12">
        <path d="M60 26 l5 -16 4 16 5 -12 4 12 Z" />
        <path d="M180 20 l5 -14 4 14 5 -10 4 10 Z" />
        <path d="M300 17 l5 -15 4 15 5 -11 4 11 Z" />
        <path d="M420 20 l5 -13 4 13 5 -9 4 9 Z" />
        <path d="M530 26 l5 -16 4 16 5 -12 4 12 Z" />
      </g>
    </svg>
  );
}
