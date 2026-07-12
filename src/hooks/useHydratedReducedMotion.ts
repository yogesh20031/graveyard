"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

// motion's own useReducedMotion reads the media query while rendering. On the
// server there is no media query, so it is always false there — and for anyone
// who asked for less motion it is true on the client's very first render. A
// component that branches its whole tree on it (the walk, the parallax) then
// hands React a different tree than the one the server sent: hydration fails
// and the server HTML is thrown away and rebuilt.
//
// useSyncExternalStore exists for exactly this. React hydrates against the
// server snapshot (full motion), then immediately re-renders with the real one,
// so both renders agree and the preference is still honoured.
const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

export function useHydratedReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
