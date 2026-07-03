import { SCENE_ASPECT, SCENE_VIEW_BOX } from "./geometry";

// Mid-distance layer: the far hill silhouette.
export function HillsLayer() {
  return (
    <svg
      aria-hidden="true"
      viewBox={SCENE_VIEW_BOX}
      preserveAspectRatio={SCENE_ASPECT}
      className="h-full w-full"
    >
      <path
        d="M0 560 Q 240 520 480 548 T 960 540 T 1440 556 V810 H0 Z"
        className="fill-surface/70"
      />
    </svg>
  );
}
