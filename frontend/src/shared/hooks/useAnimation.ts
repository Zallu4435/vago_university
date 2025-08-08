import { useState, useEffect } from 'react';

export const useAnimation = (delay = 100) => {
  const [style, setStyle] = useState({ opacity: 0, transform: 'translateY(20px)', transition: '' });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStyle({
        opacity: 1,
        transform: 'none',
        transition: 'opacity 600ms ease-in-out, transform 600ms ease-out',
      });
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return style;
};