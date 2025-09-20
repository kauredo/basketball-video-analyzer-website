import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface BasketballProps {
  interactive?: boolean;
  autoRotate?: boolean;
  scale?: number;
}

export function Basketball({
  interactive = true,
  autoRotate = true,
  scale = 1,
}: BasketballProps) {
  const { scene } = useGLTF("/models/basketball.glb");
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Auto rotation
  useFrame((state, delta) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += delta * 0.5;
    }

    // Floating animation only if autoRotate is enabled
    if (groupRef.current && autoRotate) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  // Mouse interaction
  const handlePointerOver = () => {
    if (interactive && meshRef.current) {
      document.body.style.cursor = "pointer";
    }
  };

  const handlePointerOut = () => {
    if (interactive) {
      document.body.style.cursor = "default";
    }
  };

  const handleClick = () => {
    if (interactive && meshRef.current) {
      // Add a little spin on click
      meshRef.current.rotation.x += Math.PI * 0.1;
    }
  };

  return (
    <group ref={groupRef} scale={scale}>
      <primitive
        ref={meshRef}
        object={scene.clone()}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />
    </group>
  );
}

useGLTF.preload("/models/basketball.glb");
