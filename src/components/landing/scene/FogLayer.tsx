import { SCENE_ASPECT, SCENE_VIEW_BOX } from "./geometry";

// Topmost layer: drifting fog. Thins out as you scroll in, like it parts
// around you.
export function FogLayer() {
  return (
    <svg
      aria-hidden="true"
      viewBox={SCENE_VIEW_BOX}
      preserveAspectRatio={SCENE_ASPECT}
      className="h-full w-full"
    >
      <defs>
        <filter id="fog-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="24" />
        </filter>
      </defs>

      <ellipse
        cx={300}
        cy={690}
        rx={380}
        ry={55}
        filter="url(#fog-blur)"
        className="fog-layer fill-foreground/6"
      />
      <ellipse
        cx={820}
        cy={720}
        rx={460}
        ry={65}
        filter="url(#fog-blur)"
        className="fog-layer-slow fill-foreground/8"
      />
      <ellipse
        cx={1250}
        cy={680}
        rx={340}
        ry={50}
        filter="url(#fog-blur)"
        className="fog-layer fill-foreground/5"
      />
    </svg>
  );
}
