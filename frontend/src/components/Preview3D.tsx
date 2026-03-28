import { useEffect, useRef } from "react";
import * as THREE from "three";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { CabinetConfig } from "../types";

interface Props {
  config: CabinetConfig;
  stlUrl: string | null;
}

export default function Preview3D({ config, stlUrl }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      10000
    );
    camera.position.set(config.width * 1.5, config.height * 1.5, config.depth * 2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

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

    const animate = () => {
      requestAnimationFrame(animate);
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
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (!stlUrl || !sceneRef.current) return;

    const loader = new STLLoader();
    loader.load(stlUrl, (geometry) => {
      const scene = sceneRef.current!;
      if (meshRef.current) {
        scene.remove(meshRef.current);
        meshRef.current.geometry.dispose();
      }

      geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      geometry.boundingBox!.getCenter(center);
      geometry.translate(-center.x, -center.y, -center.z);

      const material = new THREE.MeshStandardMaterial({
        color: 0xd4a574,
        roughness: 0.7,
        metalness: 0.1,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      meshRef.current = mesh;

      if (cameraRef.current && controlsRef.current) {
        const size = new THREE.Vector3();
        geometry.boundingBox!.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const cam = cameraRef.current;
        cam.position.set(maxDim * 1.5, maxDim * 1.2, maxDim * 1.8);
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }
    });
  }, [stlUrl]);

  return (
    <div className="preview-container">
      <div ref={containerRef} className="preview-canvas" />
      {!stlUrl && (
        <div className="preview-placeholder">
          <p>Configure your cabinet and the 3D preview will appear here.</p>
          <p className="hint">
            Click "Download STL" to generate a preview (requires OpenSCAD on server).
          </p>
        </div>
      )}
    </div>
  );
}
