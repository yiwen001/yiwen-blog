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

// 顶点着色器
const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;

// 片段着色器 - 融化玻璃效果
const fragmentShaderSource = `
  precision highp float;
  
  uniform sampler2D u_image;
  uniform sampler2D u_displacement;
  uniform vec2 u_mouse;
  uniform vec2 u_prevMouse;
  uniform float u_time;
  uniform float u_intensity;
  uniform float u_saturation;
  uniform float u_opacity;
  uniform vec2 u_resolution;
  
  varying vec2 v_texCoord;
  
  // 噪声函数
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for(int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  void main() {
    vec2 uv = v_texCoord;
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
    
    // 计算鼠标影响
    vec2 mouseUV = u_mouse;
    vec2 prevMouseUV = u_prevMouse;
    
    // 到鼠标的距离
    float dist = distance(uv * aspect, mouseUV * aspect);
    float radius = 0.15;
    
    // 鼠标移动方向
    vec2 moveDir = mouseUV - prevMouseUV;
    float moveStrength = length(moveDir) * 10.0;
    
    // 创建融化扭曲效果
    float influence = smoothstep(radius, 0.0, dist);
    influence = pow(influence, 1.5);
    
    // 动态噪声扭曲
    float timeScale = u_time * 0.3;
    vec2 noiseCoord = uv * 6.0 + vec2(timeScale);
    
    float n1 = fbm(noiseCoord);
    float n2 = fbm(noiseCoord + vec2(5.2, 1.3));
    
    // 全局波动效果 - 基于整个UV坐标
    float globalWave = sin(uv.x * 10.0 + u_time * 0.5) * cos(uv.y * 8.0 + u_time * 0.4);
    float globalInfluence = u_intensity * 0.5;
    
    // 融化方向 - 结合鼠标移动和噪声
    vec2 meltDir = vec2(
      cos(n1 * 6.28318 + u_time) * 0.5 + moveDir.x * 5.0 + globalWave * 0.2,
      sin(n2 * 6.28318 + u_time) * 0.5 + moveDir.y * 5.0 + 0.3 + globalWave * 0.2
    );
    
    // 计算扭曲 - 结合鼠标影响和全局波动
    float distortStrength = (u_intensity * influence * (1.0 + moveStrength) + globalInfluence);
    vec2 distortion = meltDir * distortStrength * 0.08;
    
    // 色差效果 - 模拟颜料溶解
    float chromaStrength = influence * u_intensity * 0.02;
    
    vec2 uvR = uv + distortion + vec2(chromaStrength, 0.0);
    vec2 uvG = uv + distortion;
    vec2 uvB = uv + distortion - vec2(chromaStrength, 0.0);
    
    // 边界处理
    uvR = clamp(uvR, 0.0, 1.0);
    uvG = clamp(uvG, 0.0, 1.0);
    uvB = clamp(uvB, 0.0, 1.0);
    
    // 采样颜色
    float r = texture2D(u_image, uvR).r;
    float g = texture2D(u_image, uvG).g;
    float b = texture2D(u_image, uvB).b;
    float a = texture2D(u_image, uvG).a;
    
    vec3 color = vec3(r, g, b);
    
    // 添加玻璃模糊效果
    float blurAmount = influence * u_intensity * 0.01;
    for(float i = 0.0; i < 4.0; i++) {
      float angle = i * 1.5708; // pi/2
      vec2 offset = vec2(cos(angle), sin(angle)) * blurAmount;
      color += texture2D(u_image, uvG + offset).rgb;
    }
    color /= 5.0;
    
    // 玻璃高光效果
    float highlight = pow(influence, 3.0) * 0.15 * u_intensity;
    float glassNoise = fbm(uv * 20.0 + u_time * 0.2);
    highlight *= (0.5 + glassNoise * 0.5);
    
    color += vec3(highlight);
    
    // 边缘折射效果
    float edgeFresnel = pow(1.0 - influence, 2.0) * influence * u_intensity;
    color = mix(color, color * 1.1, edgeFresnel * 0.3);
    
    // 黑白到彩色的渐变效果
    float gray = dot(color, vec3(0.299, 0.587, 0.114));
    vec3 grayColor = vec3(gray);
    
    // 饱和度因子：基于 u_saturation，0时为黑白，1时为彩色
    color = mix(grayColor, color, u_saturation);
    
    // 应用透明度
    a *= u_opacity;
    
    gl_FragColor = vec4(color, a);
  }
`;

interface MeltingGlassImageProps {
  src: string;
  alt: string;
  onClick?: () => void;
}

const MeltingGlassImage: React.FC<MeltingGlassImageProps> = ({ src, alt, onClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const textureRef = useRef<WebGLTexture | null>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const prevMouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
  const intensityRef = useRef(0);
  const targetIntensityRef = useRef(0.3);
  const saturationRef = useRef(0);
  const targetSaturationRef = useRef(0);
  const opacityRef = useRef(0.5);
  const targetOpacityRef = useRef(0.5);
  const isHoveringRef = useRef(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 800, height: 500 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { 
      premultipliedAlpha: false,
      alpha: true 
    });
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    glRef.current = gl;

    // 创建着色器
    const createShader = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return;

    // 创建程序
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }
    programRef.current = program;

    // 设置顶点数据
    const positions = new Float32Array([
      -1, -1, 0, 1,
       1, -1, 1, 1,
      -1,  1, 0, 0,
       1,  1, 1, 0,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'a_position');
    const texCoordLoc = gl.getAttribLocation(program, 'a_texCoord');

    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(texCoordLoc);
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 16, 8);

    // 加载图片
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      textureRef.current = texture;
      
      // 设置画布尺寸
      const maxWidth = 800;
      const aspectRatio = image.height / image.width;
      const width = Math.min(image.width, maxWidth);
      const height = width * aspectRatio;
      
      setImageDimensions({ width, height });
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      
      setImageLoaded(true);
    };
    image.src = src;

    return () => {
      cancelAnimationFrame(animationRef.current);
      if (textureRef.current) gl.deleteTexture(textureRef.current);
      if (program) gl.deleteProgram(program);
    };
  }, [src]);

  useEffect(() => {
    if (!imageLoaded) return;

    const gl = glRef.current;
    const program = programRef.current;
    const canvas = canvasRef.current;
    
    if (!gl || !program || !canvas) return;

    const startTime = Date.now();

    const render = () => {
      // 平滑插值鼠标位置
      const lerpFactor = 0.1;
      prevMouseRef.current = { ...mouseRef.current };
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * lerpFactor;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * lerpFactor;
      
      // 平滑插值强度
      intensityRef.current += (targetIntensityRef.current - intensityRef.current) * 0.05;
      
      // 平滑插值饱和度
      saturationRef.current += (targetSaturationRef.current - saturationRef.current) * 0.03;
      
      // 平滑插值透明度
      opacityRef.current += (targetOpacityRef.current - opacityRef.current) * 0.04;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      // 设置uniforms
      const time = (Date.now() - startTime) / 1000;
      
      gl.uniform1f(gl.getUniformLocation(program, 'u_time'), time);
      gl.uniform2f(gl.getUniformLocation(program, 'u_mouse'), 
        mouseRef.current.x, mouseRef.current.y);
      gl.uniform2f(gl.getUniformLocation(program, 'u_prevMouse'), 
        prevMouseRef.current.x, prevMouseRef.current.y);
      gl.uniform1f(gl.getUniformLocation(program, 'u_intensity'), intensityRef.current);
      gl.uniform1f(gl.getUniformLocation(program, 'u_saturation'), saturationRef.current);
      gl.uniform1f(gl.getUniformLocation(program, 'u_opacity'), opacityRef.current);
      gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), canvas.width, canvas.height);
      gl.uniform1i(gl.getUniformLocation(program, 'u_image'), 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textureRef.current);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationRef.current);
  }, [imageLoaded]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    targetMouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    };
  };

  const handleMouseEnter = () => {
    isHoveringRef.current = true;
    targetIntensityRef.current = 1;
    targetSaturationRef.current = 1;
    targetOpacityRef.current = 1;
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    targetIntensityRef.current = 0.3;
    targetSaturationRef.current = 0;
    targetOpacityRef.current = 0.9;
  };

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      style={{ 
        width: imageDimensions.width, 
        height: imageDimensions.height,
        opacity: imageLoaded ? 1 : 0
      }}
      onMouseMove={handleMouseMove}
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
          <div className={styles.imageWrapper}>
            <MeltingGlassImage
              src={project.image}
              alt={`${project.title} Image`}
              onClick={() => window.open(project.url, '_blank')}
            />
            <div className={styles.overlay}>
              <div className={styles.info}>
                <h3 className={styles.title}>{project.title}</h3>
                <p className={styles.description}>{project.description}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}