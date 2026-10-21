import { useEffect, useRef, useState } from 'react';

/**
 * Defers mounting heavy subtrees (charts, tables) until they approach
 * the viewport. Keeps ReactDOM/Recharts/Leaflet work out of the initial
 * page load — RAM and CPU only spent on what the user actually opens.
 *
 * - Keeps outer section anchors intact: wrap INNER content only.
 * - Once visible, children stay mounted (no unmount flicker).
 * - Falls back to immediate mount when IntersectionObserver is missing.
 */
export default function LazyMount({ minHeight = 400, className = '', children }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(
    () => typeof IntersectionObserver === 'undefined'
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '500px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div ref={ref} className={className} style={visible ? undefined : { minHeight }}>
      {visible ? (
        children
      ) : (
        <div className="flex items-start py-8" aria-hidden="true">
          <span className="w-2.5 h-5 bg-accent animate-blink" />
        </div>
      )}
    </div>
  );
}
