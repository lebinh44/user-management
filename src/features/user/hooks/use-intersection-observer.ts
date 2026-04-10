import { useEffect } from "react";

export default function useIntersectionObserver(
  ref: React.RefObject<Element | null>,
  onIntersect: () => void,
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled || !ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onIntersect();
      },
      { threshold: 0.1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, onIntersect, enabled]);
}
