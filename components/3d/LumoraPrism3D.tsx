"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function LumoraPrism3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check reduced motion
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Create Octahedron / Prism Geometry
    const geometry = new THREE.OctahedronGeometry(1.8, 0);
    
    // Wireframe inner geometry
    const wireframeGeo = new THREE.WireframeGeometry(geometry);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.35,
    });
    const wireframeMesh = new THREE.LineSegments(wireframeGeo, wireframeMat);

    // Outer Glass Refractive Material
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0c122b,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.9,
      ior: 1.5,
      thickness: 1.2,
      specularIntensity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.85,
    });

    const prismMesh = new THREE.Mesh(geometry, glassMat);
    prismMesh.add(wireframeMesh);
    scene.add(prismMesh);

    // Ambient & Point Lights for Refraction Beams
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 4, 20);
    cyanLight.position.set(4, 4, 4);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0x8b5cf6, 4, 20);
    purpleLight.position.set(-4, -4, 4);
    scene.add(purpleLight);

    const blueLight = new THREE.PointLight(0x2563eb, 3, 20);
    blueLight.position.set(0, 5, -2);
    scene.add(blueLight);

    // Mouse & Scroll interaction state
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    const onResize = () => {
      if (!container) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // Animation Loop
    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      if (!reduced) {
        // Base rotation
        prismMesh.rotation.x = elapsedTime * 0.25 + mouse.y * 0.5;
        prismMesh.rotation.y = elapsedTime * 0.35 + mouse.x * 0.5;

        // Scroll translation & rotation modulation
        const scrollFactor = scrollY * 0.0012;
        prismMesh.position.y = Math.sin(elapsedTime * 0.8) * 0.2 - scrollFactor * 0.5;
        prismMesh.position.x = mouse.x * 0.4;
        prismMesh.rotation.z = scrollFactor * 1.5;

        // Animate lights
        cyanLight.position.x = Math.sin(elapsedTime * 0.5) * 5;
        cyanLight.position.y = Math.cos(elapsedTime * 0.5) * 5;
        purpleLight.position.x = -Math.sin(elapsedTime * 0.4) * 5;
        purpleLight.position.y = -Math.cos(elapsedTime * 0.4) * 5;
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      wireframeGeo.dispose();
      wireframeMat.dispose();
      glassMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-60 mix-blend-screen"
      aria-hidden="true"
    />
  );
}
