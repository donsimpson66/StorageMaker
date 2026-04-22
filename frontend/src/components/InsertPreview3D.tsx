import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { DrawerInsertConfig } from "../types";
import { calculateInsertDimensions } from "../insertMath";

interface Props {
  config: DrawerInsertConfig;
}

export default function InsertPreview3D({ config }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let animationFrame = 0;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    const insertGroup = new THREE.Group();
    scene.add(insertGroup);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      10000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(120, 220, 300);
    scene.add(dirLight);

    const dimensions = calculateInsertDimensions(config);
    const maxDimension = Math.max(
      dimensions.insertWidth,
      dimensions.insertHeight,
      dimensions.insertDepth
    );

    const grid = new THREE.GridHelper(maxDimension * 2, 16, 0x557788, 0x223344);
    scene.add(grid);

    const insertMaterial = new THREE.MeshStandardMaterial({ color: 0x8ecae6 });
    const dividerMaterial = new THREE.MeshStandardMaterial({ color: 0x219ebc });

    const addBox = (
      width: number,
      height: number,
      depth: number,
      x: number,
      y: number,
      z: number,
      material: THREE.Material
    ) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        material
      );
      mesh.position.set(x + width / 2, y + height / 2, z + depth / 2);
      insertGroup.add(mesh);
    };

    const wall = config.insert_wall_thickness;
    const floor = config.floor_thickness;
    const innerWidth = Math.max(dimensions.insertWidth - 2 * wall, 1);
    const innerHeight = Math.max(dimensions.insertHeight - 2 * wall, 1);
    const dividerDepth = Math.max(dimensions.insertDepth - floor, 1);

    addBox(dimensions.insertWidth, wall, dimensions.insertDepth, 0, 0, 0, insertMaterial);
    addBox(dimensions.insertWidth, wall, dimensions.insertDepth, 0, dimensions.insertHeight - wall, 0, insertMaterial);
    addBox(wall, innerHeight, dimensions.insertDepth, 0, wall, 0, insertMaterial);
    addBox(wall, innerHeight, dimensions.insertDepth, dimensions.insertWidth - wall, wall, 0, insertMaterial);
    addBox(dimensions.insertWidth, dimensions.insertHeight, floor, 0, 0, 0, insertMaterial);

    const cellWidth = innerWidth / config.compartments_x;
    const cellHeight = innerHeight / config.compartments_y;

    for (let ix = 1; ix < config.compartments_x; ix += 1) {
      const x = wall + ix * cellWidth - wall / 2;
      addBox(wall, innerHeight, dividerDepth, x, wall, floor, dividerMaterial);
    }

    for (let iy = 1; iy < config.compartments_y; iy += 1) {
      const y = wall + iy * cellHeight - wall / 2;
      addBox(innerWidth, wall, dividerDepth, wall, y, floor, dividerMaterial);
    }

    insertGroup.position.set(
      -dimensions.insertWidth / 2,
      -dimensions.insertHeight / 2,
      -dimensions.insertDepth / 2
    );

    camera.position.set(maxDimension * 1.5, maxDimension * 1.05, maxDimension * 1.5);
    controls.target.set(0, 0, dimensions.insertDepth * 0.15);
    controls.update();

    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrame);
      insertGroup.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
      });
      (grid.geometry as THREE.BufferGeometry).dispose();
      const gridMaterial = grid.material;
      if (Array.isArray(gridMaterial)) {
        gridMaterial.forEach((material) => material.dispose());
      } else {
        gridMaterial.dispose();
      }
      insertMaterial.dispose();
      dividerMaterial.dispose();
      controls.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [config]);

  return (
    <div className="preview-container">
      <div ref={containerRef} className="preview-canvas" />
      <div className="preview-overlay">
        <p>Interactive insert preview</p>
        <p className="hint">Sized from the current cabinet drawer section.</p>
      </div>
    </div>
  );
}