import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { ScrollBasketball } from "./ScrollBasketball";
import { CourtCircle } from "./CourtCircle";
import { WoodFloor } from "./WoodFloor";

interface ScrollBasketballProps {
  onLoaded?: () => void;
}

function Scene({ onLoaded }: ScrollBasketballProps) {
  return (
    <>
      {/* Wooden court floor - render first */}
      <WoodFloor />

      {/* Lighting setup for full scene */}
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        castShadow={false}
      />
      <pointLight position={[0, 0, 5]} intensity={0.6} />

      {/* Court circle arcs */}
      <CourtCircle />

      {/* Basketball with scroll animations */}
      <ScrollBasketball onLoaded={onLoaded} />

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

  const handleLoaded = () => {
    setIsReady(true);
    if (onLoaded) onLoaded();
  };

  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 70,
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
        <Scene onLoaded={handleLoaded} />
      </Canvas>

      {/* Loading overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/20 to-primary-100/20 backdrop-blur-sm"></div>
    </div>
  );
}
