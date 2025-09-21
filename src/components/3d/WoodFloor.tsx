import { useThree } from "@react-three/fiber";

export function WoodFloor() {
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