import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

const DynamicShape = () => {
  const sketchRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      let startTime;
      const numCenters = 8;
      let centers = [];
      let offscreen;
      let edgeBlurBuffer;
      let vertices = [];

      p.setup = () => {
        p.createCanvas(500, 700);
        startTime = p.millis();
        offscreen = p.createGraphics(p.width, p.height);
        edgeBlurBuffer = p.createGraphics(p.width, p.height);

        // 初始化圆心位置和移动速度
        for (let i = 0; i < numCenters; i++) {
          centers.push({
            x: p.random(100, 400),
            y: p.random(100, 400),
            angle: p.random(p.TWO_PI),
            speed: p.random(1.5, 1.5),
          });
        }

        // 初始化形状顶点
        let npoints = 12;
        let radius = 150;
        for (let i = 0; i < npoints; i++) {
          let angle = p.map(i, 0, npoints, 0, p.TWO_PI);
          vertices.push({
            x: radius * p.cos(angle),
            y: radius * p.sin(angle)
          });
        }
      };

      p.draw = () => {
        p.clear();
        offscreen.clear();
        edgeBlurBuffer.clear();

        let currentTime = p.millis();
        let elapsedTime = (currentTime - startTime) / 1000;

        // 更新圆心位置
        for (let i = 0; i < centers.length; i++) {
          centers[i].x += p.cos(centers[i].angle) * centers[i].speed;
          centers[i].y += p.sin(centers[i].angle) * centers[i].speed;

          // 边界检测，防止圆心移出画布
          if (centers[i].x < 0 || centers[i].x > p.width) {
            centers[i].angle = p.PI - centers[i].angle;
          }
          if (centers[i].y < 0 || centers[i].y > p.height) {
            centers[i].angle = -centers[i].angle;
          }
        }

        // 在 offscreen 上绘制形状
        offscreen.push();
        offscreen.translate(offscreen.width / 2, offscreen.height / 2);

        let gradient = offscreen.drawingContext.createLinearGradient(0, 0, p.width, p.height);
        gradient.addColorStop(0, '#E750CA');  // 紫色
        gradient.addColorStop(1, '#CB0FA8');  // 粉红色
        offscreen.drawingContext.fillStyle = gradient;

        offscreen.stroke('#000000');  // 黑色边框
        offscreen.strokeWeight(0);    // 边框粗细

        offscreen.beginShape();
        for (let i = 0; i < vertices.length; i++) {
          let x = vertices[i].x;
          let y = vertices[i].y;

          // 调整顶点位置
          for (let j = 0; j < centers.length; j++) {
            let center = centers[j];
            let d = p.dist(x + offscreen.width / 2, y + offscreen.height / 2, center.x, center.y);
            if (d < 100) {  // 增加影响范围
              let influenceFactor = p.map(d, 0, 100, 0.1, 0);  // 影响因子，越近影响越大
              x += influenceFactor * (center.x - (x + offscreen.width / 2));
              y += influenceFactor * (center.y - (y + offscreen.height / 2));
            }
          }

          y += p.sin(elapsedTime + x * 0.08) * 30; // 增加振幅
          offscreen.curveVertex(x, y); // 使用 curveVertex 代替 vertex 以创建光滑曲线
        }
        offscreen.endShape(offscreen.CLOSE);
        offscreen.pop();

        // 在 edgeBlurBuffer 上绘制 offscreen 的边缘模糊效果
        edgeBlurBuffer.image(offscreen, 0, 0);
        edgeBlurBuffer.filter(p.BLUR, 12);

        // 将 edgeBlurBuffer 的边缘模糊效果与原始图形结合
        p.image(edgeBlurBuffer, 0, 0);
        p.blendMode(p.ADD);
        p.image(offscreen, 0, 0);
        p.blendMode(p.BLEND);
      };

      p.mouseMoved = () => {
        // 检测鼠标点击位置
        let clickX = p.mouseX - p.width / 2;
        let clickY = p.mouseY - p.height / 2;

        for (let i = 0; i < vertices.length; i++) {
          let d = p.dist(clickX, clickY, vertices[i].x, vertices[i].y);
          if (d < 50) { // 检测是否点击在顶点附近
            let angle = p.atan2(vertices[i].y - clickY, vertices[i].x - clickX);
            vertices[i].x += p.cos(angle) * 20; // 顶点向点击方向扩张
            vertices[i].y += p.sin(angle) * 20;
          }
        }
      };
    };

    const p5Instance = new p5(sketch, sketchRef.current);

    return () => {
      p5Instance.remove();
    };
  }, []);

  return <div ref={sketchRef}></div>;
};

export default DynamicShape;
