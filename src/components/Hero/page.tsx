"use client";

import * as THREE from "three";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { TextAnimate } from "@/components/magicui/text-animate";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const router = useRouter();

  const handleExplore = () => {
    router.push("/products");
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section || canvas.dataset.init === "true") return;

    canvas.dataset.init = "true";
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      section.clientWidth / section.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(section.clientWidth, section.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const pointLight = new THREE.PointLight(0xffffff, 1.5, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-10, 10, 10);
    scene.add(directionalLight);

    // Shapes
    const geometries = [
      new THREE.SphereGeometry(4, 32, 32),
      new THREE.BoxGeometry(5, 5, 5),
      new THREE.ConeGeometry(4, 9, 60),
      new THREE.CylinderGeometry(2.5, 2.5, 6, 32),
      new THREE.TorusGeometry(4, 1.2, 16, 100),
      new THREE.TetrahedronGeometry(3),
      new THREE.OctahedronGeometry(3.5),
      new THREE.DodecahedronGeometry(6),
    ];

    const positions = [
      [-60, -20, -10],
      [26, -10, 10],
      [-10, -15, 5],
      [45, 20, -5],
      [-5, 12, 15],
      [20, -10, -15],
      [-22, 6, 18],
      [19, 20, -12],
    ];

    const shapes: THREE.Mesh[] = geometries.map((geo, i) => {
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(Math.random(), Math.random(), Math.random()),
        roughness: 0.5,
        metalness: 0.5,
      });

      const mesh = new THREE.Mesh(geo, material);
      mesh.position.set(...(positions[i] as [number, number, number]));
      scene.add(mesh);
      return mesh;
    });

    camera.position.z = 40;

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      shapes.forEach((shape) => {
        shape.rotation.x += 0.005;
        shape.rotation.y += 0.007;
      });
      renderer.render(scene, camera);
    };
    animate();

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });

    resizeObserver.observe(section);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationId);
      canvas.dataset.init = "false";

      shapes.forEach((shape) => {
        shape.geometry.dispose();
        if (Array.isArray(shape.material)) {
          shape.material.forEach((mat) => mat.dispose());
        } else {
          shape.material.dispose();
        }
      });

      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flex flex-col items-center justify-center h-svh bg-gray-50 relative overflow-hidden homeContainer"
    >
      <h2 className="text-[2rem] sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center z-2">
        <TextAnimate animation="slideUp" by="word">
          Discover High Quality 3D Assets
        </TextAnimate>
      </h2>

      <TextAnimate
        animation="blurIn"
        by="word"
        className="text-gray-600 mb-8 max-w-lg text-center z-2"
      >
        Find, buy, and customize stunning 3D models for your projects.
      </TextAnimate>

      <Input
        className="w-full max-w-lg mx-auto mb-4 p-4 rounded-lg bg-gray-100 focus:ring-2 focus:ring-gray-400 z-2"
        placeholder="Search 3D Assets..."
      />
      <Button className="text-sm z-2" variant="default" onClick={handleExplore}>
        Explore Now
      </Button>

      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
      />

    </section>
  );
}
