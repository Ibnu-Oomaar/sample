import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

// Procedural 3D Storage Racks with pallet boxes
const StorageRack = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Upright steel pillars (Industrial Navy Blue) */}
      <mesh position={[-1.2, 1.8, -0.6]} castShadow receiveShadow>
        <boxGeometry args={[0.08, 3.6, 0.08]} />
        <meshStandardMaterial color="#1E3A5F" roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[1.2, 1.8, -0.6]} castShadow receiveShadow>
        <boxGeometry args={[0.08, 3.6, 0.08]} />
        <meshStandardMaterial color="#1E3A5F" roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[-1.2, 1.8, 0.6]} castShadow receiveShadow>
        <boxGeometry args={[0.08, 3.6, 0.08]} />
        <meshStandardMaterial color="#1E3A5F" roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[1.2, 1.8, 0.6]} castShadow receiveShadow>
        <boxGeometry args={[0.08, 3.6, 0.08]} />
        <meshStandardMaterial color="#1E3A5F" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Horizontal load beams (Industrial Orange / Teal) */}
      {[0.6, 1.8, 3.0].map((y, idx) => (
        <group key={idx}>
          <mesh position={[0, y, 0.6]}>
            <boxGeometry args={[2.45, 0.08, 0.05]} />
            <meshStandardMaterial color="#16A085" roughness={0.3} metalness={0.6} />
          </mesh>
          <mesh position={[0, y, -0.6]}>
            <boxGeometry args={[2.45, 0.08, 0.05]} />
            <meshStandardMaterial color="#16A085" roughness={0.3} metalness={0.6} />
          </mesh>

          {/* Wooden Pallet & Box packages on shelves */}
          {[-0.6, 0.6].map((x, bIdx) => (
            <group key={bIdx} position={[x, y + 0.12, 0]}>
              {/* Pallet base */}
              <mesh position={[0, 0.04, 0]}>
                <boxGeometry args={[0.9, 0.08, 0.9]} />
                <meshStandardMaterial color="#8B5A2B" roughness={0.9} />
              </mesh>
              {/* Product Shipping Container Box */}
              <mesh position={[0, 0.35, 0]} castShadow>
                <boxGeometry args={[0.8, 0.55, 0.8]} />
                <meshStandardMaterial 
                  color={idx === 1 && bIdx === 0 ? '#38BDF8' : '#C49A6C'} 
                  roughness={0.6}
                  metalness={0.1}
                />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </group>
  );
};

// Moving Automated Guided Vehicle (AGV) along track
const AutomatedVehicle = () => {
  const agvRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (agvRef.current) {
      const t = clock.getElapsedTime() * 0.8;
      agvRef.current.position.z = Math.sin(t) * 3.5;
      agvRef.current.position.x = Math.cos(t * 0.5) * 0.5;
    }
  });

  return (
    <group ref={agvRef} position={[0, 0.25, 0]}>
      {/* Chassis */}
      <mesh castShadow>
        <boxGeometry args={[1.0, 0.3, 1.4]} />
        <meshStandardMaterial color="#101C2C" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Teal Beacon Sensor */}
      <mesh position={[0, 0.25, 0.4]}>
        <cylinderGeometry args={[0.1, 0.1, 0.15]} />
        <meshStandardMaterial color="#16A085" emissive="#16A085" emissiveIntensity={0.8} />
      </mesh>
      {/* Front Light beam */}
      <pointLight position={[0, 0.2, 0.8]} color="#38BDF8" intensity={1.5} distance={3} />
      {/* Carried cargo */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.7, 0.5, 0.7]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.3} />
      </mesh>
    </group>
  );
};

// Illuminated floor track lines
const FloorWithTracks = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* Concrete warehouse floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[25, 25]} />
        <meshStandardMaterial color="#0B131E" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Glowing AGV Navigation Lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[0.08, 14]} />
        <meshBasicMaterial color="#16A085" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.5, 0.01, 0]}>
        <planeGeometry args={[0.04, 14]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.5, 0.01, 0]}>
        <planeGeometry args={[0.04, 14]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.4} />
      </mesh>
    </group>
  );
};

export const IndustrialWarehouseHero: React.FC = () => {
  return (
    <div className="w-full h-[520px] lg:h-[620px] relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#101C2C] to-[#0B131E] border border-industrial-border-dark shadow-2xl">
      <Canvas
        shadows
        camera={{ position: [5, 5, 7], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#0B131E']} />
        <fog attach="fog" args={['#0B131E', 8, 22]} />

        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1.8}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-4, 6, -2]} color="#38BDF8" intensity={1.2} />
        <pointLight position={[4, 5, 3]} color="#16A085" intensity={1.2} />

        {/* Floor */}
        <FloorWithTracks />

        {/* Left Rack Aisle */}
        <StorageRack position={[-2.8, 0, -3]} />
        <StorageRack position={[-2.8, 0, 0]} />
        <StorageRack position={[-2.8, 0, 3]} />

        {/* Right Rack Aisle */}
        <StorageRack position={[2.8, 0, -3]} />
        <StorageRack position={[2.8, 0, 0]} />
        <StorageRack position={[2.8, 0, 3]} />

        {/* Moving Robot */}
        <AutomatedVehicle />

        {/* Subtle floating telemetry box */}
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <group position={[0, 3.8, 1]}>
            <mesh>
              <octahedronGeometry args={[0.3, 0]} />
              <meshStandardMaterial color="#38BDF8" wireframe />
            </mesh>
          </group>
        </Float>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate 
          autoRotateSpeed={0.8}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>

      {/* Industrial Overlay Telemetry Badges */}
      <div className="absolute top-4 start-4 flex items-center gap-2 bg-[#101C2C]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-industrial-teal/30 text-xs font-mono text-industrial-teal">
        <span className="w-2 h-2 rounded-full bg-industrial-teal animate-ping" />
        <span>WH-TELEMETRY: ACTIVE | AGV FLEET OPTIMIZED</span>
      </div>

      <div className="absolute bottom-4 end-4 flex items-center gap-2 bg-[#101C2C]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-industrial-cyan/30 text-xs font-mono text-industrial-cyan">
        <span>INTERACTIVE 3D · DRAG TO ROTATE SCENE</span>
      </div>
    </div>
  );
};
