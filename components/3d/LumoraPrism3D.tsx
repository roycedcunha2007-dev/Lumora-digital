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
      opacity: 0.45,
    });
    const wireframeMesh = new THREE.LineSegments(wireframeGeo, wireframeMat);

    // Outer Glass Refractive Material
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0c122b,
      metalness: 0.15,
      roughness: 0.08,
      transmission: 0.92,
      ior: 1.55,
      thickness: 1.4,
      specularIntensity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      transparent: true,
      opacity: 0.88,
    });

    const prismMesh = new THREE.Mesh(geometry, glassMat);
    prismMesh.add(wireframeMesh);
    scene.add(prismMesh);

    // Secondary Holographic 3D Ring
    const ringGeo = new THREE.TorusGeometry(2.8, 0.03, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.4,
      wireframe: true,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    scene.add(ringMesh);

    // Floating 3D Star/Crystal Particles
    const particleCount = 40;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 16;
      particlePos[i + 1] = (Math.random() - 0.5) * 16;
      particlePos[i + 2] = (Math.random() - 0.5) * 10;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Ambient & Point Lights for Refraction Beams
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 4.5, 22);
    cyanLight.position.set(4, 4, 4);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0x8b5cf6, 4.5, 22);
    purpleLight.position.set(-4, -4, 4);
    scene.add(purpleLight);

    const blueLight = new THREE.PointLight(0x2563eb, 3.5, 22);
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

        ringMesh.rotation.x = elapsedTime * -0.15 + mouse.y * 0.3;
        ringMesh.rotation.y = elapsedTime * 0.2 + mouse.x * 0.3;

        particleSystem.rotation.y = elapsedTime * 0.05;

        // Scroll translation & rotation modulation
        const scrollFactor = scrollY * 0.0012;
        prismMesh.position.y = Math.sin(elapsedTime * 0.8) * 0.2 - scrollFactor * 0.5;
        prismMesh.position.x = mouse.x * 0.4;
        prismMesh.rotation.z = scrollFactor * 1.5;

        ringMesh.position.y = prismMesh.position.y;
        ringMesh.position.x = prismMesh.position.x;

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
      ringGeo.dispose();
      ringMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
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
