import React from 'react';
import { VisibilityState } from '../../../../shared/hooks/useSectionAnimation';

interface PosterProps {
  poster: {
    title: string;
    subtitle: string;
  };
  isVisible: VisibilityState;
}

const DepartmentCommunityPoster: React.FC<PosterProps> = ({ poster, isVisible }) => (
  <section
    id="poster"
    data-animate
    className={`relative h-64 sm:h-80 lg:h-96 bg-gradient-to-b from-cyan-600 to-blue-600 flex items-center justify-center transition-all duration-800 ${
      isVisible['poster'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}
  >
    <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/60 to-transparent" />
    <div className="relative z-10 w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 text-center text-white">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 px-2">{poster.title}</h1>
      <p className="text-sm sm:text-base lg:text-lg xl:text-2xl text-cyan-100 px-2">{poster.subtitle}</p>
    </div>
  </section>
);

export default DepartmentCommunityPoster; 