"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

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
  const { resolvedTheme } = useTheme();

  const speedRef = useRef(speed);
  speedRef.current = speed;
  const themeRef = useRef(resolvedTheme);
  themeRef.current = resolvedTheme;

  useEffect(() => {
    if (!containerRef.current) return;

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
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.pointerEvents = "none";

    // Clean up any lingering canvases from HMR or Strict Mode before appending
    const existingCanvases = containerRef.current.querySelectorAll("canvas");
    existingCanvases.forEach((c) => c.remove());

    containerRef.current.appendChild(renderer.domElement);

    // 4. Particle Wave Grid
    const columns = 36;
    const rows = 24;
    const particleCount = columns * rows;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const baseColorLight = new THREE.Color("#0f766e");
    const peakColorLight = new THREE.Color("#042f2e");
    const baseColorDark = new THREE.Color("#4fbdb3");
    const peakColorDark = new THREE.Color("#7ed4cb");

    let index = 0;
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        const x = (i - columns / 2) * 0.7;
        const y = (j - rows / 2) * 0.7;
        positions[index * 3] = x;
        positions[index * 3 + 1] = y;
        positions[index * 3 + 2] = 0;

        colors[index * 3] = baseColorDark.r;
        colors[index * 3 + 1] = baseColorDark.g;
        colors[index * 3 + 2] = baseColorDark.b;

        index++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

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
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const currentSpeedMultiplier = prefersReducedMotion ? 0.1 : Math.max(0.5, Math.min(3, speedRef.current / 40));
      time += 0.04 * currentSpeedMultiplier;

      const isDark = themeRef.current !== "light";
      const currentBaseColor = isDark ? baseColorDark : baseColorLight;
      const currentPeakColor = isDark ? peakColorDark : peakColorLight;

      material.size = isDark ? 0.18 : 0.24;
      material.opacity = isDark ? 0.85 : 1.0;

      const posArr = geometry.attributes.position.array as Float32Array;
      const colArr = geometry.attributes.color.array as Float32Array;

      let idx = 0;
      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          const x = (i - columns / 2) * 0.7;
          const y = (j - rows / 2) * 0.7;

          // Cybernetic wave equation
          const z = Math.sin(i * 0.3 + time) * Math.cos(j * 0.3 + time) * (1.2 + currentSpeedMultiplier * 0.5);
          posArr[idx * 3 + 2] = z;

          // Color shift based on wave height
          const waveRatio = (z + 2) / 4;
          const tempColor = currentBaseColor.clone().lerp(currentPeakColor, waveRatio);
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
    let lastW = 0;
    let lastH = 0;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newW = Math.round(entry.contentRect.width);
        const newH = Math.round(entry.contentRect.height);
        if (newW > 0 && newH > 0 && (newW !== lastW || newH !== lastH)) {
          lastW = newW;
          lastH = newH;
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-surface/50 to-surface/90 border border-hairline/60 shadow-inner dark:border-white/5 dark:from-[#181715]/60 dark:to-[#141413]/90 ${heightClassName} ${className}`}
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />
    </div>
  );
}
