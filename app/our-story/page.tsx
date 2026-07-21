"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const images = [
  '/our_story/080b665f-77dc-4198-b5d2-354c693b4f62.jfif',
  '/our_story/6c362521-d630-4fbd-915f-0e1127974709.jfif',
  '/our_story/be335422-5e9f-4bf1-be7c-6e0c2a6d5583.jfif',
  '/our_story/d71eee3f-cdb0-4e05-8a17-d17fc3c676c9.jfif',
  '/our_story/f7d59714-f005-4360-81a7-cb294ac320ff.jfif',
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function OurStoryPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream-50 pt-32 pb-20 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-cocoa-500 hover:text-luxury-gold transition-colors text-sm font-bold mb-8 uppercase tracking-wider relative z-10">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="bg-white rounded-3xl shadow-premium border border-cream-200 overflow-hidden relative">
            
            {/* Header Area */}
            <div className="bg-cocoa-900 px-8 py-16 sm:px-16 sm:py-24 text-center relative overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-luxury-gold blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-luxury-gold blur-3xl" />
              </div>

              <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="relative z-10">
                <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-luxury-gold font-bold mb-4 block">The Journey</span>
                <h1 className="heading-luxury text-3xl sm:text-5xl text-cream-50 mb-6 leading-tight">
                  From College Cravings to 10 Years of Celebrations
                </h1>
                <div className="w-24 h-[2px] bg-luxury-gold mx-auto" />
              </motion.div>
            </div>

            <div className="px-8 py-12 sm:px-16 sm:py-20 text-cocoa-700">
              <motion.div 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="space-y-8 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto font-medium"
              >
                <motion.p variants={fadeInUp}>
                  <span className="text-3xl sm:text-4xl text-luxury-gold font-serif mr-1">I</span>t all started in college. Every birthday, every small win, every occasion had to end with one thing - cake and pastry 🎂
                </motion.p>
                
                <motion.p variants={fadeInUp}>
                  That love for celebration turned into curiosity. I started understanding what people really wanted. What made them smile. What made them come back for more.
                </motion.p>

                <motion.div variants={fadeInUp} className="pl-6 border-l-2 border-luxury-gold py-2 my-10 bg-cream-50/50 rounded-r-xl pr-4">
                  <p className="italic text-cocoa-900 font-semibold text-lg">
                    "First, I ran a franchise. Learned the ropes. Served hundreds of smiles.<br/>
                    Then came the leap - my own kitchen, my own rules."
                  </p>
                </motion.div>

                <motion.p variants={fadeInUp}>
                  <strong>10 years ago</strong>, Breads & Cake Story was born in Bharati Vidyapeeth, Pune-46.<br/>
                  Since day 1, the mission has been simple:<br/>
                  <span className="text-cocoa-900 font-bold block mt-3 text-xl">Good taste. Good ingredients. Prices everyone can afford.</span>
                </motion.p>

                <motion.p variants={fadeInUp}>
                  We don’t just bake. <strong className="text-luxury-gold">We bake memories.</strong><br/>
                  That’s why you keep coming back. That’s why we keep pushing to give our best, every single time.
                </motion.p>
              </motion.div>

              {/* Photo Gallery & BNI Section */}
              <motion.div 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
                className="mt-20 pt-16 border-t border-cream-200"
              >
                <div className="text-center mb-12">
                  <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold mb-2 block">Community & Growth</span>
                  <h2 className="heading-luxury text-3xl text-cocoa-900">Networking & Seminars</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
                  {images.map((src, index) => (
                    <motion.div 
                      key={index} 
                      variants={fadeInUp}
                      whileHover={{ scale: 1.02 }}
                      className={`relative rounded-xl overflow-hidden shadow-md group ${index === 0 ? 'md:col-span-2 lg:col-span-2 h-64 sm:h-80' : 'h-64 sm:h-80'}`}
                    >
                      <Image 
                        src={src} 
                        alt="Breads and CakeStory Seminar and Journey" 
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-cocoa-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  ))}
                </div>

                <motion.div variants={fadeInUp} className="bg-cocoa-900 text-cream-50 rounded-2xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/10 rounded-full blur-2xl pointer-events-none" />
                  <p className="text-sm sm:text-base leading-relaxed relative z-10 font-light">
                    As our journey progressed, connecting with fellow entrepreneurs became vital. Our active involvement in <strong className="text-luxury-gold font-bold">BNI (Business Network International)</strong> has allowed us to share our vision at various seminars, build lasting professional relationships, and continuously evolve. The support of this incredible network has been a cornerstone in helping Breads & CakeStory reach new heights, expand our vision, and serve our community better.
                  </p>
                </motion.div>
              </motion.div>

              {/* Footer CTA */}
              <motion.div 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }}
                variants={fadeInUp}
                className="mt-20 text-center bg-cream-50 p-8 sm:p-12 rounded-2xl border border-cream-200"
              >
                <h3 className="heading-luxury text-2xl text-cocoa-900 mb-4">Let us make your next occasion simple, delicious, and unforgettable.</h3>
                
                <div className="w-16 h-[2px] bg-luxury-gold mx-auto my-8" />
                
                <p className="uppercase tracking-widest text-xs font-bold text-cocoa-500 mb-2">For Orders & Franchise Enquiries</p>
                <p className="text-xl font-bold text-cocoa-900 mb-8">Let’s build something sweet together.</p>
                
                <div className="inline-block text-left border-l-4 border-luxury-gold pl-4">
                  <p className="font-bold text-cocoa-900 uppercase tracking-wider text-sm">Team Breads & Cake Story</p>
                  <p className="text-cocoa-500 font-medium italic">— Vikrant Pravin Gujar</p>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
}
