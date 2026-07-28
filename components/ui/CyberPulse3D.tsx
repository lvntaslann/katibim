"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export interface CyberPulse3DProps {
  speed?: number; // e.g. WPM or intensity, scales animation speed and wave amplitude
  className?: string;
  heightClassName?: string;
}

export function CyberPulse3D({
  speed = 50,
  className = "",
  heightClassName = "h-48",
}: CyberPulse3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Accessibility: check reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const speedMultiplier = prefersReducedMotion ? 0.1 : Math.max(0.5, Math.min(3, speed / 40));

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const width = containerRef.current.clientWidth || 400;
    const height = containerRef.current.clientHeight || 200;
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, -12, 12);
    camera.lookAt(0, 0, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 4. Particle Wave Grid
    const columns = 36;
    const rows = 24;
    const particleCount = columns * rows;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const baseColor = new THREE.Color("#4fbdb3"); // Teal accent
    const peakColor = new THREE.Color("#7ed4cb"); // Cyan accent strong

    let index = 0;
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        const x = (i - columns / 2) * 0.7;
        const y = (j - rows / 2) * 0.7;
        positions[index * 3] = x;
        positions[index * 3 + 1] = y;
        positions[index * 3 + 2] = 0;

        colors[index * 3] = baseColor.r;
        colors[index * 3 + 1] = baseColor.g;
        colors[index * 3 + 2] = baseColor.b;

        index++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Particle Texture/Material
    const material = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // 5. Interactive Mouse Parallax
    let targetRotationX = 0;
    let targetRotationY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      targetRotationY = x * 0.2;
      targetRotationX = y * 0.2;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 6. Animation Loop
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.04 * speedMultiplier;

      const posArr = geometry.attributes.position.array as Float32Array;
      const colArr = geometry.attributes.color.array as Float32Array;

      let idx = 0;
      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          const x = (i - columns / 2) * 0.7;
          const y = (j - rows / 2) * 0.7;

          // Cybernetic wave equation
          const z = Math.sin(i * 0.3 + time) * Math.cos(j * 0.3 + time) * (1.2 + speedMultiplier * 0.5);
          posArr[idx * 3 + 2] = z;

          // Color shift based on wave height
          const waveRatio = (z + 2) / 4;
          const tempColor = baseColor.clone().lerp(peakColor, waveRatio);
          colArr[idx * 3] = tempColor.r;
          colArr[idx * 3 + 1] = tempColor.g;
          colArr[idx * 3 + 2] = tempColor.b;

          idx++;
        }
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;

      // Smooth camera parallax easing
      particleSystem.rotation.x += (targetRotationX - particleSystem.rotation.x) * 0.05;
      particleSystem.rotation.y += (targetRotationY - particleSystem.rotation.y) * 0.05;
      particleSystem.rotation.z = Math.sin(time * 0.2) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Responsive Resize Handling
    const handleResize = () => {
      if (!containerRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      if (newW && newH) {
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-surface/50 to-surface/90 border border-hairline/60 shadow-inner dark:border-white/5 dark:from-[#181715]/60 dark:to-[#141413]/90 ${heightClassName} ${className}`}
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />
    </div>
  );
}
