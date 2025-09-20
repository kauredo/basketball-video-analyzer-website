import { lazy, Suspense, useState, useEffect } from 'react';

// Lazy load the 3D scene for better performance
const BasketballScene = lazy(() =>
  import('./BasketballScene').then(module => ({ default: module.BasketballScene }))
);

interface Basketball3DProps {
  className?: string;
  fallbackClassName?: string;
  enableControls?: boolean;
  autoRotate?: boolean;
  size?: number;
  showFallbackOnMobile?: boolean;
}

function StaticFallback({ className }: { className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center w-20 h-20 bg-primary-500 rounded-full basketball-icon ${className}`}>
      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    </div>
  );
}

function LoadingFallback({ className }: { className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center w-20 h-20 ${className}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
    </div>
  );
}

export function Basketball3D({
  className = "",
  fallbackClassName = "",
  enableControls = true,
  autoRotate = true,
  size = 1,
  showFallbackOnMobile = true
}: Basketball3DProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };

    // Check WebGL support
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        setWebGLSupported(!!gl);
      } catch (e) {
        setWebGLSupported(false);
      }
    };

    checkMobile();
    checkWebGL();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show fallback on mobile or if WebGL not supported
  if ((isMobile && showFallbackOnMobile) || !webGLSupported) {
    return <StaticFallback className={fallbackClassName} />;
  }

  return (
    <div className={`basketball-3d-container ${className}`} style={{ width: '80px', height: '80px' }}>
      <Suspense fallback={<LoadingFallback className={fallbackClassName} />}>
        <BasketballScene
          className="w-full h-full"
          enableControls={enableControls}
          autoRotate={autoRotate}
          size={size}
        />
      </Suspense>
    </div>
  );
}