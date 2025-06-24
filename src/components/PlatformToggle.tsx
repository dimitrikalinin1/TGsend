"use client";

import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const PlatformToggle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isInstagram = location.pathname.startsWith('/instagram');

  const handleToggle = () => {
    if (isInstagram) {
      navigate('/');
    } else {
      navigate('/instagram');
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <span className={`text-sm font-medium transition-colors duration-300 ${
        !isInstagram ? 'text-telegram-600' : 'text-ios-gray-500'
      }`}>
        Telegram
      </span>
      
      <button
        onClick={handleToggle}
        className="relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-ios-blue focus:ring-offset-2"
        style={{
          background: isInstagram 
            ? 'linear-gradient(135deg, #E91E63, #F06292)' 
            : 'linear-gradient(135deg, #2196F3, #64B5F6)'
        }}
      >
        <span className="sr-only">Toggle platform</span>
        <motion.span
          className="inline-block h-6 w-6 rounded-full bg-white shadow-lg"
          animate={{
            x: isInstagram ? 36 : 4,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
          style={{
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        />
        
        {/* Icons */}
        <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
          <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
          </svg>
          <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </div>
      </button>
      
      <span className={`text-sm font-medium transition-colors duration-300 ${
        isInstagram ? 'text-instagram-600' : 'text-ios-gray-500'
      }`}>
        Instagram
      </span>
    </div>
  );
};

export default PlatformToggle;