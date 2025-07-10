import { useState, useEffect, useRef } from "react";

export interface VisibilityState {
  [key: string]: boolean;
}

export const useSectionAnimation = () => {
  const [isVisible, setIsVisible] = useState<VisibilityState>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    observerRef.current = observer;

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return isVisible;
}; 