import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { CabinetConfig } from "../types";

interface Props {
  config: CabinetConfig;
}

export default function Preview3D({ config }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let animationFrame = 0;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    const cabinetGroup = new THREE.Group();
    scene.add(cabinetGroup);

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

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(100, 200, 300);
    scene.add(dirLight);

    const grid = new THREE.GridHelper(
      Math.max(config.width, config.depth) * 2,
      20,
      0x444444,
      0x333333
    );
    scene.add(grid);

    const shellMaterial = new THREE.MeshStandardMaterial({ color: 0xd8b58a });
    const drawerMaterial = new THREE.MeshStandardMaterial({ color: 0xb59168 });
    const panelMaterial = new THREE.MeshStandardMaterial({ color: 0xc9a67e });

    const addPanel = (
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
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      cabinetGroup.add(mesh);
    };

    const wall = config.wall_thickness;
    const innerWidth = Math.max(config.width - wall * 2, 1);
    const innerHeight = Math.max(config.height - wall * 2, 1);
    const drawerClearance = config.drawer_clearance;
    const drawerDepth = Math.max(
      config.depth - drawerClearance - (config.back_panel ? wall : 0),
      1
    );
    const cellWidth = Math.max(
      (config.width - 2 * wall - (config.drawers_x + 1) * drawerClearance) /
        config.drawers_x,
      1
    );
    const cellHeight = Math.max(
      (config.height - 2 * wall - (config.drawers_y + 1) * drawerClearance) /
        config.drawers_y,
      1
    );

    addPanel(config.width, wall, config.depth, 0, 0, 0, shellMaterial);
    addPanel(config.width, wall, config.depth, 0, config.height - wall, 0, shellMaterial);
    addPanel(wall, innerHeight, config.depth, 0, wall, 0, shellMaterial);
    addPanel(wall, innerHeight, config.depth, config.width - wall, wall, 0, shellMaterial);

    if (config.back_panel) {
      addPanel(innerWidth, innerHeight, wall, wall, wall, config.depth - wall, panelMaterial);
    }

    for (let ix = 0; ix < config.drawers_x; ix += 1) {
      for (let iy = 0; iy < config.drawers_y; iy += 1) {
        const x = wall + drawerClearance + ix * (cellWidth + drawerClearance);
        const y = wall + drawerClearance + iy * (cellHeight + drawerClearance);
        addPanel(
          cellWidth,
          cellHeight,
          drawerDepth,
          x,
          y,
          drawerClearance,
          drawerMaterial
        );
      }
    }

    cabinetGroup.position.set(-config.width / 2, -config.height / 2, -config.depth / 2);

    const maxDimension = Math.max(config.width, config.height, config.depth);
    camera.position.set(maxDimension * 1.1, maxDimension * 0.9, maxDimension * 1.4);
    controls.target.set(0, 0, config.depth * 0.1);

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
      cabinetGroup.traverse((object) => {
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
      shellMaterial.dispose();
      drawerMaterial.dispose();
      panelMaterial.dispose();
      controls.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [config]);

  return (
    <div className="preview-container">
      <div ref={containerRef} className="preview-canvas" />
      <div className="preview-overlay">
        <p>Interactive cabinet preview</p>
        <p className="hint">Drag to orbit. Scroll to zoom.</p>
      </div>
    </div>
  );
}
