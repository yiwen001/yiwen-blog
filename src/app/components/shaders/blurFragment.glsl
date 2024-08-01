uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform float uTime;

// 定义模糊的宽度
const int blurWidth = 5;

// 取样周围像素颜色的函数
vec4 sampleColor(vec2 uv, vec2 offset) {
  return texture2D(uTexture, uv + offset);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  // 计算模糊效果
  vec4 color = vec4(0.0);
  for (int i = -blurWidth; i <= blurWidth; i++) {
    color += sampleColor(uv, vec2(float(i), 0.0) / uResolution);
    color += sampleColor(uv, vec2(0.0, float(i)) / uResolution);
  }
  color /= float(blurWidth * 4 + 1);

  // 输出最终颜色
  gl_FragColor = color;
}