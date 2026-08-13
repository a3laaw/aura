"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows, Sky } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useApp, stageFromProgress } from "@/state/store";
import { BUILDING } from "@/data/buildingConfig";
import { Ground } from "./Ground";
import { Foundation } from "../foundation/Foundation";
import { Blueprint } from "../foundation/Blueprint";
import { Structure } from "../structure/Structure";
import { Facade } from "../facade/Facade";
import { Landscape } from "../landscape/Landscape";
import { Hands } from "../hands/Hands";
import { remap } from "@/utils/ease";

const CAM: Record<string, { pos: THREE.Vector3; look: THREE.Vector3 }> = {
  site: { pos: new THREE.Vector3(18, 1.72, 28), look: new THREE.Vector3(0, 1.2, 0) },
  blueprint: { pos: new THREE.Vector3(14, 2.1, 22), look: new THREE.Vector3(0, 0.2, 0) },
  foundation: { pos: new THREE.Vector3(16, 2.4, 20), look: new THREE.Vector3(0, 0.4, 0) },
  structure: { pos: new THREE.Vector3(22, 8, 26), look: new THREE.Vector3(0, 12, 0) },
  floors: { pos: new THREE.Vector3(26, 18, 32), look: new THREE.Vector3(0, 28, 0) },
  facade: { pos: new THREE.Vector3(32, 22, 38), look: new THREE.Vector3(0, 30, 0) },
  landscape: { pos: new THREE.Vector3(36, 16, 42), look: new THREE.Vector3(0, 18, 0) },
  final: { pos: new THREE.Vector3(42, 18, 48), look: new THREE.Vector3(0, 22, 0) },
};

export function SceneRig() {
  const progress = useApp((s) => s.progress);
  const showBlueprint = useApp((s) => s.showBlueprint);
  const showStructure = useApp((s) => s.showStructure);
  const showFacade = useApp((s) => s.showFacade);
  const showLandscape = useApp((s) => s.showLandscape);
  const selectedFloor = useApp((s) => s.selectedFloor);
  const reduced = useApp((s) => s.reducedMotion);
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3());
  const stage = stageFromProgress(progress);

  const target = useMemo(() => {
    if (selectedFloor != null) {
      const y = selectedFloor * BUILDING.floorHeight + 2;
      return {
        pos: new THREE.Vector3(22, y + 4, 18),
        look: new THREE.Vector3(0, y, 0),
      };
    }
    return CAM[stage] ?? CAM.site;
  }, [stage, selectedFloor]);

  useFrame((_, dt) => {
    const k = reduced ? 1 : 1 - Math.pow(0.08, dt * 60);
    camera.position.lerp(target.pos, k);
    look.current.lerp(target.look, k);
    camera.lookAt(look.current);
    (camera as THREE.PerspectiveCamera).fov = 62;
    camera.updateProjectionMatrix();
  });

  const landscapeT = remap(progress, 0.88, 1);

  return (
    <>
      <color attach="background" args={["#87b4d4"]} />
      <fog attach="fog" args={["#9ec4dc", 70, 180]} />
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[40, 60, 20]}
        intensity={1.55}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={160}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <hemisphereLight args={["#cfe8ff", "#6b5a45", 0.45]} />
      <Sky sunPosition={[80, 40, 20]} turbidity={4} rayleigh={0.6} />
      <Environment preset="city" environmentIntensity={0.35} />
      <Ground landscape={landscapeT} />
      <ContactShadows opacity={0.35} scale={80} blur={2.4} far={20} />
      <Blueprint progress={progress} visible={showBlueprint} />
      <Foundation progress={progress} />
      <Structure progress={progress} visible={showStructure} highlightFloor={selectedFloor} />
      <Facade progress={progress} visible={showFacade} highlightFloor={selectedFloor} />
      <Landscape progress={progress} visible={showLandscape} />
      <Hands />
    </>
  );
}
