// The scene is the hero's backdrop and stops at the hero's bottom edge.
// It used to be fixed inset-0, which made it a layer over the whole document:
// every section below had to paint an opaque ground or render its body copy on
// top of the basketball, and one that forgot did exactly that. Absolute inside
// the hero, which is position: relative, confines it to the one band it
// belongs to and takes that rule away.
import { lazy, Suspense, useState, useEffect } from "react";

// Lazy load the 3D scene for performance
const HeroBasketballScene = lazy(() =>
  import("./HeroBasketballScene").then(module => ({
    default: module.HeroBasketballScene,
  }))
);

interface HeroBasketball3DProps {
  className?: string;
  enableOnMobile?: boolean;
  onLoaded?: () => void;
}

function MobileFallback() {
  return (
    <div className="absolute inset-0 z-0 hero-gradient">
      <div className="absolute inset-0 court-bg"></div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 z-0 hero-gradient">
      <div className="absolute inset-0 court-bg"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    </div>
  );
}

export function HeroBasketball3D({
  className = "",
  enableOnMobile = false,
  onLoaded,
}: HeroBasketball3DProps) {
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
        <HeroBasketballScene
          className="w-full h-full"
          onLoaded={onLoaded}
        />
      </Suspense>
    </div>
  );
}
