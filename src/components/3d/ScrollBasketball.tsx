import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Basketball } from "./Basketball";
import * as THREE from "three";

interface ScrollBasketballProps {
  onLoaded?: () => void;
  isMobile?: boolean;
}

export function ScrollBasketball({
  onLoaded,
  isMobile = false,
}: ScrollBasketballProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [scrollY, setScrollY] = useState(0);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);

  // Position based on device type
  const [randomOffset] = useState(() => ({
    x: isMobile ? 1.5 : 2.5,
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

  // Scale based on device type
  const scale = isMobile ? 0.012 : 0.016; // smaller on mobile

  return (
    <group ref={meshRef} position={[randomOffset.x, randomOffset.y, 0]}>
      <Basketball interactive={false} autoRotate={false} scale={scale} />
    </group>
  );
}
