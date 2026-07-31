"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * An interactive, physically-rendered chrome artifact.
 *
 * The realism comes from image-based lighting: a PMREM-prefiltered studio
 * environment drives true reflections on a polished metal surface, rather than
 * faking depth with glows. Drag to spin — the rotation carries inertia.
 *
 * Rendering pauses whenever the canvas leaves the viewport so it never competes
 * with the hero's 3D scene for frame budget.
 */
export default function ChromeArtifact({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---------- Renderer ----------
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      return; // No WebGL — the CSS fallback beneath stays visible.
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(mount.clientWidth || 1, mount.clientHeight || 1, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const canvas = renderer.domElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.cursor = "grab";
    canvas.style.touchAction = "pan-y"; // keep vertical page scrolling on touch
    mount.appendChild(canvas);

    // ---------- Scene ----------
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    // Image-based lighting — the source of the realistic reflections.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;

    const geometry = new THREE.TorusKnotGeometry(1.05, 0.34, 340, 48);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xf2f4f7,
      metalness: 1,
      roughness: 0.08,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      envMapIntensity: 1.35,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // A cool rim light separates the silhouette from the black background.
    const rim = new THREE.DirectionalLight(0xffffff, 1.2);
    rim.position.set(-3, 2.5, 2.5);
    scene.add(rim);

    // ---------- Interaction state ----------
    let rotX = 0.35;
    let rotY = 0.6;
    let velX = 0;
    let velY = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let pointerX = 0; // -1..1 across the canvas
    let pointerY = 0;

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.style.cursor = "grabbing";
      canvas.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      if (!dragging) return;
      velY += (e.clientX - lastX) * 0.0045;
      velX += (e.clientY - lastY) * 0.0045;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const endDrag = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      canvas.style.cursor = "grab";
      if (canvas.hasPointerCapture(e.pointerId)) {
        canvas.releasePointerCapture(e.pointerId);
      }
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);

    // ---------- Sizing ----------
    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // ---------- Visibility gating ----------
    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.01 }
    );
    io.observe(mount);

    // ---------- Loop ----------
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;

      // Constant idle drift plus decaying inertia from the last drag.
      rotY += velY + (reduced || dragging ? 0 : 0.0026);
      rotX += velX;
      velX *= 0.93;
      velY *= 0.93;

      // Keep the object from tumbling fully over on the vertical axis.
      rotX = Math.max(-0.9, Math.min(0.9, rotX));

      mesh.rotation.x = rotX;
      mesh.rotation.y = rotY;

      // Gentle camera parallax toward the cursor.
      camera.position.x += (pointerX * 0.45 - camera.position.x) * 0.04;
      camera.position.y += (-pointerY * 0.35 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    loop();

    // ---------- Cleanup ----------
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", endDrag);
      canvas.removeEventListener("pointercancel", endDrag);

      geometry.dispose();
      material.dispose();
      envRT.dispose();
      pmrem.dispose();
      roomEnv.dispose();
      renderer.dispose();
      if (canvas.parentNode === mount) mount.removeChild(canvas);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={className}
      role="img"
      aria-label="Interactive polished-chrome sculpture rendered in real time. Drag to rotate."
    />
  );
}
