import { useEffect, useRef, useState } from 'react';

export function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(currentRef);
        }
      },
      { threshold, rootMargin: '200px' }
    );

    observer.observe(currentRef);

    const fallback = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    return () => {
      clearTimeout(fallback);
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [threshold]);

  return { ref, isVisible };
}
