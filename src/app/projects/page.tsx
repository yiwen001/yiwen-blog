// pages/content/projects/page.tsx

"use client";
import React, { useRef, useEffect, useState } from 'react';
import styles from './page.module.sass';

type Project = {
  title: string;
  description: string;
  url: string;
  image: string;
};

const projects: Project[] = [
  {
    title: 'LeetMemo',
    description: '使用艾宾浩斯遗忘曲线高效复习 LeetCode 题目',
    url: 'http://43.142.161.179:8080/login',
    image: '/leetmemo.png'
  },
  {
    title: 'Luospace',
    description: 'Visual Communication Design & Information Experience Design',
    url: 'https://luospace.vercel.app/',
    image: '/luospace.png'
  }
];

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  color: [number, number, number];
  size: number;
  alpha: number;
  breathOffset: number;
  breathSpeed: number;
}

const noise = (x: number, y: number): number => {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
};

const fbm = (x: number, y: number): number => {
  let value = 0;
  let amplitude = 0.5;
  for (let i = 0; i < 4; i++) {
    value += amplitude * noise(x, y);
    x *= 2;
    y *= 2;
    amplitude *= 0.5;
  }
  return value;
};

interface ParticleImageProps {
  src: string;
  alt: string;
  onClick?: () => void;
}

const ParticleImage: React.FC<ParticleImageProps> = ({ src, alt, onClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);
  const hoverProgressRef = useRef(0);
  const isHoveringRef = useRef(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const image = new Image();
    image.crossOrigin = 'anonymous';
    
    image.onload = () => {
      imageRef.current = image;
      
      const maxWidth = 800;
      const aspectRatio = image.height / image.width;
      const width = Math.min(image.width, maxWidth);
      const height = width * aspectRatio;
      
      setDimensions({ width, height });
      
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      ctx.drawImage(image, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width * dpr, height * dpr);
      const pixels = imageData.data;

      const particles: Particle[] = [];
      const centerX = width / 2;
      const centerY = height / 2;

      const gap = 8;
      const particleSize = 3;

      for (let y = 0; y < height * dpr; y += gap) {
        for (let x = 0; x < width * dpr; x += gap) {
          const px = x / dpr;
          const py = y / dpr;
          
          const i = (y * width * dpr + x) * 4;
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];

          if (a < 30) continue;

          const dx = (px - centerX) / centerX;
          const dy = (py - centerY) / centerY;
          const distFromCenter = Math.sqrt(dx * dx + dy * dy);

          const noiseVal = fbm(px * 0.01, py * 0.01);
          const noiseVal2 = fbm(px * 0.02 + 100, py * 0.02 + 100);
          
          const irregularRadius = 0.4 + noiseVal * 0.4 + noiseVal2 * 0.2;
          const adjustedDist = distFromCenter / irregularRadius;

          const centerSkip = Math.random() < 0.15;
          if (centerSkip) continue;

          const edgeStart = 0.6;
          let shouldSkip = false;
          
          if (adjustedDist > edgeStart) {
            const skipChance = Math.pow((adjustedDist - edgeStart) / (1.3 - edgeStart), 1.2);
            const skipNoise = noise(px * 0.05, py * 0.05);
            if (Math.random() < skipChance * 0.85 + skipNoise * 0.1) {
              shouldSkip = true;
            }
          }
          
          if (shouldSkip) continue;

          let alphaFade = 1;
          if (adjustedDist > edgeStart) {
            alphaFade = 1 - Math.pow((adjustedDist - edgeStart) / (1.2 - edgeStart), 1.5);
            alphaFade = Math.max(0, Math.min(1, alphaFade));
            alphaFade *= (0.7 + noiseVal * 0.3);
          }

          if (alphaFade < 0.03) continue;

          particles.push({
            x: px,
            y: py,
            originX: px,
            originY: py,
            color: [r, g, b],
            size: particleSize + Math.random() * 1,
            alpha: alphaFade * (a / 255),
            breathOffset: Math.random() * Math.PI * 2,
            breathSpeed: 0.2 + Math.random() * 0.3
          });
        }
      }

      particlesRef.current = particles;
      setLoaded(true);
    };

    image.src = src;

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [src]);

  useEffect(() => {
    if (!loaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensions;
    const dpr = window.devicePixelRatio || 1;

    const animate = () => {
      timeRef.current += 0.016;
      const time = timeRef.current;

      // 平滑过渡
      const targetProgress = isHoveringRef.current ? 1 : 0;
      hoverProgressRef.current += (targetProgress - hoverProgressRef.current) * 0.1;
      const progress = hoverProgressRef.current;
      
      ctx.clearRect(0, 0, width, height);

      // 绘制原图（根据 hover 进度调整透明度）
      if (progress > 0.01 && imageRef.current) {
        ctx.globalAlpha = progress;
        ctx.drawImage(imageRef.current, 0, 0, width, height);
        ctx.globalAlpha = 1;
      }

      // 绘制粒子（根据 hover 进度调整透明度）
      const particleAlpha = 1 - progress;
      
      if (particleAlpha > 0.01) {
        particlesRef.current.forEach(particle => {
          const breathe = Math.sin(time * particle.breathSpeed + particle.breathOffset);
          const sizeMod = 1 + breathe * 0.08;
          const currentSize = particle.size * sizeMod;

          const waveFrequency = 0.02;
          const waveAmplitude = 2;
          const waveSpeed = 2;
          
          const wave1 = Math.sin(particle.originX * waveFrequency + time * waveSpeed) * waveAmplitude;
          const wave2 = Math.sin(particle.originX * waveFrequency * 1.5 + particle.originY * 0.01 + time * waveSpeed * 0.8) * waveAmplitude * 0.5;
          
          const waveOffsetY = wave1 + wave2;
          const waveOffsetX = Math.sin(particle.originY * waveFrequency + time * waveSpeed * 0.5) * waveAmplitude * 0.3;

          const [r, g, b] = particle.color;

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${particle.alpha * particleAlpha})`;
          ctx.fillRect(
            particle.originX + waveOffsetX - currentSize / 2,
            particle.originY + waveOffsetY - currentSize / 2,
            currentSize,
            currentSize
          );
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationRef.current);
  }, [loaded, dimensions]);

  const handleMouseEnter = () => {
    isHoveringRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
  };

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        opacity: loaded ? 1 : 0
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      aria-label={alt}
    />
  );
};

export default function Index() {
  return (
    <div className={styles.container}>
      {projects.map((project, index) => (
        <div key={index} className={styles.card}>
          <ParticleImage
            src={project.image}
            alt={`${project.title} Image`}
            onClick={() => window.open(project.url, '_blank')}
          />
        </div>
      ))}
    </div>
  );
}