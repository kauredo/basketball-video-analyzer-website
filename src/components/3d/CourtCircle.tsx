import { useThree } from "@react-three/fiber";
import * as THREE from "three";

interface CourtCircleProps {
  isMobile?: boolean;
}

export function CourtCircle({ isMobile = false }: CourtCircleProps) {
  const { viewport } = useThree();

  const radius = 5; // Larger radius for portal effect
  const segments = 64; // More segments for smoother arcs
  const centerCircleRadius = 1;
  const dividerSpacing = 1.2; // Closer to edges

  if (isMobile) {
    // Mobile: arcs at top and bottom edges (portal effect)
    // Use smaller radius and different positioning for mobile
    const mobileRadius = 1.25; // Half the width for mobile
    const mobileCenterCircleRadius = 0.7;
    const topEdge = viewport.height / 2.2; // Move top arc down by half
    const bottomEdge = -viewport.height / 2.2;

    const topPoints = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI; // 0° to 180°
      const x = Math.cos(angle) * mobileRadius;
      const y = -Math.sin(angle) * mobileRadius + topEdge; // Negative to create U-shape opening down
      topPoints.push(new THREE.Vector3(x, y, 0.5));
    }

    const bottomPoints = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI; // 0° to 180° (bottom half opening up)
      const x = Math.cos(angle) * mobileRadius;
      const y = Math.sin(angle) * mobileRadius + bottomEdge;
      bottomPoints.push(new THREE.Vector3(x, y, 0.5));
    }

    // Center circle and line for mobile
    const centerCirclePoints = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2; // Full circle
      const x = Math.cos(angle) * mobileCenterCircleRadius;
      const y = Math.sin(angle) * mobileCenterCircleRadius;
      centerCirclePoints.push(new THREE.Vector3(x, y, 0));
    }

    // Center line points (horizontal for mobile)
    const centerLinePoints = [
      new THREE.Vector3(-viewport.width, 0, 0.5),
      new THREE.Vector3(viewport.width, 0, 0.5),
    ];

    // Mobile arcs
    const mobileArcs = (
      <>
        {/* Top arc */}
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array(topPoints.flatMap(p => [p.x, p.y, p.z])),
                3,
              ]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#000000" linewidth={3} />
        </line>

        {/* Bottom arc */}
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array(bottomPoints.flatMap(p => [p.x, p.y, p.z])),
                3,
              ]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#000000" linewidth={3} />
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
          <lineBasicMaterial color="#000000" linewidth={3} />
        </line>

        {/* Center line (horizontal on mobile) */}
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array(
                  centerLinePoints.flatMap(p => [p.x, p.y, p.z])
                ),
                3,
              ]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#000000" linewidth={3} />
        </line>
      </>
    );

    return mobileArcs;
  }

  // Desktop: arcs at left and right edges
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
        <lineBasicMaterial color="#000000" linewidth={4} />
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
        <lineBasicMaterial color="#000000" linewidth={4} />
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
        <lineBasicMaterial color="#000000" linewidth={4} />
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
        <lineBasicMaterial color="#000000" linewidth={4} />
      </line>
    </>
  );
}
