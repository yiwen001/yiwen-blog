import * as THREE from 'three';
import { useEffect, useRef } from 'react';

const SphereEffect = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastPlayTime = useRef<number>(0);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    audioContextRef.current = new AudioContext();

    const playSound = (mouseX: number) => {
      if (!audioContextRef.current) return;
      
      const currentTime = Date.now();
      if (currentTime - lastPlayTime.current < 150) return;
      
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      const filter = audioContextRef.current.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1000 + mouseX * 500;
      filter.Q.value = 1.5;
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(200 + mouseX * 200, audioContextRef.current.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        150,
        audioContextRef.current.currentTime + 0.2
      );
      
      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.9, audioContextRef.current.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.2);
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.2);
      
      lastPlayTime.current = currentTime;
    };

    const geometry = new THREE.SphereGeometry(1, 100, 100);

    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      uniform float time;
      uniform vec2 mousePos;
      uniform float openProgress;
      
      void main() {
        vUv = uv;
        vNormal = normal;
        vec3 pos = position;
        
        float baseWave = sin(position.x * 27.0 + time) * 0.3;
        
        float distanceToMouse = abs(position.x - mousePos.x);
        float mouseEffect = exp(-distanceToMouse * 3.0);
        
        float distortion = mouseEffect * sin(position.x * 27.0 + time) * 0.1;
        
        float displacement = baseWave + distortion;
        
        if (openProgress > 0.0) {
          float extraWave = sin(position.y * 20.0 + time * 2.0) * 0.8 * openProgress;
          extraWave += sin(position.z * 15.0 + time * 1.5) * 0.5 * openProgress;
          extraWave += sin(position.x * 37.0 + time * 1.2) * 0.6 * openProgress;
          displacement += extraWave;
        }
        
        pos += normal * displacement;
        
        vPosition = pos;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      uniform float time;
      uniform float openProgress;
      
      void main() { 
        vec3 color1 = vec3(0.5 + 0.5 * sin(time), 0.5, 0.8);
        vec3 color2 = vec3(0.2, 0.6, 0.9);
        vec3 color3 = vec3(0.9, 0.4, 0.6);
        
        vec3 finalColor = color1;
        
        if (openProgress > 0.0) {
          float gradient = (vPosition.x + 1.0) * 0.5;
          float wave = sin(gradient * 10.0 + time) * 0.5 + 0.5;
          
          finalColor = mix(color2, color3, gradient);
          finalColor = mix(color1, finalColor, openProgress);
          finalColor += wave * 0.1 * openProgress;
        }
        
        vec3 light = normalize(vec3(10, 5, 20));
        float diff = dot(vNormal, light);
        
        gl_FragColor = vec4(finalColor * diff, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        mousePos: { value: new THREE.Vector2(0, 0) },
        prevMousePos: { value: new THREE.Vector2(0, 0) },
        openProgress: { value: 0 }
      },
      vertexShader,
      fragmentShader,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    
    sphereRef.current = sphere;

    camera.position.z = 3;

    let targetPosition = { x: 0, y: 0 };
    let targetOpenProgress = 0;

    const animate = () => {
      requestAnimationFrame(animate);
      
      material.uniforms.time.value += 0.01;
      
      sphere.rotation.x += 0.001;
      sphere.rotation.y += 0.002;
      
      const lerpFactor = 0.05;
      
      sphere.position.x += (targetPosition.x - sphere.position.x) * lerpFactor;
      sphere.position.y += (targetPosition.y - sphere.position.y) * lerpFactor;
      
      const currentOpenProgress = material.uniforms.openProgress.value;
      const newOpenProgress = currentOpenProgress + (targetOpenProgress - currentOpenProgress) * lerpFactor;
      material.uniforms.openProgress.value = newOpenProgress;
      
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let prevMousePosition = new THREE.Vector3();

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(sphere);

      if (intersects.length > 0) {
        prevMousePosition.copy(material.uniforms.mousePos.value);
        
        const point = intersects[0].point;
        material.uniforms.mousePos.value.copy(point);
        material.uniforms.prevMousePos.value.copy(prevMousePosition);

        playSound(point.x);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      if (scrollY > windowHeight * 0.5) {
        const scrollProgress = Math.min((scrollY - windowHeight * 0.5) / (windowHeight * 0.5), 1);
        
        targetPosition = { x: -4, y: -2 };
        targetOpenProgress = scrollProgress;
      } else {
        targetPosition = { x: 0, y: 0 };
        targetOpenProgress = 0;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default SphereEffect;
