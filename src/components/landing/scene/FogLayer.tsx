// Topmost layer: drifting ground fog. Plain blurred divs animated with
// transforms so the drift stays on the GPU compositor — the old SVG
// feGaussianBlur ellipses re-rasterized the blur on every frame.
export function FogLayer() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="fog-puff fog-puff-a fog-layer" />
      <div className="fog-puff fog-puff-b fog-layer-slow" />
      <div className="fog-puff fog-puff-c fog-layer" />
    </div>
  );
}
