"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { CampusBuilding, CampusIncident } from "@/types";
import { RotateCw, ZoomIn, ZoomOut, Maximize2, Layers, Sparkles } from "lucide-react";

interface CampusDigitalTwin3DProps {
  buildings: CampusBuilding[];
  incidents: CampusIncident[];
  selectedBuildingId: string | null;
  onSelectBuilding: (building: CampusBuilding | null) => void;
  showHeatmap: boolean;
  showEnergyPulse: boolean;
}

export function CampusDigitalTwin3D({
  buildings,
  incidents,
  selectedBuildingId,
  onSelectBuilding,
  showHeatmap,
  showEnergyPulse,
}: CampusDigitalTwin3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Deep Navy slate background
    scene.fog = new THREE.FogExp2(0x0f172a, 0.0012);

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.set(0, 480, 620);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x2dd4bf, 1.2); // Teal rim lighting
    dirLight.position.set(200, 400, 200);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
    sunLight.position.set(-200, 300, -100);
    scene.add(sunLight);

    // 3. Ground Plane
    const groundGeo = new THREE.PlaneGeometry(1200, 1200, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Campus Road Grid
    const gridHelper = new THREE.GridHelper(1200, 40, 0x334155, 0x1e293b);
    gridHelper.position.y = 0.5;
    scene.add(gridHelper);

    // Central Lawn Ring
    const lawnGeo = new THREE.RingGeometry(20, 140, 32);
    const lawnMat = new THREE.MeshBasicMaterial({ color: 0x065f46, side: THREE.DoubleSide });
    const lawn = new THREE.Mesh(lawnGeo, lawnMat);
    lawn.rotation.x = -Math.PI / 2;
    lawn.position.y = 1;
    scene.add(lawn);

    // 4. Interactive 3D Buildings
    const buildingMeshes: Map<string, THREE.Mesh> = new Map();
    const beaconMeshes: THREE.Mesh[] = [];

    buildings.forEach((bld) => {
      // Scale coordinates from 2D (0..850) to 3D center (-400..+400)
      const posX = (bld.coordinates_x - 425) * 1.5;
      const posZ = (bld.coordinates_y - 425) * 1.5;
      const bldHeight = Math.max(30, bld.floors_count * 24);

      // Building Body
      const bldGeo = new THREE.BoxGeometry(90, bldHeight, 75);
      const isSelected = bld.id === selectedBuildingId;
      const bldIncidents = incidents.filter((i) => i.building_id === bld.id && i.status !== "resolved");
      const hasIncident = bldIncidents.length > 0;

      const bldMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0x0d9488 : hasIncident ? 0xbe123c : 0x334155,
        roughness: 0.3,
        metalness: 0.4,
        emissive: isSelected ? 0x14b8a6 : hasIncident ? 0x9f1239 : 0x0f172a,
        emissiveIntensity: isSelected ? 0.4 : hasIncident ? 0.3 : 0.05,
      });

      const mesh = new THREE.Mesh(bldGeo, bldMat);
      mesh.position.set(posX, bldHeight / 2, posZ);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { buildingId: bld.id, building: bld };
      scene.add(mesh);
      buildingMeshes.set(bld.id, mesh);

      // Roof Accent Frame
      const roofGeo = new THREE.BoxGeometry(94, 4, 79);
      const roofMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.set(posX, bldHeight + 2, posZ);
      scene.add(roof);

      // Occupancy Pillar (if heatmap enabled)
      if (showHeatmap) {
        const pillarGeo = new THREE.CylinderGeometry(15, 15, 60, 16);
        const pillarMat = new THREE.MeshBasicMaterial({
          color: hasIncident ? 0xf43f5e : 0x2dd4bf,
          transparent: true,
          opacity: 0.35,
        });
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(posX, bldHeight + 35, posZ);
        scene.add(pillar);
      }

      // Incident Warning Beacon
      if (hasIncident) {
        const beaconGeo = new THREE.SphereGeometry(10, 16, 16);
        const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });
        const beacon = new THREE.Mesh(beaconGeo, beaconMat);
        beacon.position.set(posX, bldHeight + 20, posZ);
        scene.add(beacon);
        beaconMeshes.push(beacon);
      }
    });

    // 5. Raycasting for Click Selection & Hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(Array.from(buildingMeshes.values()));

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        const bld = clickedMesh.userData.building as CampusBuilding;
        if (bld) {
          onSelectBuilding(bld.id === selectedBuildingId ? null : bld);
        }
      }
    };

    const handlePointerMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(Array.from(buildingMeshes.values()));

      if (intersects.length > 0) {
        const bld = intersects[0].object.userData.building as CampusBuilding;
        setHoveredBuilding(bld ? `${bld.name} (${bld.code})` : null);
        renderer.domElement.style.cursor = "pointer";
      } else {
        setHoveredBuilding(null);
        renderer.domElement.style.cursor = "grab";
      }
    };

    renderer.domElement.addEventListener("click", handlePointerDown);
    renderer.domElement.addEventListener("mousemove", handlePointerMove);

    // 6. Camera Orbit Animation
    let isUserInteracting = false;
    let onPointerDownPointerX = 0;
    let onPointerDownLon = 0;
    let lon = 45;
    const lat = 35;

    const onMouseDown = (event: MouseEvent) => {
      isUserInteracting = true;
      onPointerDownPointerX = event.clientX;
      onPointerDownLon = lon;
    };

    const onMouseMove = (event: MouseEvent) => {
      if (isUserInteracting) {
        lon = (onPointerDownPointerX - event.clientX) * 0.2 + onPointerDownLon;
      }
    };

    const onMouseUp = () => {
      isUserInteracting = false;
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      camera.position.y = Math.max(200, Math.min(900, camera.position.y + event.deltaY * 0.5));
    };

    renderer.domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    // 7. Render Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (!isUserInteracting) {
        lon += 0.04; // Slow ambient orbit
      }

      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(lon);

      const radius = 750;
      camera.position.x = radius * Math.sin(phi) * Math.cos(theta);
      camera.position.z = radius * Math.sin(phi) * Math.sin(theta);
      camera.lookAt(0, 40, 0);

      // Pulse beacon spheres
      beaconMeshes.forEach((beacon) => {
        const s = 1 + Math.sin(clock.getElapsedTime() * 5) * 0.25;
        beacon.scale.set(s, s, s);
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("click", handlePointerDown);
      renderer.domElement.removeEventListener("mousemove", handlePointerMove);
      renderer.domElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      renderer.domElement.removeEventListener("wheel", onWheel);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [buildings, incidents, selectedBuildingId, showHeatmap, showEnergyPulse, onSelectBuilding]);

  return (
    <div className="relative w-full h-[520px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl select-none">
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Controls Overlay */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2 text-xs text-slate-200 pointer-events-auto">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span className="font-bold">Three.js 3D Digital Twin</span>
          <span className="text-[10px] text-teal-400 font-mono bg-teal-500/10 px-1.5 py-0.5 rounded">
            WebGL 60FPS
          </span>
        </div>

        {hoveredBuilding && (
          <div className="bg-teal-950/90 backdrop-blur-md border border-teal-500/40 text-teal-200 text-xs px-3 py-1.5 rounded-xl font-bold animate-in fade-in">
            {hoveredBuilding}
          </div>
        )}
      </div>

      {/* Camera Guidance Notice */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
        <div className="bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[10px] text-slate-400 font-mono flex items-center gap-3">
          <span>Drag: Orbit Camera</span>
          <span>&bull;</span>
          <span>Scroll: Zoom In/Out</span>
          <span>&bull;</span>
          <span>Click: Inspect Building</span>
        </div>
      </div>
    </div>
  );
}
