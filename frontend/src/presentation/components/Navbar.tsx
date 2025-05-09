import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
  layoutType?: 'public' | 'ug';
}

export const Navbar: React.FC<NavbarProps> = ({ layoutType = 'public' }) => {
  const location = useLocation();
  
  // Define the links based on layout type
  let links;
  if (layoutType === 'ug') {
    links = [
      { label: "Home", href: "/ug" },
      { label: "Admissions", href: "/ug/admissions" },
      { label: "Programmes", href: "/ug/programmes" },
      { label: "Scholarships", href: "/ug/scholarships" },
      { label: "Why VAGO", href: "/ug/why-vago" },
      { label: "Contact", href: "/ug/contact" }
    ];
  } else {
    links = [
      { label: "Home", href: "/" },
      { label: "Admissions", href: "/admissions" },
      { label: "Education", href: "/education" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" }
    ];
  }

  return (
    <nav className="bg-white px-6 py-2 shadow border-t-4 border-cyan-300 z-10 relative">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex-1 flex justify-center">
          <ul className="flex gap-10 list-none">
            {links.map(link => {
              const isActive = location.pathname === link.href || 
                (link.href === "/ug" && location.pathname === "/ug/") ||
                (link.href === "/" && location.pathname === "/");
                
              return (
                <li key={link.label} className="relative flex items-center">
                  <Link
                    to={link.href}
                    className={`text-cyan-800 font-semibold text-base px-2 py-1 transition-colors duration-200 
                      ${isActive ? "text-cyan-500" : "hover:text-cyan-600"} 
                      after:content-[''] after:block after:h-0.5 after:bg-gradient-to-r after:from-cyan-400 after:to-blue-400 
                      ${isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"} 
                      after:transition-transform after:duration-300 after:origin-left`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex items-center ml-8">
          <input
            type="text"
            placeholder="Search..."
            className="border border-cyan-200 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-200"
          />
          <button
            type="button"
            className="ml-2 px-3 py-1 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition"
          >
            Search
          </button>
        </div>
      </div>
    </nav>
  );
};