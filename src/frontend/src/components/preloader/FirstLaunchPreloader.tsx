import { useEffect, useState } from 'react';

interface FirstLaunchPreloaderProps {
  onComplete: () => void;
}

export default function FirstLaunchPreloader({ onComplete }: FirstLaunchPreloaderProps) {
  const [step, setStep] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Step 0: Show first Z (0-1s)
    const timer1 = setTimeout(() => setStep(1), 1000);
    // Step 1: Show I (1-2s)
    const timer2 = setTimeout(() => setStep(2), 2000);
    // Step 2: Show second Z (2-3s)
    const timer3 = setTimeout(() => setStep(3), 3000);
    // Step 3: Show O (3-4s)
    const timer4 = setTimeout(() => setStep(4), 4000);
    // Hold complete logo (4-5.5s)
    const timer5 = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 500);
    }, 5500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onComplete]);

  return (
    <div
      className={`preloader-screen ${fadeOut ? 'preloader-fade-out' : ''}`}
    >
      <div className="preloader-content">
        <div className="preloader-logo-container">
          {/* Base logo - always present but clipped */}
          <img
            src="/assets/generated/zizo-preloader-logo.dim_512x512.png"
            alt="ZIZO Logo"
            className={`preloader-logo preloader-logo-step-${step}`}
          />
        </div>
      </div>
    </div>
  );
}
