"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useApp } from '@/context/AppContext';
import { ArrowRight, Sparkles } from 'lucide-react';

const HeroScene: React.FC = () => {
  const { settings } = useApp();
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const elementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP Floating animation for background components
    const elements = elementsRef.current?.children;
    if (elements) {
      Array.from(elements).forEach((el, index) => {
        gsap.to(el, {
          y: 'random(-15, 15)',
          x: 'random(-10, 10)',
          rotation: 'random(-15, 15)',
          duration: `random(4, 7)`,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          delay: index * 0.5
        });
      });
    }

    // Parallax mouse effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const moveX = (clientX - innerWidth / 2) / innerWidth;
      const moveY = (clientY - innerHeight / 2) / innerHeight;

      if (elements) {
        Array.from(elements).forEach((el, index) => {
          const factor = (index + 1) * 15;
          gsap.to(el, {
            x: moveX * factor,
            y: moveY * factor,
            duration: 0.8,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeMouseMoveListener?.('mousemove', handleMouseMove) || window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToProducts = () => {
    const productsSec = document.getElementById('products');
    if (productsSec) {
      window.scrollTo({
        top: productsSec.offsetTop - 85,
        behavior: 'smooth'
      });
    }
  };

  const scrollToCustom = () => {
    const customSec = document.getElementById('custom-cake');
    if (customSec) {
      window.scrollTo({
        top: customSec.offsetTop - 85,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-[#FAF7F2] pt-20"
    >
      {/* Golden/Champagne Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(243,234,211,0.4)_0%,rgba(250,247,242,0)_70%)] pointer-events-none" />
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(223,186,115,0.08)_0%,transparent_70%)] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(197,168,128,0.08)_0%,transparent_70%)] rounded-full blur-2xl pointer-events-none" />

      {/* Floating Elements (GSAP Controlled for Mouse Parallax) */}
      <div ref={elementsRef} className="absolute inset-0 pointer-events-none hidden md:block z-10">
        {/* Strawberry Top Left */}
        <div className="absolute top-1/4 left-[10%] w-14 h-14 opacity-25">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-cocoa-500">
            <path d="M50 90C40 90 20 70 20 45C20 25 35 10 50 10C65 10 80 25 80 45C80 70 60 90 50 90Z" />
            <circle cx="40" cy="35" r="3" fill="#FAF7F2" />
            <circle cx="60" cy="35" r="3" fill="#FAF7F2" />
            <circle cx="50" cy="50" r="3" fill="#FAF7F2" />
            <circle cx="35" cy="55" r="3" fill="#FAF7F2" />
            <circle cx="65" cy="55" r="3" fill="#FAF7F2" />
            <circle cx="50" cy="70" r="3" fill="#FAF7F2" />
          </svg>
        </div>
        {/* Macaron Right Center */}
        <div className="absolute top-1/3 right-[8%] w-16 h-12 opacity-30">
          <div className="w-full h-4 bg-luxury-gold rounded-full" />
          <div className="w-[90%] h-1 bg-cream-dark mx-auto my-[2px] rounded-full" />
          <div className="w-full h-4 bg-luxury-gold rounded-full" />
        </div>
        {/* Wheat Stem Bottom Left */}
        <div className="absolute bottom-1/4 left-[8%] w-12 h-20 opacity-20">
          <svg viewBox="0 0 100 200" className="w-full h-full stroke-luxury-gold fill-none" strokeWidth="6">
            <path d="M50 200 Q50 100 70 20" />
            <path d="M50 140 Q30 120 20 130" />
            <path d="M50 140 Q70 120 80 130" />
            <path d="M50 100 Q30 80 20 90" />
            <path d="M50 100 Q70 80 80 90" />
            <path d="M50 60 Q30 40 20 50" />
            <path d="M50 60 Q70 40 80 50" />
          </svg>
        </div>
        {/* Sparkle Flower Top Right */}
        <div className="absolute top-1/4 right-[15%] w-8 h-8 text-luxury-gold opacity-40">
          <Sparkles className="w-full h-full animate-pulse" />
        </div>
        {/* Soft Dough Shape Bottom Right */}
        <div className="absolute bottom-1/3 right-[12%] w-10 h-10 bg-luxury-champagne rounded-full opacity-50 blur-[1px]" />
      </div>

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative py-12">
        {/* Text Content */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* Tag / Sparkle */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-luxury-gold/20 shadow-sm text-xs font-semibold text-cocoa-500 mb-6 uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5 text-luxury-gold animate-spin" style={{ animationDuration: '6s' }} />
            Artisanal Handcrafted Perfection
          </motion.div>

          {/* Luxury Brand Title */}
          <motion.h1
            ref={titleRef}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="heading-luxury text-4xl sm:text-5xl lg:text-6xl font-bold text-cocoa-900 leading-[1.1] mb-6"
          >
            {settings.heroTitle}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg text-cocoa-500 max-w-xl mb-10 font-normal leading-relaxed"
          >
            {settings.heroSubtitle}
          </motion.p>

          {/* CTA Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <button
              onClick={scrollToProducts}
              className="bg-gold-gradient hover:shadow-gold-glow hover:-translate-y-0.5 text-white px-8 py-4 rounded-xl font-medium shadow-premium flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 text-base"
            >
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={scrollToCustom}
              className="bg-white/80 hover:bg-white hover:shadow-premium hover:-translate-y-0.5 border border-cream-200 text-cocoa-900 px-8 py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 text-base"
            >
              Explore Cakes
            </button>
          </motion.div>

          {/* Stat counters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="grid grid-cols-3 gap-6 sm:gap-10 border-t border-cream-200 mt-12 pt-8 w-full max-w-md lg:max-w-none justify-center"
          >
            {[
              { number: '100%', label: 'Pure Veg' },
              { number: '15+', label: 'Flavor Stories' },
              { number: '5k+', label: 'Happy Celebrations' }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center lg:items-start">
                <span className="heading-luxury text-xl sm:text-2xl font-bold text-luxury-gold leading-none mb-1">
                  {stat.number}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-cocoa-500">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Cinematic Cake Scene (Right Hand Side) */}
        <div className="lg:col-span-6 relative flex items-center justify-center mt-6 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] lg:w-[450px] lg:w-[450px]"
          >
            {/* Spinning/pulsing golden back ring */}
            <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/10 to-luxury-goldlight/20 rounded-full blur-xl scale-105 animate-pulse" />
            <div className="absolute inset-4 rounded-full border-2 border-dashed border-luxury-gold/20 animate-spin" style={{ animationDuration: '60s' }} />

            {/* Premium product frame */}
            <div className="absolute inset-6 rounded-full overflow-hidden border-[6px] border-white shadow-premium bg-white">
              <Image
                src="/images/cake_birthday_1.png"
                alt="Cinematic Cake Story"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 450px"
                className="object-cover hover:scale-105 transition-transform duration-700 pointer-events-none scale-102"
                priority
              />

              {/* Decorative Cinematic Layer (Soft overlay simulating cake frosting prep) */}
              <div className="absolute inset-0 bg-gradient-to-t from-cocoa-900/40 via-transparent to-transparent opacity-60" />
            </div>

            {/* Small Floating Details */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -top-2 right-[10%] bg-white py-2 px-3 rounded-xl shadow-premium border border-cream-100 flex items-center gap-1.5 z-20"
            >
              <span className="heading-luxury text-sm font-bold text-luxury-gold">100% Handcrafted</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1.5 }}
              className="absolute -bottom-2 left-[15%] bg-white py-2 px-3.5 rounded-xl shadow-premium border border-cream-100 flex items-center gap-2 z-20"
            >
              <div className="w-2.5 h-2.5 bg-green-600 rounded-full border-2 border-white ring-2 ring-green-600/30" />
              <span className="text-xs font-bold text-cocoa-900 tracking-wide uppercase">Eggless Cake</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Dripping Chocolate SVG at the bottom edge */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 rotate-180 translate-y-[2px]">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[30px] sm:h-[45px] fill-cream-50"
        >
          {/* Custom SVG path showing liquid curves of dripping cream/chocolate */}
          <path d="M0,0 C150,90 350,-40 500,45 C650,130 850,-40 1000,50 C1100,95 1150,40 1200,0 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </section>
  );
};

export default HeroScene;
