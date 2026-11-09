import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// -------------------------------------------------------------
// HYPER-DETAILED 3D SMARTPHONE MODEL WITH EXPLODED VIEW SUPPORT
// -------------------------------------------------------------
export function PhoneModel({ 
  color = '#00f5ff', 
  wireframe = false, 
  exploded = false,
  activeHotspot = null, 
  onSelectHotspot 
}) {
  const group = useRef();

  // Parts refs for exploded view
  const frontGlassRef = useRef();
  const screenMeshRef = useRef();
  const chassisRef = useRef();
  const batteryRef = useRef();
  const cameraRef = useRef();
  const backCoverRef = useRef();

  useFrame((state, delta) => {
    if (group.current && !activeHotspot) {
      group.current.rotation.y += delta * 0.45;
    }

    // Smooth lerp for exploded view transitions
    const expZ = exploded ? 0.9 : 0;
    const expBackZ = exploded ? -0.9 : 0;
    const expCamZ = exploded ? -1.3 : 0;

    if (frontGlassRef.current) frontGlassRef.current.position.z = THREE.MathUtils.lerp(frontGlassRef.current.position.z, 0.08 + expZ * 0.8, 0.08);
    if (screenMeshRef.current) screenMeshRef.current.position.z = THREE.MathUtils.lerp(screenMeshRef.current.position.z, 0.075 + expZ * 0.4, 0.08);
    if (batteryRef.current) batteryRef.current.position.z = THREE.MathUtils.lerp(batteryRef.current.position.z, expZ * 0.1, 0.08);
    if (cameraRef.current) cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, -0.09 + expCamZ * 0.6, 0.08);
    if (backCoverRef.current) backCoverRef.current.position.z = THREE.MathUtils.lerp(backCoverRef.current.position.z, -0.075 + expBackZ * 0.7, 0.08);
  });

  const metallicChassisMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    metalness: 0.95,
    roughness: 0.15,
    wireframe,
  }), [color, wireframe]);

  const screenDisplayMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0x050814,
    emissive: new THREE.Color(wireframe ? '#00f5ff' : '#0066ff'),
    emissiveIntensity: 0.5,
    metalness: 0.1,
    roughness: 0.1,
    wireframe,
  }), [wireframe]);

  return (
    <group ref={group} scale={1.35}>
      {/* Front Sapphire Glass */}
      <mesh ref={frontGlassRef} position={[0, 0, 0.08]}>
        <boxGeometry args={[1.5, 3.1, 0.01]} />
        <meshPhysicalMaterial
          color="#00f5ff"
          transmission={0.85}
          opacity={0.9}
          transparent
          roughness={0.05}
          ior={1.5}
          wireframe={wireframe}
        />
      </mesh>

      {/* OLED Active Display Screen with High-Tech Graphics */}
      <group ref={screenMeshRef} position={[0, 0, 0.075]}>
        <mesh material={screenDisplayMat}>
          <planeGeometry args={[1.46, 3.02]} />
        </mesh>

        {/* Live Display Hologram UI */}
        <mesh position={[0, 1.15, 0.002]}>
          <planeGeometry args={[0.35, 0.06]} />
          <meshBasicMaterial color="#00f5ff" />
        </mesh>
        <mesh position={[0, 0.2, 0.002]}>
          <ringGeometry args={[0.25, 0.28, 32]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0, -0.6, 0.002]}>
          <planeGeometry args={[0.9, 0.12]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* Titanium Main Chassis Frame */}
      <mesh ref={chassisRef} material={metallicChassisMat} castShadow receiveShadow>
        <boxGeometry args={[1.56, 3.16, 0.12, 16, 16, 8]} />
      </mesh>

      {/* Internal High-Capacity Li-Ion Battery & Motherboard (visible in explode view) */}
      <group ref={batteryRef} position={[0, -0.2, 0]}>
        <mesh>
          <boxGeometry args={[1.2, 1.8, 0.06]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe={wireframe} />
        </mesh>
        {exploded && (
          <Html position={[0.9, 0, 0]} distanceFactor={6}>
            <div className="exploded-part-label">
              <span className="part-tag">AURA CORE</span>
              <span className="part-name">5000mAh Dual-Cell</span>
            </div>
          </Html>
        )}
      </group>

      {/* Camera Module Bump & Triple Lenses */}
      <group ref={cameraRef} position={[-0.42, 0.95, -0.09]}>
        <mesh>
          <boxGeometry args={[0.62, 0.92, 0.06]} />
          <meshStandardMaterial color={color} metalness={0.95} roughness={0.12} wireframe={wireframe} />
        </mesh>

        {/* Triple Optic Lenses */}
        {[-0.42, -0.42, -0.18].map((x, i) => (
          <group key={i} position={[x + 0.42, 0.24 - i * 0.24, -0.04]}>
            <mesh>
              <cylinderGeometry args={[0.1, 0.1, 0.03, 24]} />
              <meshStandardMaterial color="#030508" metalness={0.9} roughness={0.1} wireframe={wireframe} />
            </mesh>
            <mesh position={[0, 0, -0.016]}>
              <cylinderGeometry args={[0.06, 0.06, 0.015, 16]} />
              <meshBasicMaterial color="#00f5ff" />
            </mesh>
          </group>
        ))}

        {exploded && (
          <Html position={[-0.9, 0.2, 0]} distanceFactor={6}>
            <div className="exploded-part-label">
              <span className="part-tag">OPTICS</span>
              <span className="part-name">108MP Telephoto Pro</span>
            </div>
          </Html>
        )}
      </group>

      {/* Ceramic Back Cover */}
      <mesh ref={backCoverRef} position={[0, 0, -0.075]} rotation={[0, Math.PI, 0]}>
        <boxGeometry args={[1.5, 3.1, 0.01]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.2} wireframe={wireframe} />
      </mesh>

      {/* Glowing Dynamic Hotspots */}
      {!exploded && (
        <>
          <Html position={[0.9, 1.25, 0.1]} distanceFactor={6}>
            <button
              onClick={(e) => { e.stopPropagation(); onSelectHotspot?.('oled'); }}
              className="hyper-hotspot-btn"
            >
              <span className="hotspot-pulse"></span>
              <span className="hotspot-text">165Hz Pro OLED</span>
            </button>
          </Html>

          <Html position={[-0.9, 0.95, -0.1]} distanceFactor={6}>
            <button
              onClick={(e) => { e.stopPropagation(); onSelectHotspot?.('optics'); }}
              className="hyper-hotspot-btn"
            >
              <span className="hotspot-pulse"></span>
              <span className="hotspot-text">Triple Prism Array</span>
            </button>
          </Html>
        </>
      )}
    </group>
  );
}

// -------------------------------------------------------------
// HYPER-DETAILED 3D LAPTOP STUDIO MODEL
// -------------------------------------------------------------
export function LaptopModel({ 
  color = '#38bdf8', 
  wireframe = false, 
  exploded = false,
  activeHotspot = null, 
  onSelectHotspot 
}) {
  const group = useRef();

  useFrame((state, delta) => {
    if (group.current && !activeHotspot) {
      group.current.rotation.y += delta * 0.4;
    }
  });

  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    metalness: 0.92,
    roughness: 0.18,
    wireframe,
  }), [color, wireframe]);

  return (
    <group ref={group} scale={1.2} position={[0, -0.4, 0]}>
      {/* Aluminum Base Chassis */}
      <mesh position={[0, 0, 0.2]} material={bodyMat} castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.12, 2.3, 16, 4, 16]} />
      </mesh>

      {/* Keyboard Bed with Neon Ambient Backlight */}
      <mesh position={[0, 0.07, 0.15]}>
        <boxGeometry args={[2.9, 0.02, 1.25]} />
        <meshStandardMaterial color="#080c18" roughness={0.7} metalness={0.2} wireframe={wireframe} />
      </mesh>

      {/* Keycaps Matrix */}
      <mesh position={[0, 0.082, 0.15]}>
        <planeGeometry args={[2.8, 1.2]} />
        <meshStandardMaterial color="#0f172a" emissive="#00f5ff" emissiveIntensity={0.4} wireframe={true} />
      </mesh>

      {/* Glass Trackpad */}
      <mesh position={[0, 0.07, 0.98]}>
        <boxGeometry args={[1.1, 0.015, 0.7]} />
        <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Screen Hinge & Display lid angled 115 degrees */}
      <group position={[0, 0.06, -0.92]} rotation={[-0.38, 0, 0]}>
        {/* Screen back lid */}
        <mesh position={[0, 1.15, -0.04]} material={bodyMat} castShadow>
          <boxGeometry args={[3.4, 2.2, 0.08]} />
        </mesh>

        {/* Display Screen with Glowing Cyber UI */}
        <mesh position={[0, 1.15, 0.01]}>
          <planeGeometry args={[3.24, 2.05]} />
          <meshStandardMaterial
            color="#050a14"
            emissive="#00f5ff"
            emissiveIntensity={0.45}
            wireframe={wireframe}
          />
        </mesh>

        {/* Backlight Logo */}
        <mesh position={[0, 1.15, -0.09]} rotation={[0, Math.PI, 0]}>
          <ringGeometry args={[0.2, 0.24, 32]} />
          <meshBasicMaterial color="#00f5ff" />
        </mesh>

        <Html position={[1.85, 1.6, 0]} distanceFactor={6}>
          <button
            onClick={(e) => { e.stopPropagation(); onSelectHotspot?.('display'); }}
            className="hyper-hotspot-btn"
          >
            <span className="hotspot-pulse"></span>
            <span className="hotspot-text">Liquid Retina XDR 120Hz</span>
          </button>
        </Html>
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// HYPER-DETAILED 3D ACOUSTIC QUANTUM CORE GADGET
// -------------------------------------------------------------
export function GadgetModel({ color = '#8b5cf6', wireframe = false }) {
  const coreRef = useRef();
  const ring1 = useRef();
  const ring2 = useRef();
  const ring3 = useRef();

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.5;
    }
    if (ring1.current) {
      ring1.current.rotation.x += delta * 0.9;
      ring1.current.rotation.y += delta * 0.5;
    }
    if (ring2.current) {
      ring2.current.rotation.y -= delta * 0.8;
      ring2.current.rotation.z += delta * 0.6;
    }
    if (ring3.current) {
      ring3.current.rotation.z += delta * 0.7;
      ring3.current.rotation.x -= delta * 0.4;
    }
  });

  return (
    <group scale={1.3}>
      <Float speed={2.2} rotationIntensity={0.6} floatIntensity={0.8}>
        <mesh ref={coreRef}>
          <octahedronGeometry args={[0.95, 3]} />
          <MeshDistortMaterial
            color={color}
            distort={0.3}
            speed={3}
            roughness={0.1}
            metalness={0.95}
            wireframe={wireframe}
          />
        </mesh>
      </Float>

      {/* Orbiting Quantum Hologram Rings */}
      <group ref={ring1}>
        <mesh>
          <torusGeometry args={[1.4, 0.025, 16, 64]} />
          <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={0.6} wireframe={wireframe} />
        </mesh>
      </group>
      <group ref={ring2}>
        <mesh>
          <torusGeometry args={[1.7, 0.025, 16, 64]} />
          <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.6} wireframe={wireframe} />
        </mesh>
      </group>
      <group ref={ring3}>
        <mesh>
          <torusGeometry args={[2.0, 0.02, 16, 64]} />
          <meshStandardMaterial color="#ffb703" emissive="#ffb703" emissiveIntensity={0.5} wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// TABLET 3D MODEL
// -------------------------------------------------------------
export function TabletModel({ color = '#00f5ff', wireframe = false }) {
  const group = useRef();

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={group} scale={1.25}>
      <mesh>
        <boxGeometry args={[2.3, 3.2, 0.08]} />
        <meshStandardMaterial color={color} metalness={0.92} roughness={0.2} wireframe={wireframe} />
      </mesh>
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[2.18, 3.06]} />
        <meshStandardMaterial color="#050814" emissive="#00f5ff" emissiveIntensity={0.4} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// FASHION / GARMENT PEDESTAL 3D MODEL
// -------------------------------------------------------------
export function FashionModel({ color = '#ec4899', wireframe = false }) {
  const meshRef = useRef();
  const ringRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.7;
    }
  });

  return (
    <group scale={1.15} position={[0, -0.2, 0]}>
      {/* Luxury Pedestal Base */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[1.6, 1.8, 0.25, 32]} />
        <meshStandardMaterial color="#090d16" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0, -1.05, 0]}>
        <ringGeometry args={[1.4, 1.55, 32]} rotation={[-Math.PI / 2, 0, 0]} />
        <meshBasicMaterial color="#ec4899" />
      </mesh>

      {/* Floating Organically Shimmering Fashion Garment Mesh */}
      <Float speed={2.2} rotationIntensity={0.4} floatIntensity={0.7}>
        <mesh ref={meshRef} position={[0, 0.1, 0]}>
          <torusKnotGeometry args={[0.78, 0.3, 128, 32, 2, 3]} />
          <MeshDistortMaterial
            color={color}
            speed={2.5}
            distort={0.4}
            roughness={0.15}
            metalness={0.6}
            wireframe={wireframe}
          />
        </mesh>
      </Float>

      <group ref={ringRef} position={[0, 0.1, 0]}>
        <mesh>
          <torusGeometry args={[1.45, 0.02, 16, 64]} />
          <meshBasicMaterial color="#f472b6" />
        </mesh>
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// FURNITURE 3D MODEL
// -------------------------------------------------------------
export function FurnitureModel({ color = '#38bdf8', wireframe = false }) {
  const group = useRef();

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group ref={group} scale={1.15} position={[0, -0.3, 0]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.9, 0.35, 1.7]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} wireframe={wireframe} />
      </mesh>
      <mesh position={[0, 0.95, -0.7]}>
        <boxGeometry args={[1.9, 1.6, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} wireframe={wireframe} />
      </mesh>
      {[-1.0, 1.0].map((x, i) => (
        <mesh key={i} position={[x, 0.5, 0]}>
          <boxGeometry args={[0.2, 0.7, 1.7]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.85} wireframe={wireframe} />
        </mesh>
      ))}
      {[[-0.85, -0.75], [0.85, -0.75], [-0.85, 0.75], [0.85, 0.75]].map(([x, z], i) => (
        <mesh key={i} position={[x, -0.5, z]}>
          <cylinderGeometry args={[0.04, 0.04, 0.7, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.15} wireframe={wireframe} />
        </mesh>
      ))}
    </group>
  );
}

// -------------------------------------------------------------
// CHROMATIC AMBIENT PARTICLE FIELD
// -------------------------------------------------------------
export function ParticleField({ count = 1200, color = '#00f5ff' }) {
  const points = useRef();

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return [pos];
  }, [count]);

  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.y += delta * 0.035;
      points.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        color={color}
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}
