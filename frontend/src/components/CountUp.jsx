import { useEffect, useRef, useState } from 'react';

export default function CountUp({ value, duration = 800 }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(null);

  useEffect(() => {
    if (value === null || value === undefined) return;

    const start = prevRef.current ?? 0;
    prevRef.current = value;
    const diff = value - start;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [value, duration]);

  return <>{display}</>;
}
