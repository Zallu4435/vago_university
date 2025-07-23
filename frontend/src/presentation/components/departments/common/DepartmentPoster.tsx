import React from 'react';
import { VisibilityState } from '../../../../shared/hooks/useSectionAnimation';

interface PosterProps {
  poster: {
    title: string;
    subtitle: string;
  };
  isVisible: VisibilityState;
}

const DepartmentPoster: React.FC<PosterProps> = ({ poster, isVisible }) => (
  <section
    id="poster"
    data-animate
    className={`relative h-64 sm:h-80 lg:h-96 flex items-center justify-center transition-all duration-800 overflow-hidden ${
      isVisible['poster'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}
  >
    {/* Animated gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 animate-gradient-move" />
    {/* Glassmorphism text container */}
    <div className="relative z-10 w-full max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 text-center">
      <div className="inline-block bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl px-6 py-8 border border-white/30 animate-fade-in-poster">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-4 px-2 text-white drop-shadow-2xl tracking-tight animate-fade-in-poster">
          {poster.title}
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-cyan-100 font-medium px-2 animate-fade-in-poster" style={{textShadow: '0 2px 16px rgba(0,0,0,0.18)'}}>
          {poster.subtitle}
        </p>
      </div>
    </div>
    {/* Decorative SVG wave at the bottom */}
    <svg className="absolute bottom-0 left-0 w-full h-16 lg:h-24" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="url(#poster-wave)" fillOpacity="0.7" d="M0,224L60,202.7C120,181,240,139,360,154.7C480,171,600,245,720,250.7C840,256,960,192,1080,154.7C1200,117,1320,107,1380,101.3L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
      <defs>
        <linearGradient id="poster-wave" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#06b6d4" />
          <stop offset="0.5" stopColor="#2563eb" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
      </defs>
    </svg>
    {/* Glowing border effect */}
    <div className="absolute inset-0 pointer-events-none rounded-2xl border-2 border-cyan-400/40 shadow-[0_0_60px_10px_rgba(6,182,212,0.15)]" />
    <style>{`
      @keyframes gradient-move {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .animate-gradient-move {
        background-size: 200% 200%;
        animation: gradient-move 8s ease-in-out infinite;
      }
      @keyframes fade-in-poster {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in-poster {
        animation: fade-in-poster 1.2s cubic-bezier(0.4,0,0.2,1) both;
      }
    `}</style>
  </section>
);

export default DepartmentPoster; 