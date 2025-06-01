import { useEffect } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { usePreferences } from '../../context/PreferencesContext';

export default function Footer() {
  const { styles } = usePreferences();

  useEffect(() => {
    console.log('Footer theme styles:', styles);
  }, [styles]);

  return (
    <footer className={`relative overflow-hidden border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0.06)] ${styles.border}`}>
      <div className={`absolute inset-0 ${styles.backgroundSecondary}`}></div>
      <div className={`absolute inset-0 bg-gradient-to-r ${styles.accent} opacity-20 transition-all duration-500`}></div>
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/5 to-transparent"></div>
      <div className={`absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-gradient-to-br ${styles.orb.primary} blur-3xl animate-pulse`}></div>
      <div className={`absolute -top-8 -left-8 w-32 h-32 rounded-full bg-gradient-to-br ${styles.orb.secondary} blur-2xl animate-pulse delay-700`}></div>
      <div className={`absolute top-4 right-4 w-16 h-16 border-2 ${styles.borderSecondary} rounded-full rotate-45 group-hover:rotate-90 transition-transform duration-700`}></div>
      <div className={`absolute bottom-8 left-8 w-8 h-8 bg-gradient-to-br ${styles.pattern.secondary} rounded-lg rotate-12 group-hover:rotate-45 transition-transform duration-500`}></div>
      <div className="container mx-auto px-4 py-8 text-center relative">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="relative">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${styles.accent} flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110`}>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
              <span className="text-white text-2xl relative">🎓</span>
            </div>
            <div className={`absolute -inset-1 bg-gradient-to-br ${styles.orb.primary} rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
          </div>
          <div>
            <p className={`text-2xl font-bold ${styles.textPrimary}`}>
              University Portal
            </p>
            <div className={`h-1 w-16 bg-gradient-to-r ${styles.accent} rounded-full mt-1 group-hover:w-24 transition-all duration-300`}></div>
          </div>
        </div>
        <p className={`font-medium mb-4 ${styles.textSecondary}`}>© 2025 University Portal. All rights reserved.</p>
        <div className="flex justify-center flex-wrap gap-x-6 gap-y-3">
          {[
            { text: 'Help Center', href: '#' },
            { text: 'Privacy Policy', href: '#' },
            { text: 'Terms of Service', href: '#' },
            { text: 'Contact Support', href: '#' },
          ].map((link, index) => (
            <a
              key={index}
              href={link.href}
              className={`group/link relative flex items-center space-x-2 ${styles.textSecondary} hover:${styles.textPrimary} transition-all duration-300`}
            >
              <span className="font-medium">{link.text}</span>
              <FaArrowRight
                className={`${styles.icon.primary} opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all duration-300`}
                size={12}
              />
              <div className={`absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r ${styles.accent} group-hover/link:w-full transition-all duration-300 rounded-full`}></div>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}