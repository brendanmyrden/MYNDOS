import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { usePlusCubeAccent } from "./plusCubeAccent";

type PlusCubeProps = {
  moduleName: string;
};

function canCreateWebGLContext() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function PlusCube({ moduleName }: PlusCubeProps) {
  const { appearance, glowCss } = usePlusCubeAccent(moduleName);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.hidden = false;
    if (fallbackRef.current) {
      fallbackRef.current.hidden = true;
    }

    if (!canCreateWebGLContext()) {
      canvas.hidden = true;
      if (fallbackRef.current) {
        fallbackRef.current.hidden = false;
      }
      return;
    }

    const scene = new THREE.Scene();
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch (error) {
      console.warn("PlusCube WebGL renderer unavailable; rendering static fallback.", error);
      canvas.hidden = true;
      if (fallbackRef.current) {
        fallbackRef.current.hidden = false;
      }
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(64, 64, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 4.8);

    const parseColor = (color: string) => {
      const parsed = new THREE.Color();
      return parsed.setStyle(color);
    };

    const createPlusTexture = (background: string) => {
      const textureCanvas = document.createElement("canvas");
      textureCanvas.width = 256;
      textureCanvas.height = 256;
      const context = textureCanvas.getContext("2d");
      if (!context) return null;
      context.clearRect(0, 0, 256, 256);
      context.fillStyle = background;
      context.fillRect(0, 0, 256, 256);
      // Embossed plus: shadow stroke under bright white stroke.
      context.lineWidth = 26;
      context.lineCap = "round";
      context.strokeStyle = "rgba(9, 18, 28, 0.7)";
      context.beginPath();
      context.moveTo(131, 66);
      context.lineTo(131, 194);
      context.moveTo(67, 130);
      context.lineTo(195, 130);
      context.stroke();
      context.strokeStyle = "#ffffff";
      context.beginPath();
      context.moveTo(128, 64);
      context.lineTo(128, 192);
      context.moveTo(64, 128);
      context.lineTo(192, 128);
      context.stroke();
      const texture = new THREE.CanvasTexture(textureCanvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    const primary = parseColor(appearance.colorA);
    const secondary = parseColor(appearance.colorB);
    const blend = primary.clone().lerp(secondary, 0.5);
    const sideA = primary.clone().lerp(new THREE.Color("#ffffff"), 0.55);
    const sideB = appearance.mode === "gradient"
      ? secondary.clone().lerp(new THREE.Color("#ffffff"), 0.55)
      : sideA;
    const plusTextureA = createPlusTexture(sideA.getStyle());
    const plusTextureB = createPlusTexture(sideB.getStyle());

    const sharedGlassProps = {
      transmission: 0.78,
      thickness: 1.9,
      ior: 1.22,
      attenuationDistance: 1.4,
      attenuationColor: blend,
      metalness: 0,
      roughness: 0.82,
      clearcoat: 0,
      clearcoatRoughness: 1,
      specularIntensity: 0.08,
      transparent: true,
      opacity: 0.72,
    } satisfies Partial<THREE.MeshPhysicalMaterialParameters>;

    const rightMaterial = new THREE.MeshPhysicalMaterial({
      ...sharedGlassProps,
      color: sideA.clone().lerp(new THREE.Color("#ffffff"), 0.15),
      emissive: primary.clone().multiplyScalar(0.15),
      emissiveIntensity: 0.52,
    });
    const leftMaterial = new THREE.MeshPhysicalMaterial({
      ...sharedGlassProps,
      color: sideB.clone().lerp(new THREE.Color("#ffffff"), 0.15),
      emissive: secondary.clone().multiplyScalar(0.15),
      emissiveIntensity: 0.52,
    });
    const topMaterial = new THREE.MeshPhysicalMaterial({
      ...sharedGlassProps,
      color: blend.clone().lerp(new THREE.Color("#ffffff"), 0.15),
      emissive: blend.clone().multiplyScalar(0.18),
      emissiveIntensity: 0.48,
    });
    const bottomMaterial = new THREE.MeshPhysicalMaterial({
      ...sharedGlassProps,
      color: blend.clone().lerp(new THREE.Color("#ffffff"), 0.15),
      emissive: blend.clone().multiplyScalar(0.12),
      emissiveIntensity: 0.45,
    });
    const plusFrontMaterial = new THREE.MeshPhysicalMaterial({
      ...sharedGlassProps,
      color: sideA.clone().lerp(new THREE.Color("#ffffff"), 0.15),
      map: plusTextureA ?? undefined,
      emissive: new THREE.Color("#ffffff"),
      emissiveIntensity: 1.18,
    });
    const plusBackMaterial = new THREE.MeshPhysicalMaterial({
      ...sharedGlassProps,
      color: sideB.clone().lerp(new THREE.Color("#ffffff"), 0.15),
      map: plusTextureB ?? undefined,
      emissive: new THREE.Color("#ffffff"),
      emissiveIntensity: 1.18,
    });

    const geometry = new RoundedBoxGeometry(1.55, 1.55, 1.55, 4, 0.24);
    const cube = new THREE.Mesh(geometry, [
      rightMaterial,
      leftMaterial,
      topMaterial,
      bottomMaterial,
      plusFrontMaterial,
      plusBackMaterial,
    ]);
    scene.add(cube);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(primary.getHex(), 0.52);
    fillLight.position.set(-3, -2, -4);
    scene.add(fillLight);
    const rimLight = new THREE.PointLight(secondary.getHex(), 0.46, 8);
    rimLight.position.set(0, 0.4, 2.4);
    scene.add(rimLight);
    scene.add(new THREE.AmbientLight(0xbfdfff, 0.55));

    let frame = 0;
    let rafId = 0;
    const renderFrame = () => {
      frame += 1;
      const t = frame * 0.012;
      cube.rotation.x = -0.32 + Math.sin(t * 0.7) * 0.08;
      cube.rotation.y = t;
      cube.position.y = Math.sin(t * 1.2) * 0.14;
      renderer.render(scene, camera);
      rafId = window.requestAnimationFrame(renderFrame);
    };
    renderFrame();

    return () => {
      window.cancelAnimationFrame(rafId);
      geometry.dispose();
      rightMaterial.dispose();
      leftMaterial.dispose();
      topMaterial.dispose();
      bottomMaterial.dispose();
      plusFrontMaterial.dispose();
      plusBackMaterial.dispose();
      plusTextureA?.dispose();
      plusTextureB?.dispose();
      renderer.dispose();
    };
  }, [appearance]);

  return (
    <div
      data-plus-cube="true"
      role="button"
      tabIndex={0}
      aria-label="Toggle widget options"
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.currentTarget.click();
        }
      }}
      className="plus-cube-btn"
      style={{ ["--plus-cube-glow" as string]: glowCss }}
    >
      <canvas className="plus-cube-btn__canvas" ref={canvasRef} aria-hidden="true" />
      <span className="plus-cube-btn__fallback" ref={fallbackRef} aria-hidden="true" hidden>
        +
      </span>
    </div>
  );
}
