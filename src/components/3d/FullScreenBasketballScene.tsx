import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { ScrollBasketball } from "./ScrollBasketball";
import { CourtCircle } from "./CourtCircle";
import { WoodFloor } from "./WoodFloor";

interface ScrollBasketballProps {
  onLoaded?: () => void;
  isMobile?: boolean;
}

function Scene({ onLoaded, isMobile }: ScrollBasketballProps) {
  return (
    <>
      {/* Wooden court floor - render first */}
      <WoodFloor />
      {/* Court circle arcs - no rotation needed, handles mobile internally */}
      <CourtCircle isMobile={isMobile} />

      {/* Lighting setup for full scene */}
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        castShadow={false}
      />
      <pointLight position={[0, 0, 5]} intensity={0.6} />

      {/* Basketball with scroll animations - centered on mobile, right side on desktop */}
      <ScrollBasketball onLoaded={onLoaded} isMobile={isMobile} />

      {/* Environment and atmosphere */}
      <Environment preset="dawn" />

      {/* Fog for depth */}
      <fog attach="fog" args={["#fff4ed", 10, 50]} />
    </>
  );
}

interface FullScreenBasketballSceneProps {
  className?: string;
  onLoaded?: () => void;
}

export function FullScreenBasketballScene({
  className = "",
  onLoaded,
}: FullScreenBasketballSceneProps) {
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        window.innerWidth < 1024 || window.innerHeight > window.innerWidth;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLoaded = () => {
    setIsReady(true);
    if (onLoaded) onLoaded();
  };

  // Adjust camera for mobile (closer, more centered)
  const cameraConfig = isMobile
    ? { position: [0, 0, 4], fov: 75 }
    : { position: [0, 0, 5], fov: 70 };

  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <Canvas
        camera={{
          ...cameraConfig,
          near: 0.2,
          far: 100,
        }}
        dpr={[1, 1.5]}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
          premultipliedAlpha: false,
        }}
        style={{
          background: "transparent",
          pointerEvents: "none",
        }}
      >
        <Scene onLoaded={handleLoaded} isMobile={isMobile} />
      </Canvas>

      {/* Loading overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/20 to-primary-100/20 backdrop-blur-sm"></div>
    </div>
  );
}
