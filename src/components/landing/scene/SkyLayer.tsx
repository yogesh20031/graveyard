import { SCENE_ASPECT, SCENE_VIEW_BOX, STARS } from "./geometry";

// Farthest layer: moon + stars. Moves slowest in the parallax.
export function SkyLayer() {
  return (
    <svg
      aria-hidden="true"
      viewBox={SCENE_VIEW_BOX}
      preserveAspectRatio={SCENE_ASPECT}
      className="h-full w-full"
    >
      <defs>
        <filter id="sky-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="24" />
        </filter>
      </defs>

      <Stars />
      <Moon />
    </svg>
  );
}

function Stars() {
  return (
    <g>
      {STARS.map((star) => (
        <circle
          key={`${star.x}-${star.y}`}
          cx={star.x}
          cy={star.y}
          r={star.r}
          className={
            star.slow ? "star-slow fill-foreground/70" : "star fill-foreground/70"
          }
        />
      ))}
    </g>
  );
}

function Moon() {
  return (
    <g>
      <circle
        cx={1100}
        cy={150}
        r={120}
        filter="url(#sky-blur)"
        className="fill-foreground/10"
      />
      <circle cx={1100} cy={150} r={52} className="fill-foreground/90" />
      <circle cx={1082} cy={136} r={9} className="fill-background/15" />
      <circle cx={1116} cy={168} r={6} className="fill-background/15" />
      <circle cx={1122} cy={132} r={4} className="fill-background/10" />
    </g>
  );
}
