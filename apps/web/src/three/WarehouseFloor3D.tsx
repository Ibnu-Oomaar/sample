import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';

interface RackData {
  id: string;
  code: string;
  zone: string;
  position: [number, number, number];
  occupancy: number; // percentage 0-100
  pallets: number;
  maxPallets: number;
}

const racksData: RackData[] = [
  { id: 'r1', code: 'RACK-A1', zone: 'Zone A (Heavy)', position: [-3, 0, -2], occupancy: 92, pallets: 46, maxPallets: 50 },
  { id: 'r2', code: 'RACK-A2', zone: 'Zone A (Heavy)', position: [-3, 0, 0], occupancy: 84, pallets: 42, maxPallets: 50 },
  { id: 'r3', code: 'RACK-A3', zone: 'Zone A (Heavy)', position: [-3, 0, 2], occupancy: 65, pallets: 32, maxPallets: 50 },
  
  { id: 'r4', code: 'RACK-B1', zone: 'Zone B (FMCG)', position: [0, 0, -2], occupancy: 95, pallets: 38, maxPallets: 40 },
  { id: 'r5', code: 'RACK-B2', zone: 'Zone B (FMCG)', position: [0, 0, 0], occupancy: 40, pallets: 16, maxPallets: 40 },
  { id: 'r6', code: 'RACK-B3', zone: 'Zone B (FMCG)', position: [0, 0, 2], occupancy: 78, pallets: 31, maxPallets: 40 },

  { id: 'r7', code: 'RACK-C1', zone: 'Zone C (Cold)', position: [3, 0, -2], occupancy: 55, pallets: 11, maxPallets: 20 },
  { id: 'r8', code: 'RACK-C2', zone: 'Zone C (Cold)', position: [3, 0, 0], occupancy: 80, pallets: 16, maxPallets: 20 },
  { id: 'r9', code: 'RACK-C3', zone: 'Zone C (Cold)', position: [3, 0, 2], occupancy: 20, pallets: 4, maxPallets: 20 },
];

const InteractiveRack: React.FC<{
  rack: RackData;
  isSelected: boolean;
  onSelect: (rack: RackData) => void;
}> = ({ rack, isSelected, onSelect }) => {
  const [hovered, setHovered] = useState(false);

  // Determine color based on occupancy
  const color = rack.occupancy > 85 ? '#EF4444' : rack.occupancy > 60 ? '#16A085' : '#38BDF8';

  return (
    <group 
      position={rack.position} 
      onClick={() => onSelect(rack)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Rack Framework */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[1.4, 2.4, 1.0]} />
        <meshStandardMaterial 
          color={isSelected ? '#F59E0B' : hovered ? '#FFFFFF' : '#1E293B'} 
          wireframe={!hovered && !isSelected} 
          roughness={0.4}
        />
      </mesh>

      {/* Internal Occupancy Fill Mesh */}
      <mesh position={[0, (rack.occupancy / 100) * 1.1, 0]}>
        <boxGeometry args={[1.2, (rack.occupancy / 100) * 2.2, 0.8]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.3} 
          transparent 
          opacity={hovered || isSelected ? 0.9 : 0.65} 
        />
      </mesh>

      {/* Label above rack */}
      <Text
        position={[0, 2.7, 0]}
        fontSize={0.24}
        color={isSelected ? '#F59E0B' : '#FFFFFF'}
        anchorX="center"
        anchorY="middle"
      >
        {rack.code}
      </Text>
    </group>
  );
};

export const WarehouseFloor3D: React.FC = () => {
  const [selectedRack, setSelectedRack] = useState<RackData>(racksData[0]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[480px] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-3">
      {/* 3D Canvas */}
      <div className="flex-1 relative h-full rounded-lg overflow-hidden bg-slate-950">
        <Canvas camera={{ position: [0, 8, 8], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} />
          <pointLight position={[-5, 5, -5]} color="#38BDF8" intensity={1} />

          {/* Floor grid */}
          <gridHelper args={[16, 16, '#16A085', '#334155']} position={[0, 0, 0]} />

          {/* Racks */}
          {racksData.map((rack) => (
            <InteractiveRack
              key={rack.id}
              rack={rack}
              isSelected={selectedRack.id === rack.id}
              onSelect={setSelectedRack}
            />
          ))}

          <OrbitControls maxPolarAngle={Math.PI / 2.2} minDistance={4} maxDistance={14} />
        </Canvas>

        <div className="absolute top-2 start-2 bg-slate-900/90 backdrop-blur px-2.5 py-1 rounded text-xs font-mono text-emerald-400 border border-emerald-500/30">
          3D SECTOR RADAR: CLICK RACKS TO INSPECT
        </div>
      </div>

      {/* Selected Rack Telemetry Inspector */}
      <div className="w-full lg:w-72 bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col justify-between text-slate-200">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">Selected Bay</span>
              <h4 className="text-lg font-bold text-white font-mono">{selectedRack.code}</h4>
            </div>
            <span className={`px-2 py-0.5 text-xs font-bold rounded ${
              selectedRack.occupancy > 85 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
              selectedRack.occupancy > 60 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
              'bg-sky-500/20 text-sky-400 border border-sky-500/30'
            }`}>
              {selectedRack.occupancy}% Utilized
            </span>
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <div>
              <span className="text-xs text-slate-400">Zone Classification</span>
              <p className="font-medium text-slate-200">{selectedRack.zone}</p>
            </div>
            <div>
              <span className="text-xs text-slate-400">Pallet Load</span>
              <p className="font-medium text-slate-200">{selectedRack.pallets} / {selectedRack.maxPallets} Pallets</p>
              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
                <div 
                  className={`h-full ${
                    selectedRack.occupancy > 85 ? 'bg-red-500' :
                    selectedRack.occupancy > 60 ? 'bg-emerald-500' : 'bg-sky-500'
                  }`}
                  style={{ width: `${selectedRack.occupancy}%` }}
                />
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-400">Available Pallet Slots</span>
              <p className="font-semibold text-emerald-400">{selectedRack.maxPallets - selectedRack.pallets} Open Positions</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
          Status: Operational · RF Scanners Connected · Forklift Clearance Valid
        </div>
      </div>
    </div>
  );
};
