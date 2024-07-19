import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

const FluidEffect = () => {
  const sketchRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      let img;
      let particles = [];

      p.preload = () => {
        img = p.loadImage('./giphy_1.png'); // 替换为你的图像路径
      };

      p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight);
        for (let i = 0; i < 200; i++) {
          particles.push(new Particle(p.random(p.width), p.random(p.height)));
        }
      };

      p.draw = () => {
        p.clear();
        for (let particle of particles) {
          particle.update();
          particle.show();
        }
      };

      class Particle {
        constructor(x, y) {
          this.pos = p.createVector(x, y);
          this.vel = p.createVector(0, 0);
          this.acc = p.createVector(0, 0);
          this.maxSpeed = 2;
        }

        update() {
          let mouse = p.createVector(p.mouseX, p.mouseY);
          let dir = p5.Vector.sub(mouse, this.pos);
          dir.setMag(0.1);
          this.acc = dir;
          this.vel.add(this.acc);
          this.vel.limit(this.maxSpeed);
          this.pos.add(this.vel);
        }

        show() {
          p.image(img, this.pos.x, this.pos.y, 50, 50);
        }
      }
    };

    const p5Instance = new p5(sketch, sketchRef.current);

    return () => {
      p5Instance.remove();
    };
  }, []);

  return <div ref={sketchRef}></div>;
};

export default FluidEffect;