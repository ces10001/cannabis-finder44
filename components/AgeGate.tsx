'use client';

import { useState, useEffect } from 'react';

export function AgeGate() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const verified = localStorage.getItem('age-verified');
    if (!verified) {
      setShow(true);
    }
  }, []);

  const handleVerify = () => {
    localStorage.setItem('age-verified', 'true');
    setShow(false);
  };

  if (!mounted || !show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="glass rounded-2xl p-8 max-w-md mx-4 text-center">
        <div className="text-6xl mb-4">🌿</div>
        <h2 className="text-2xl font-bold mb-2">Age Verification</h2>
        <p className="text-gray-300 mb-6">
          You must be 21 years or older to view this content.
        </p>
        <button
          onClick={handleVerify}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          I'm 21+
        </button>
      </div>
    </div>
  );
}
