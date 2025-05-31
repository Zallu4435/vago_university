import { FaArrowRight } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-amber-200/50 z-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0.06)]">
      {/* Enhanced background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-white/90"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-orange-100/20 to-amber-100/20 group-hover:from-orange-100/40 group-hover:to-amber-100/40 transition-all duration-500"></div>

      {/* Top shadow gradient */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/5 to-transparent"></div>

      {/* Floating animated orbs */}
      <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-300/30 blur-3xl animate-pulse"></div>
      <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-gradient-to-br from-amber-200/20 to-orange-200/20 blur-2xl animate-pulse delay-700"></div>

      {/* Geometric patterns */}
      <div className="absolute top-4 right-4 w-16 h-16 border-2 border-orange-200/30 rounded-full rotate-45 group-hover:rotate-90 transition-transform duration-700"></div>
      <div className="absolute bottom-8 left-8 w-8 h-8 bg-gradient-to-br from-amber-300/20 to-orange-300/20 rounded-lg rotate-12 group-hover:rotate-45 transition-transform duration-500"></div>

      <div className="container mx-auto px-4 py-8 text-center relative z-10">
        {/* Enhanced footer content */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
              <span className="text-white text-2xl relative z-10">🎓</span>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-orange-400/30 to-amber-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div>
            <p className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
              University Portal
            </p>
            <div className="h-1 w-16 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mt-1 group-hover:w-24 transition-all duration-300"></div>
          </div>
        </div>

        <p className="text-gray-700 font-medium mb-4">© 2025 University Portal. All rights reserved.</p>

        {/* Enhanced footer links */}
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
              className="group/link relative flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-all duration-300"
            >
              <span className="font-medium">{link.text}</span>
              <FaArrowRight
                className="text-orange-400 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all duration-300"
                size={12}
              />
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-orange-400 to-amber-500 group-hover/link:w-full transition-all duration-300 rounded-full"></div>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}