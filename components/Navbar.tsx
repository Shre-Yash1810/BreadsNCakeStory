"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onCartOpen: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCartOpen }) => {
  const { cart, settings } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'glass-navbar py-3 shadow-premium'
            : 'bg-transparent py-5 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo Section */}
          <a
            href="#"
            onClick={(e) => handleNavClick(e, 'hero')}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="relative w-12 h-12 bg-white rounded-full p-1 overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-105">
              <Image
                src={settings.logoUrl || '/logo.png'}
                alt={settings.bakeryName}
                fill
                sizes="48px"
                className="object-contain p-1"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="heading-luxury text-lg sm:text-xl font-bold tracking-tight text-cocoa-900 leading-tight">
                {settings.bakeryName}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-semibold leading-none">
                Boutique Patisserie
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: 'Home', id: 'hero' },
              { label: 'Cakes', id: 'products' },
              { label: 'Custom Cakes', id: 'custom-cake' },
              { label: 'Gallery', id: 'gallery' },
              { label: 'Contact', id: 'contact' }
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className="text-sm font-medium text-cocoa-500 hover:text-luxury-gold transition-colors duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-luxury-gold after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onCartOpen}
              className="relative p-2.5 rounded-full hover:bg-cream-100 transition-colors duration-300 group"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5 text-cocoa-900 transition-transform duration-300 group-hover:scale-110" />
              <AnimatePresence>
                {cartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-luxury-gold text-white font-sans text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-gold-glow"
                  >
                    {cartItemsCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-full hover:bg-cream-100 transition-colors duration-300"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-cocoa-900" />
              ) : (
                <Menu className="w-5 h-5 text-cocoa-900" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-0 right-0 z-30 bg-cream-50/95 backdrop-blur-md shadow-premium border-b border-cream-200 md:hidden overflow-hidden"
          >
            <nav className="flex flex-col px-6 py-6 gap-5">
              {[
                { label: 'Home', id: 'hero' },
                { label: 'Cakes Catalog', id: 'products' },
                { label: 'Custom Cakes', id: 'custom-cake' },
                { label: 'Gallery Showcase', id: 'gallery' },
                { label: 'Contact Us', id: 'contact' }
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className="heading-luxury text-lg text-cocoa-900 hover:text-luxury-gold transition-colors duration-300 font-semibold py-1 border-b border-cream-100"
                >
                  {item.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onCartOpen();
                }}
                className="mt-2 bg-gold-gradient hover:opacity-90 text-white py-3 rounded-xl font-medium shadow-gold-glow flex items-center justify-center gap-2 transition-all duration-300 active:scale-95"
              >
                <ShoppingBag className="w-5 h-5" />
                View Cart ({cartItemsCount})
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
