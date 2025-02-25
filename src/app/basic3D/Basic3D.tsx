import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Basic3D = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // 1. 创建场景
        const scene = new THREE.Scene();
        
        // 2. 创建相机
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0,0,10);
    

        // 3. 创建渲染器
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x333333);
        containerRef.current.appendChild(renderer.domElement);

        // 4. 创建立方体
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const material = new THREE.MeshStandardMaterial({
            color: 0x00ff00, // 金属的基本颜色
            metalness: 0.8,   // 金属度，1表示完全金属
            roughness: 0.2  // 粗糙度，0表示完全光滑
        });
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(0,  5, -3);
        scene.add(pointLight);

        // // 添加坐标轴辅助对象
        // const axesHelper = new THREE.AxesHelper(5); // 参数5表示轴线的长度
        // scene.add(axesHelper);

        // 添加点光源辅助对象
        const sphereSize = 1;
        const lightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
        scene.add(lightHelper);

        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // 5. 动画循环
        const animate = () => {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.05;
            cube.rotation.y += 0.05;
            renderer.render(scene, camera);
        };
        animate();

        // 6. 处理窗口大小变化
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // 7. 清理函数
        return () => {
            window.removeEventListener('resize', handleResize);
            containerRef.current?.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default Basic3D;