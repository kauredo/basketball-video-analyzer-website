import { useMemo } from "react";
import { useThree } from "@react-three/fiber";

interface CourtCircleProps {
  isMobile?: boolean;
}

function buildArc(
  segments: number,
  radius: number,
  angleStart: number,
  angleEnd: number,
  offsetX: number,
  offsetY: number,
  z: number,
  flipY = false
): Float32Array {
  const arr = new Float32Array((segments + 1) * 3);
  for (let i = 0; i <= segments; i++) {
    const angle = angleStart + (i / segments) * (angleEnd - angleStart);
    const idx = i * 3;
    arr[idx] = Math.cos(angle) * radius + offsetX;
    arr[idx + 1] = (flipY ? -1 : 1) * Math.sin(angle) * radius + offsetY;
    arr[idx + 2] = z;
  }
  return arr;
}

export function CourtCircle({ isMobile = false }: CourtCircleProps) {
  const { viewport } = useThree();

  const segments = 64;

  const geometry = useMemo(() => {
    if (isMobile) {
      // Camera is at z=4 for mobile. Original arcs were at z=0.5 (distance 3.5).
      // At z=-2 (distance 6), scale by 6/3.5 to maintain apparent size.
      const s = 6 / 3.5;
      const mobileRadius = 1.25 * s;
      const mobileCenterCircleRadius = 0.7 * s;
      const topEdge = (viewport.height / 2.5) * s;
      const bottomEdge = (-viewport.height / 2.2) * s;

      return {
        arcs: [
          buildArc(segments, mobileRadius, 0, Math.PI, 0, topEdge, -2, true),
          buildArc(segments, mobileRadius, 0, Math.PI, 0, bottomEdge, -2),
          buildArc(segments, mobileCenterCircleRadius, 0, Math.PI * 2, 0, 0, -2),
        ],
        centerLine: new Float32Array([-viewport.width * 3, 0, -2, viewport.width * 3, 0, -2]),
        lineWidth: 3,
      };
    }

    const radius = 5;
    const centerCircleRadius = 1;
    const dividerSpacing = 1.2;
    const leftEdge = -viewport.width / dividerSpacing;
    const rightEdge = viewport.width / dividerSpacing;

    return {
      arcs: [
        buildArc(segments, radius, -Math.PI / 2, Math.PI / 2, leftEdge, 0, -2),
        buildArc(segments, radius, Math.PI / 2, (3 * Math.PI) / 2, rightEdge, 0, -2),
        buildArc(segments, centerCircleRadius, 0, Math.PI * 2, 0, 0, -2),
      ],
      centerLine: new Float32Array([0, -viewport.height * 2, -2, 0, viewport.height * 2, -2]),
      lineWidth: 4,
    };
  }, [isMobile, viewport.width, viewport.height]);

  return (
    <>
      {geometry.arcs.map((positions, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color="#000000" linewidth={geometry.lineWidth} />
        </line>
      ))}
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[geometry.centerLine, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#000000" linewidth={geometry.lineWidth} />
      </line>
    </>
  );
}
