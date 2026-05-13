import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';

function AnimatedSphere({ position, color, size }) {
  const mesh = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    mesh.current.position.y = position[1] + Math.sin(t * 0.5 + position[0]) * 0.2;
    mesh.current.rotation.x = t * 0.2;
    mesh.current.rotation.z = t * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={mesh} position={position}>
        <sphereGeometry args={[size, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          speed={3}
          distort={0.4}
          radius={1}
          metalness={0.5}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

export default function ThreeBackground() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none opacity-40 dark:opacity-20">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
        
        <AnimatedSphere position={[-2, 1, 0]} color="#6366f1" size={0.6} />
        <AnimatedSphere position={[2, -1, -1]} color="#8b5cf6" size={0.4} />
        <AnimatedSphere position={[-1.5, -1.5, -2]} color="#4f46e5" size={0.3} />
        <AnimatedSphere position={[3, 1.5, -2]} color="#6366f1" size={0.5} />
      </Canvas>
    </div>
  );
}
