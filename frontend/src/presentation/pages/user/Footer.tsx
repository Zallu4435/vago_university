import { useEffect } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { usePreferences } from '../../context/PreferencesContext';

export default function Footer() {
  const { styles } = usePreferences();
  const location = useLocation();
  const portalName = location.pathname.includes('/canvas') ? 'Student Canvas' : 'University Portal';

  return (
    <footer className={`relative overflow-hidden border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0.06)] ${styles.border}`}>
      <div className={`absolute inset-0 ${styles.backgroundSecondary}`}></div>
      <div className={`absolute inset-0 bg-gradient-to-r ${styles.accent} opacity-20 transition-all duration-500`}></div>
      <div className="absolute top-0 left-0 right-0 h-4 sm:h-8 bg-gradient-to-b from-black/5 to-transparent"></div>
      <div className={`absolute -bottom-8 sm:-bottom-16 -right-8 sm:-right-16 w-32 h-32 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br ${styles.orb.primary} blur-2xl sm:blur-3xl animate-pulse`}></div>
      <div className={`absolute -top-4 sm:-top-8 -left-4 sm:-left-8 w-16 h-16 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br ${styles.orb.secondary} blur-xl sm:blur-2xl animate-pulse delay-700`}></div>
      <div className={`absolute top-2 sm:top-4 right-2 sm:right-4 w-8 h-8 sm:w-16 sm:h-16 border-2 ${styles.borderSecondary} rounded-full rotate-45 group-hover:rotate-90 transition-transform duration-700`}></div>
      <div className={`absolute bottom-4 sm:bottom-8 left-4 sm:left-8 w-4 h-4 sm:w-8 sm:h-8 bg-gradient-to-br ${styles.pattern.secondary} rounded-lg rotate-12 group-hover:rotate-45 transition-transform duration-500`}></div>
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 text-center relative">
        <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
          <div className="relative">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${styles.accent} flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110`}>
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
              <span className="text-white text-lg sm:text-2xl relative">🎓</span>
            </div>
            <div className={`absolute -inset-1 bg-gradient-to-br ${styles.orb.primary} rounded-xl sm:rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
          </div>
          <div>
            <p className={`text-lg sm:text-xl md:text-2xl font-bold ${styles.textPrimary}`}>
              {portalName}
            </p>
            <div className={`h-0.5 sm:h-1 w-12 sm:w-16 bg-gradient-to-r ${styles.accent} rounded-full mt-1 group-hover:w-16 sm:group-hover:w-24 transition-all duration-300`}></div>
          </div>
        </div>
        <p className={`text-sm sm:text-base font-medium mb-3 sm:mb-4 ${styles.textSecondary}`}>© 2025 {portalName}. All rights reserved.</p>
        <div className="flex justify-center flex-wrap gap-x-4 sm:gap-x-6 gap-y-2 sm:gap-y-3">
          {[
            { text: 'Help Center', href: '#' },
            { text: 'Privacy Policy', href: '#' },
            { text: 'Terms of Service', href: '#' },
            { text: 'Contact Support', href: '#' },
          ].map((link, index) => (
            <a
              key={index}
              href={link.href}
              className={`group/link relative flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm ${styles.textSecondary} hover:${styles.textPrimary} transition-all duration-300 px-2 py-1 rounded hover:bg-white/5`}
            >
              <span className="font-medium">{link.text}</span>
              <FaArrowRight
                className={`${styles.icon.primary} opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all duration-300`}
                size={10}
              />
              <div className={`absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r ${styles.accent} group-hover/link:w-full transition-all duration-300 rounded-full`}></div>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}