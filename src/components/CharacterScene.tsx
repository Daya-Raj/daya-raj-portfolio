import { Canvas } from "@react-three/fiber";
import { Center, ContactShadows, Environment, Lightformer, OrbitControls, useGLTF } from "@react-three/drei";
import { Component, Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import * as THREE from "three";
import { assets } from "@/config/site";
import CharacterPlaceholder from "@/components/CharacterPlaceholder";

function Model({ onReady }: { onReady: () => void }) {
  const gltf = useGLTF(assets.character);
  // Clone per mount: R3F disposes the object on unmount, so reusing the cached
  // scene leaves nothing to render when returning to Home.
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  useEffect(() => onReady(), [onReady]);
  const s = useMemo(() => {
    const size = new THREE.Box3().setFromObject(scene).getSize(new THREE.Vector3());
    return 1 / (size.y || 1); // normalize to 1 unit tall
  }, [scene]);
  return (
    <Center top>
      <primitive object={scene} scale={s} dispose={null} />
    </Center>
  );
}

class Boundary extends Component<{ children: ReactNode; fallback: ReactNode }, { err: boolean }> {
  override state = { err: false };
  static getDerivedStateFromError() { return { err: true }; }
  override render() { return this.state.err ? this.props.fallback : this.props.children; }
}

export default function CharacterScene() {
  const [loaded, setLoaded] = useState(false);
  // Only surface the placeholder after a short delay so fast loads never flash it.
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowPlaceholder(true), 600);
    return () => clearTimeout(t);
  }, []);
  const fallback = <div className="flex h-full items-center justify-center text-sm text-muted-foreground">3D character unavailable on this device.</div>;
  return (
    <Boundary fallback={fallback}>
      <div className="relative h-full w-full">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0.1, 4.6], fov: 30 }} gl={{ alpha: true }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 5, 4]} intensity={1.6} />
          <Suspense fallback={null}>
            <group scale={1.9} position={[0, -0.95, 0]}>
              <Model onReady={() => setLoaded(true)} />
            </group>
            <ContactShadows position={[0, -0.95, 0]} opacity={0.35} blur={2.4} scale={5} />
            <Environment>
              <Lightformer intensity={2} position={[0, 5, 2]} scale={[10, 10, 1]} />
              <Lightformer intensity={1} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[20, 2, 1]} />
            </Environment>
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 2.4} maxPolarAngle={Math.PI / 1.9} target={[0, 0, 0]} />
        </Canvas>
        {showPlaceholder && !loaded && (
          <div className="pointer-events-none absolute inset-0 z-10">
            <CharacterPlaceholder />
          </div>
        )}
      </div>
    </Boundary>
  );
}

// Keep the model warm in cache so revisits to Home render instantly.
useGLTF.preload(assets.character);
