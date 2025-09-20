import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { Basketball } from "./Basketball";
import * as THREE from "three";

interface ScrollBasketballProps {
  onLoaded?: () => void;
}

function ScrollBasketball({ onLoaded }: ScrollBasketballProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [scrollY, setScrollY] = useState(0);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);

  // Fixed position with random rotation only
  const [randomOffset] = useState(() => ({
    x: 2.5, // Fixed position on right side
    y: 0, // Fixed at center height
    rotationX: Math.random() * Math.PI * 2,
    rotationY: Math.random() * Math.PI * 2,
    rotationZ: Math.random() * Math.PI * 2,
  }));

  // Initial bounce-in animation
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const elapsed = state.clock.elapsedTime;

    if (!hasAnimatedIn && elapsed > 0.5) {
      // Bounce-in animation for first 2 seconds
      if (elapsed < 2.5) {
        const progress = (elapsed - 0.5) / 2;
        const bounceHeight =
          Math.abs(Math.sin(progress * Math.PI * 3)) * (1 - progress) * 4;
        meshRef.current.position.x = randomOffset.x;
        meshRef.current.position.y = bounceHeight + randomOffset.y;

        // Initial random rotation plus bounce rotation
        meshRef.current.rotation.x = randomOffset.rotationX;
        meshRef.current.rotation.y = randomOffset.rotationY;
        meshRef.current.rotation.z =
          randomOffset.rotationZ + Math.sin(progress * Math.PI * 2) * 0.2;
      } else {
        // Smooth transition to final position
        meshRef.current.position.x = randomOffset.x;
        meshRef.current.position.y = randomOffset.y;
        meshRef.current.rotation.x = randomOffset.rotationX;
        meshRef.current.rotation.y = randomOffset.rotationY;
        meshRef.current.rotation.z = randomOffset.rotationZ;
        setHasAnimatedIn(true);
        if (onLoaded) onLoaded();
      }
    }

    if (hasAnimatedIn) {
      // Only scroll-based rolling animation (no random rotation changes)
      const scrollRotation = scrollY * 0.01;
      meshRef.current.rotation.x = randomOffset.rotationX + scrollRotation;

      // Keep Y and Z rotations stable at their random values
      meshRef.current.rotation.y = randomOffset.rotationY;
      meshRef.current.rotation.z = randomOffset.rotationZ;

      // Keep Y position stable (no floating)
      meshRef.current.position.y = randomOffset.y;

      // Keep X position stable at random starting position
      meshRef.current.position.x = randomOffset.x;
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      <Basketball interactive={false} autoRotate={false} scale={0.016} />
    </group>
  );
}

function CourtCircle() {
  const { viewport } = useThree();

  const radius = 4;
  const segments = 32;
  const centerCircleRadius = 1;
  const dividerSpacing = 1.45;

  // Position arcs at the very edges of the viewport
  const leftEdge = -viewport.width / dividerSpacing;
  const rightEdge = viewport.width / dividerSpacing;

  // Left arc points (right half of circle, positioned at left edge)
  const leftPoints = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI - Math.PI / 2; // -90° to +90°
    const x = Math.cos(angle) * radius + leftEdge;
    const y = Math.sin(angle) * radius;
    leftPoints.push(new THREE.Vector3(x, y, -2));
  }

  // Right arc points (left half of circle, positioned at right edge)
  const rightPoints = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI + Math.PI / 2; // +90° to +270°
    const x = Math.cos(angle) * radius + rightEdge;
    const y = Math.sin(angle) * radius;
    rightPoints.push(new THREE.Vector3(x, y, -2));
  }

  // Center circle points
  const centerCirclePoints = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2; // Full circle
    const x = Math.cos(angle) * centerCircleRadius;
    const y = Math.sin(angle) * centerCircleRadius;
    centerCirclePoints.push(new THREE.Vector3(x, y, -2));
  }

  // Center line points (vertical)
  const centerLinePoints = [
    new THREE.Vector3(0, -viewport.height, -2),
    new THREE.Vector3(0, viewport.height, -2),
  ];

  return (
    <>
      {/* Left arc */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(leftPoints.flatMap(p => [p.x, p.y, p.z])),
              3,
            ]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#000000" linewidth={2} />
      </line>

      {/* Right arc */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(rightPoints.flatMap(p => [p.x, p.y, p.z])),
              3,
            ]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#000000" linewidth={2} />
      </line>

      {/* Center circle */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(
                centerCirclePoints.flatMap(p => [p.x, p.y, p.z])
              ),
              3,
            ]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#000000" linewidth={2} />
      </line>

      {/* Center line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(centerLinePoints.flatMap(p => [p.x, p.y, p.z])),
              3,
            ]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#000000" linewidth={2} />
      </line>
    </>
  );
}

function WoodFloor() {
  const { viewport } = useThree();

  return (
    <>
      {/* Main wood floor - positioned behind everything */}
      <mesh position={[0, 0, -5]} rotation={[0, 0, 0]}>
        <planeGeometry args={[viewport.width * 3, viewport.height * 3]} />
        <meshStandardMaterial
          color="#D2691E"
          roughness={0.8}
          metalness={0.05}
          transparent={true}
          opacity={0.8}
        />
      </mesh>

      {/* Wood grain overlay */}
      <mesh position={[0, 0, -4.9]} rotation={[0, 0, 0]}>
        <planeGeometry args={[viewport.width * 3, viewport.height * 3]} />
        <meshBasicMaterial color="#8B4513" transparent={true} opacity={0.3} />
      </mesh>
    </>
  );
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

      {/* Ground shadows */}
      <ContactShadows
        position={[0, -5, 0]}
        opacity={0.3}
        scale={30}
        blur={2}
        far={20}
        color="#d4a574"
      />

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
