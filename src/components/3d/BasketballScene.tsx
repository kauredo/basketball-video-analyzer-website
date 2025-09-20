import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Basketball } from './Basketball';

interface BasketballSceneProps {
  className?: string;
  enableControls?: boolean;
  autoRotate?: boolean;
  size?: number;
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
    </div>
  );
}

function Scene({ enableControls = true, autoRotate = true, size = 1 }: Omit<BasketballSceneProps, 'className'>) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />

      {/* Basketball */}
      <Basketball
        interactive={enableControls}
        autoRotate={autoRotate}
        scale={size}
      />

      {/* Environment */}
      <Environment preset="studio" />

      {/* Ground shadow */}
      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />

      {/* Controls */}
      {enableControls && (
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
          autoRotate={false}
          autoRotateSpeed={0.5}
        />
      )}
    </>
  );
}

export function BasketballScene({
  className = "",
  enableControls = true,
  autoRotate = true,
  size = 1
}: BasketballSceneProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`basketball-scene ${className}`} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]}
        shadows
        gl={{ antialias: true, alpha: true }}
        onCreated={() => setIsLoaded(true)}
      >
        <Suspense fallback={null}>
          <Scene
            enableControls={enableControls}
            autoRotate={autoRotate}
            size={size}
          />
        </Suspense>
      </Canvas>

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent">
          <LoadingFallback />
        </div>
      )}
    </div>
  );
}