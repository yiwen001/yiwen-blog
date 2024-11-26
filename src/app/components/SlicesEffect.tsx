import * as THREE from 'three';
import { useEffect, useRef } from 'react';

const SphereEffect = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const sliceCount = 8;
    const slices = [];
    const spacing = 0.4;
    const maxRadius = 1.5; // 最大半径（中间切片的半径）

    // 创建切片
    for (let i = 0; i < sliceCount; i++) {
      // 计算对称的位置（-1 到 1 之间）
      const normalizedPos = (i / (sliceCount - 1)) * 2 - 1; // -1 到 1
      
      // 使用抛物线函数计算半径，确保中间最大，两边对称
      const radius = maxRadius * (1 - 0.5 * normalizedPos * normalizedPos);
      
      // 使用类似的函数计算y偏移，但幅度更小
      const yOffset = -0.2 * normalizedPos * normalizedPos;
      
      const geometry = new THREE.CircleGeometry(radius, 64);
      const material = new THREE.MeshBasicMaterial({
        color: 0xff69b4,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });

      const slice = new THREE.Mesh(geometry, material);
      const initialX = (i - sliceCount / 2) * spacing;
      
      slice.position.x = initialX;
      slice.position.y = yOffset;
      slice.rotation.y = Math.PI / 2;
      
      slices.push({
        mesh: slice,
        initialX: initialX,
        initialY: yOffset,
        material: material
      });
      scene.add(slice);
    }

    camera.position.z = 4;

    // 鼠标交互
    const mouse = new THREE.Vector2();
    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      slices.forEach((slice) => {
        // 位置动画
        const moveOffset = (time * 0.5) % (spacing * sliceCount);
        let newX = slice.initialX - moveOffset;
        if (newX < -(spacing * sliceCount / 2)) {
          newX += spacing * sliceCount;
        }
        slice.mesh.position.x = newX;
        
        // 保持y轴位置
        slice.mesh.position.y = slice.initialY;

        // 计算切片位置的归一化值（0-1）
        const normalizedX = newX + (spacing * sliceCount / 2);
        const slicePosition = normalizedX / (spacing * sliceCount);

        // 平滑的缩放和透明度过渡
        if (slicePosition < 0.2) { // 增加过渡区间
          // 从1缩小到0
          const progress = slicePosition / 0.2; // 0-1
          const scale = progress;
          const opacity = progress * 0.8; // 最大透明度为0.8
          
          slice.mesh.scale.set(scale, scale, 1);
          slice.material.opacity = opacity;
        } else if (slicePosition > 0.8) { // 增加过渡区间
          // 从0放大到1
          const progress = (1 - slicePosition) / 0.2; // 0-1
          const scale = progress;
          const opacity = progress * 0.8; // 最大透明度为0.8
          
          slice.mesh.scale.set(scale, scale, 1);
          slice.material.opacity = opacity;
        } else {
          // 中间的切片保持原始大小和透明度
          slice.mesh.scale.set(1, 1, 1);
          slice.material.opacity = 0.8;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // 清理
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100vh',
        background: 'transparent'
      }} 
    />
  );
};

export default SphereEffect;