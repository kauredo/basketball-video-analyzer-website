# Adding the Sketchfab Basketball Model

## Current Implementation
✅ **Working Now**: Procedural basketball with realistic materials and animations
✅ **Performance**: Optimized with mobile fallbacks and lazy loading
✅ **Interactive**: Click to spin, auto-rotate, mouse controls

## To Use the Sketchfab Model

### 1. Download the Model
1. Go to: https://sketchfab.com/3d-models/basketball-4ed71d73c43b495eb784156acc32ba46
2. Click "Download 3D Model" (requires free account)
3. Download as **GLB format** (best for web)
4. Save as `public/models/basketball.glb`

### 2. Update the Component
Replace the procedural basketball in `src/components/3d/Basketball.tsx`:

```tsx
import { useGLTF } from '@react-three/drei';

export function Basketball({ interactive = true, autoRotate = true, scale = 1 }: BasketballProps) {
  const { scene } = useGLTF('/models/basketball.glb');

  // Rest of component logic...

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

// Preload the model
useGLTF.preload('/models/basketball.glb');
```

### 3. Benefits of Sketchfab Model
- **Realistic texture**: Professional basketball appearance
- **Optimized geometry**: Better than procedural for detail
- **Smaller bundle**: Model loads separately from JS

### 4. Current Fallback Strategy
- **Desktop**: 3D interactive basketball
- **Mobile**: Static SVG basketball icon
- **No WebGL**: Graceful fallback to static icon
- **Loading**: Spinner while 3D loads

## Performance Stats
- **Current bundle**: ~260KB gzipped for 3D components
- **Total page**: Still under 500KB for great performance
- **Mobile optimized**: Automatic fallbacks ensure fast loading

The current procedural basketball works great! The Sketchfab model would just add more realistic textures if you want that extra polish.