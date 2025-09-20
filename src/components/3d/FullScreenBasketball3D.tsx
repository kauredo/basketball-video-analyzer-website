import { lazy, Suspense, useState, useEffect } from "react";

// Lazy load the 3D scene for performance
const FullScreenBasketballScene = lazy(() =>
  import("./FullScreenBasketballScene").then(module => ({
    default: module.FullScreenBasketballScene,
  }))
);

interface FullScreenBasketball3DProps {
  className?: string;
  enableOnMobile?: boolean;
  onLoaded?: () => void;
}

function MobileFallback() {
  return (
    <div className="fixed inset-0 -z-10 hero-gradient">
      <div className="absolute inset-0 court-bg"></div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="fixed inset-0 -z-10 hero-gradient">
      <div className="absolute inset-0 court-bg"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    </div>
  );
}

export function FullScreenBasketball3D({
  className = "",
  enableOnMobile = false,
  onLoaded,
}: FullScreenBasketball3DProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [lowPerformance, setLowPerformance] = useState(false);

  useEffect(() => {
    // Check device capabilities
    const checkCapabilities = () => {
      // Mobile detection
      const mobile =
        window.innerWidth < 1024 ||
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobile(mobile);

      // WebGL support
      try {
        const canvas = document.createElement("canvas");
        const gl =
          canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        setWebGLSupported(!!gl);
      } catch (e) {
        setWebGLSupported(false);
      }

      // Performance detection
      const connection = (navigator as any).connection;
      const isSlowConnection =
        connection &&
        (connection.effectiveType === "slow-2g" ||
          connection.effectiveType === "2g");
      const isLowMemory =
        (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;

      setLowPerformance(isSlowConnection || isLowMemory);
    };

    checkCapabilities();
    window.addEventListener("resize", checkCapabilities);
    return () => window.removeEventListener("resize", checkCapabilities);
  }, []);

  // Use mobile fallback if needed
  if ((isMobile && !enableOnMobile) || !webGLSupported || lowPerformance) {
    return <MobileFallback />;
  }

  return (
    <div className={`fullscreen-basketball ${className}`}>
      <Suspense fallback={<LoadingFallback />}>
        <FullScreenBasketballScene
          className="w-full h-full"
          onLoaded={onLoaded}
        />
      </Suspense>
    </div>
  );
}
