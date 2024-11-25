import * as THREE from 'three';
import { useEffect, useRef } from 'react';

const SphereEffect = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    // 创建场景
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // 创建球体
    const geometry = new THREE.SphereGeometry(1, 64, 64);

    // 自定义着色器
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      uniform float time;
      
      void main() {
        vUv = uv;
        vNormal = normal;
        
        // 添加波浪效果
        vec3 pos = position;
        float displacement = sin(position.x * 10.0 + time) * 0.1;
        pos += normal * displacement;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      uniform float time;
      
      void main() {
        vec3 color = vec3(0.5 + 0.5 * sin(time), 0.5, 0.8);
        vec3 light = normalize(vec3(1.0, 1.0, 1.0));
        float diff = dot(vNormal, light);
        
        gl_FragColor = vec4(color * diff, 1.0);
      }
    `;

    // 创建材质
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader,
      fragmentShader,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    camera.position.z = 3;

    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate);
      
      // 更新时间uniform
      material.uniforms.time.value += 0.01;
      
      // 旋转球体
      sphere.rotation.x += 0.001;
      sphere.rotation.y += 0.002;
      
      renderer.render(scene, camera);
    };

    animate();

    // 处理窗口大小变化
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default SphereEffect;