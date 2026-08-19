import { useEffect, useState } from "react";

/**
 * Renders `children` only after hydration. WebGL (Three.js) and the Web Audio
 * API don't exist on the server, so anything that touches them must be gated
 * here. During SSR (and the first client render) we emit `fallback` instead,
 * which keeps markup identical on both sides and avoids hydration mismatches.
 */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: () => React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <>{mounted ? children() : fallback}</>;
}
