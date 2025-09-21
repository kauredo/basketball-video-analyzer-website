import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export function CourtCircle() {
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