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
    const geometry = new THREE.SphereGeometry(1, 100, 100);

    // 自定义着色器
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      uniform float time;
      uniform vec2 mousePos;
      
      void main() {
        vUv = uv;
        vNormal = normal;
        
        vec3 pos = position;
        // 基础波浪效果（沿x轴）
        float baseWave = sin(position.x * 27.0 + time) * 0.3;
        
        // 计算到鼠标的距离，但只考虑y轴方向的影响
        float distanceToMouse = abs(position.x - mousePos.x);
        float mouseEffect = exp(-distanceToMouse * 3.0); // 指数衰减
        
        // 在x方向上产生额外的畸变
        float distortion = mouseEffect * sin(position.x * 27.0 + time) * 0.1;
        
        // 组合效果：基础波浪 + 鼠标引起的畸变
        float displacement = baseWave + distortion;
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
        vec3 light = normalize(vec3(10, 5, 20));
        float diff = dot(vNormal, light);
        
        gl_FragColor = vec4(color * diff,100.0);
      }
    `;

    // 创建材质
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        mousePos: { value: new THREE.Vector2(0, 0) }
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

    // 添加这些变量的定义
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let prevMousePosition = new THREE.Vector3();

    // 修改鼠标移动处理函数
    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(sphere);

      if (intersects.length > 0) {
        // 保存前一帧的位置
        prevMousePosition.copy(material.uniforms.mousePos.value);
        
        // 更新当前位置
        const point = intersects[0].point;
        material.uniforms.mousePos.value.copy(point);
        material.uniforms.prevMousePos.value.copy(prevMousePosition);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      // window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default SphereEffect;