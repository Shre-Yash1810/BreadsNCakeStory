'use client';

import React from 'react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-4 text-center font-sans">
      <h2 className="heading-luxury text-3xl font-bold text-[#2E1C1A] mb-2">An Oven Error Occurred</h2>
      <p className="text-sm text-[#3E2723] mb-6">Our baking engines hit a minor glitch. Let\'s try resetting.</p>
      <button
        onClick={() => reset()}
        className="bg-gold-gradient text-white px-6 py-2.5 rounded-xl font-bold shadow-md"
      >
        Try Again
      </button>
    </div>
  );
}
