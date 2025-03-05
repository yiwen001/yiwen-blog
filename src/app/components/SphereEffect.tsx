import * as THREE from 'three';
import { useEffect, useRef } from 'react';

const SphereEffect = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastPlayTime = useRef<number>(0);
  
  useEffect(() => {
    if (!containerRef.current) return;

    // 创建场景
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // 创建 Web Audio Context
    audioContextRef.current = new AudioContext();

    // 创建音效函数
    const playSound = (mouseX: number) => {
      if (!audioContextRef.current) return;
      
      const currentTime = Date.now();
      if (currentTime - lastPlayTime.current < 150) return; // 150ms节流
      
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      // 创建滤波器
      const filter = audioContextRef.current.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1000 + mouseX * 500; // 根据鼠标位置改变频率
      filter.Q.value = 1.5; // 增加 Q 值使音色更清晰
      
      // 设置音色
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(200 + mouseX * 200, audioContextRef.current.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        150,
        audioContextRef.current.currentTime + 0.2
      );
      
      // 设置音量包络
      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.9, audioContextRef.current.currentTime + 0.01); // 增加音量到 0.7
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.2);
      
      // 连接节点
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      // 播放声音
      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.2);
      
      lastPlayTime.current = currentTime;
    };

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
        //try again
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
        mousePos: { value: new THREE.Vector2(0, 0) },
        prevMousePos: { value: new THREE.Vector2(0, 0) }
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

        // 播放动态音效
        playSound(point.x);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default SphereEffect;