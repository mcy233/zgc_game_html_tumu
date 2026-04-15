import { memo, useEffect, useRef } from 'react';
import type { WeatherType } from '../../types/gameState';

export type WeatherParticlesWeather =
  | 'CLEAR'
  | 'CLOUDY'
  | 'RAIN'
  | 'HEAVY_RAIN'
  | 'SNOW'
  | 'WINDY'
  | 'FOGGY'
  | 'HOT';

export interface WeatherParticlesProps {
  weather: WeatherParticlesWeather;
}

export function weatherTypeToParticlesWeather(w: WeatherType): WeatherParticlesWeather {
  switch (w) {
    case '晴': return 'CLEAR';
    case '多云': return 'CLOUDY';
    case '小雨': return 'RAIN';
    case '大雨': return 'HEAVY_RAIN';
    case '高温': return 'HOT';
    case '寒潮': return 'SNOW';
    case '大风': return 'WINDY';
    default: return 'CLEAR';
  }
}

// ─── Particle types ───

interface Raindrop {
  x: number; y: number; speed: number; len: number; width: number; opacity: number;
}

interface Snowflake {
  x: number; y: number; speed: number; size: number; wobbleAmp: number;
  wobbleSpeed: number; wobbleOffset: number; opacity: number;
}

interface CloudBlob {
  x: number; y: number; speed: number; circles: { dx: number; dy: number; r: number }[];
  opacity: number;
}

interface WindStreak {
  x: number; y: number; speed: number; len: number; opacity: number; curve: number;
}

interface SunRay {
  angle: number; speed: number; length: number; opacity: number; width: number;
}

interface HeatWave {
  x: number; y: number; phase: number; speed: number; amplitude: number; opacity: number;
}

// ─── Helpers ───

function rand(min: number, max: number) { return Math.random() * (max - min) + min; }

function createRaindrops(count: number, w: number, h: number, heavy: boolean): Raindrop[] {
  return Array.from({ length: count }, () => ({
    x: rand(0, w),
    y: rand(-h * 0.2, h),
    speed: heavy ? rand(14, 22) : rand(8, 14),
    len: heavy ? rand(18, 30) : rand(10, 18),
    width: heavy ? rand(1.5, 2.5) : rand(0.8, 1.5),
    opacity: heavy ? rand(0.35, 0.6) : rand(0.2, 0.45),
  }));
}

function createSnowflakes(count: number, w: number, h: number): Snowflake[] {
  return Array.from({ length: count }, () => ({
    x: rand(0, w),
    y: rand(-h * 0.1, h),
    speed: rand(0.5, 1.8),
    size: rand(3, 8),
    wobbleAmp: rand(20, 60),
    wobbleSpeed: rand(0.01, 0.03),
    wobbleOffset: rand(0, Math.PI * 2),
    opacity: rand(0.4, 0.85),
  }));
}

function createClouds(count: number, w: number, h: number): CloudBlob[] {
  return Array.from({ length: count }, () => {
    const baseY = rand(h * 0.08, h * 0.35);
    const numCircles = Math.floor(rand(5, 10));
    const circles: CloudBlob['circles'] = [];
    for (let j = 0; j < numCircles; j++) {
      circles.push({
        dx: rand(-70, 70),
        dy: rand(-25, 12),
        r: rand(28, 60),
      });
    }
    return {
      x: rand(-300, w),
      y: baseY,
      speed: rand(0.12, 0.35),
      circles,
      opacity: rand(0.35, 0.65),
    };
  });
}

function createWindStreaks(count: number, w: number, h: number): WindStreak[] {
  return Array.from({ length: count }, () => ({
    x: rand(w, w * 1.5),
    y: rand(0, h),
    speed: rand(8, 18),
    len: rand(60, 160),
    opacity: rand(0.08, 0.22),
    curve: rand(-8, 8),
  }));
}

function createSunRays(count: number, hot: boolean): SunRay[] {
  return Array.from({ length: count }, (_, i) => ({
    angle: (i / count) * Math.PI * 2 + rand(-0.1, 0.1),
    speed: rand(0.002, 0.006),
    length: hot ? rand(160, 420) : rand(100, 260),
    opacity: hot ? rand(0.10, 0.25) : rand(0.06, 0.16),
    width: hot ? rand(2, 6) : rand(1, 4),
  }));
}

function createHeatWaves(count: number, _w: number, h: number): HeatWave[] {
  return Array.from({ length: count }, () => ({
    x: 0,
    y: rand(h * 0.15, h),
    phase: rand(0, Math.PI * 2),
    speed: rand(0.012, 0.028),
    amplitude: rand(4, 12),
    opacity: rand(0.06, 0.16),
  }));
}

// ─── Draw functions ───

function drawRain(ctx: CanvasRenderingContext2D, drops: Raindrop[], w: number, h: number, heavy: boolean) {
  for (const d of drops) {
    d.y += d.speed;
    d.x -= heavy ? 2 : 0.5;
    if (d.y > h + 10) {
      d.y = rand(-30, -5);
      d.x = rand(0, w);
    }
    if (d.x < -10) d.x = w + 10;

    ctx.beginPath();
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x - (heavy ? 3 : 1), d.y + d.len);
    ctx.strokeStyle = heavy
      ? `rgba(120, 180, 240, ${d.opacity})`
      : `rgba(150, 200, 250, ${d.opacity})`;
    ctx.lineWidth = d.width;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  if (heavy) {
    ctx.fillStyle = 'rgba(100, 150, 200, 0.03)';
    ctx.fillRect(0, 0, w, h);
  }
}

function drawSnowflakeShape(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number, rotation: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = 'rgba(220, 235, 255, 0.9)';
  ctx.lineWidth = Math.max(0.5, size * 0.15);
  ctx.lineCap = 'round';

  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(cos * size, sin * size);
    ctx.stroke();

    if (size > 3) {
      const bLen = size * 0.35;
      const bPos = size * 0.6;
      const bx = cos * bPos;
      const by = sin * bPos;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + Math.cos(angle + 0.6) * bLen, by + Math.sin(angle + 0.6) * bLen);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + Math.cos(angle - 0.6) * bLen, by + Math.sin(angle - 0.6) * bLen);
      ctx.stroke();
    }
  }

  ctx.beginPath();
  ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
  ctx.fill();

  ctx.restore();
}

function drawSnow(ctx: CanvasRenderingContext2D, flakes: Snowflake[], w: number, h: number, t: number) {
  for (const f of flakes) {
    f.y += f.speed;
    f.x += Math.sin(t * f.wobbleSpeed + f.wobbleOffset) * 0.5;
    if (f.y > h + 10) {
      f.y = rand(-10, -2);
      f.x = rand(0, w);
    }

    const rotation = t * 0.0005 + f.wobbleOffset;
    drawSnowflakeShape(ctx, f.x, f.y, f.size, f.opacity, rotation);
  }
}

function drawClouds(ctx: CanvasRenderingContext2D, clouds: CloudBlob[], w: number, isDark: boolean) {
  for (const c of clouds) {
    c.x += c.speed;
    if (c.x > w + 250) c.x = -250;

    ctx.save();
    ctx.globalAlpha = c.opacity;
    for (const ci of c.circles) {
      const grad = ctx.createRadialGradient(
        c.x + ci.dx, c.y + ci.dy, ci.r * 0.1,
        c.x + ci.dx, c.y + ci.dy, ci.r
      );
      if (isDark) {
        grad.addColorStop(0, 'rgba(180, 190, 210, 0.55)');
        grad.addColorStop(0.7, 'rgba(140, 150, 170, 0.25)');
        grad.addColorStop(1, 'rgba(140, 150, 170, 0)');
      } else {
        grad.addColorStop(0, 'rgba(160, 175, 195, 0.55)');
        grad.addColorStop(0.7, 'rgba(180, 190, 205, 0.25)');
        grad.addColorStop(1, 'rgba(200, 210, 220, 0)');
      }
      ctx.beginPath();
      ctx.arc(c.x + ci.dx, c.y + ci.dy, ci.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
    ctx.restore();
  }
}

function drawWind(ctx: CanvasRenderingContext2D, streaks: WindStreak[], w: number, h: number) {
  for (const s of streaks) {
    s.x -= s.speed;
    if (s.x + s.len < -20) {
      s.x = w + rand(20, 100);
      s.y = rand(0, h);
    }

    ctx.beginPath();
    ctx.moveTo(s.x + s.len, s.y);
    ctx.quadraticCurveTo(s.x + s.len * 0.5, s.y + s.curve, s.x, s.y);
    ctx.strokeStyle = `rgba(160, 170, 180, ${s.opacity})`;
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.stroke();
  }
}

function drawSun(ctx: CanvasRenderingContext2D, rays: SunRay[], w: number, h: number, t: number, hot: boolean) {
  const cx = w * 0.82;
  const cy = h * 0.18;
  const coreR = hot ? 48 : 30;

  if (hot) {
    const hugeGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 8);
    hugeGlow.addColorStop(0, 'rgba(255, 160, 30, 0.12)');
    hugeGlow.addColorStop(0.3, 'rgba(255, 120, 20, 0.06)');
    hugeGlow.addColorStop(0.7, 'rgba(255, 80, 0, 0.02)');
    hugeGlow.addColorStop(1, 'rgba(255, 60, 0, 0)');
    ctx.beginPath();
    ctx.arc(cx, cy, coreR * 8, 0, Math.PI * 2);
    ctx.fillStyle = hugeGlow;
    ctx.fill();
  }

  const outerR = hot ? coreR * 4 : coreR * 3;
  const outerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerR);
  if (hot) {
    outerGlow.addColorStop(0, 'rgba(255, 200, 60, 0.35)');
    outerGlow.addColorStop(0.3, 'rgba(255, 170, 40, 0.15)');
    outerGlow.addColorStop(0.7, 'rgba(255, 140, 20, 0.04)');
    outerGlow.addColorStop(1, 'rgba(255, 120, 10, 0)');
  } else {
    outerGlow.addColorStop(0, 'rgba(255, 220, 100, 0.22)');
    outerGlow.addColorStop(0.3, 'rgba(255, 210, 80, 0.10)');
    outerGlow.addColorStop(0.7, 'rgba(255, 200, 60, 0.03)');
    outerGlow.addColorStop(1, 'rgba(255, 200, 60, 0)');
  }
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.fillStyle = outerGlow;
  ctx.fill();

  const innerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
  innerGrad.addColorStop(0, hot ? 'rgba(255, 230, 100, 0.50)' : 'rgba(255, 240, 150, 0.30)');
  innerGrad.addColorStop(0.6, hot ? 'rgba(255, 200, 60, 0.20)' : 'rgba(255, 220, 100, 0.10)');
  innerGrad.addColorStop(1, 'rgba(255, 200, 60, 0)');
  ctx.beginPath();
  ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
  ctx.fillStyle = innerGrad;
  ctx.fill();

  for (const ray of rays) {
    ray.angle += ray.speed;
    const cos = Math.cos(ray.angle);
    const sin = Math.sin(ray.angle);
    const startR = coreR * 0.8;
    const endR = coreR + ray.length;
    const pulse = 0.7 + 0.3 * Math.sin(t * 0.003 + ray.angle * 3);

    ctx.beginPath();
    ctx.moveTo(cx + cos * startR, cy + sin * startR);
    ctx.lineTo(cx + cos * endR, cy + sin * endR);
    ctx.strokeStyle = hot
      ? `rgba(255, 180, 40, ${ray.opacity * pulse})`
      : `rgba(255, 220, 100, ${ray.opacity * pulse})`;
    ctx.lineWidth = ray.width;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  if (hot) {
    const screenTint = ctx.createLinearGradient(0, 0, 0, h);
    const tintPulse = 0.03 + 0.015 * Math.sin(t * 0.0015);
    screenTint.addColorStop(0, `rgba(255, 140, 20, ${tintPulse})`);
    screenTint.addColorStop(0.5, `rgba(255, 100, 0, ${tintPulse * 0.5})`);
    screenTint.addColorStop(1, `rgba(255, 80, 0, ${tintPulse * 0.3})`);
    ctx.fillStyle = screenTint;
    ctx.fillRect(0, 0, w, h);
  }
}

function drawFog(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, isDark: boolean) {
  const layers = 4;
  for (let i = 0; i < layers; i++) {
    const y = h * (0.2 + i * 0.2);
    const wave = Math.sin(t * 0.001 + i * 1.5) * 20;
    const grad = ctx.createLinearGradient(0, y - 60, 0, y + 60);
    const base = isDark ? '160, 170, 190' : '220, 225, 235';
    const peak = 0.05 + Math.sin(t * 0.0008 + i * 0.8) * 0.03;
    grad.addColorStop(0, `rgba(${base}, 0)`);
    grad.addColorStop(0.5, `rgba(${base}, ${peak})`);
    grad.addColorStop(1, `rgba(${base}, 0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, y - 60 + wave, w, 120);
  }
}

function drawHeatWaves(ctx: CanvasRenderingContext2D, waves: HeatWave[], w: number, h: number, t: number) {
  for (const hw of waves) {
    hw.phase += hw.speed;

    const bandH = 30 + hw.amplitude * 3;
    const bandGrad = ctx.createLinearGradient(0, hw.y - bandH / 2, 0, hw.y + bandH / 2);
    const pulse = 0.5 + 0.5 * Math.sin(t * 0.002 + hw.phase);
    const bandAlpha = hw.opacity * 0.4 * pulse;
    bandGrad.addColorStop(0, `rgba(255, 120, 30, 0)`);
    bandGrad.addColorStop(0.5, `rgba(255, 120, 30, ${bandAlpha})`);
    bandGrad.addColorStop(1, `rgba(255, 120, 30, 0)`);
    ctx.fillStyle = bandGrad;
    ctx.fillRect(0, hw.y - bandH / 2, w, bandH);

    ctx.beginPath();
    ctx.moveTo(0, hw.y);
    for (let x = 0; x <= w; x += 3) {
      const y = hw.y + Math.sin(x * 0.012 + hw.phase) * hw.amplitude
                     + Math.sin(x * 0.025 + hw.phase * 1.5) * hw.amplitude * 0.3;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(255, 160, 60, ${hw.opacity})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, hw.y + 2);
    for (let x = 0; x <= w; x += 3) {
      const y = hw.y + 2 + Math.sin(x * 0.012 + hw.phase + 0.5) * hw.amplitude * 0.7;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(255, 200, 80, ${hw.opacity * 0.5})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  const shimmer = 0.02 + 0.01 * Math.sin(t * 0.001);
  const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, h * 0.9);
  vignette.addColorStop(0, 'rgba(255, 100, 0, 0)');
  vignette.addColorStop(1, `rgba(255, 80, 0, ${shimmer})`);
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
}

function drawLightning(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const cycle = t % 6000;
  if (cycle > 200) return;

  if (cycle < 40 || (cycle > 80 && cycle < 120)) {
    ctx.fillStyle = `rgba(200, 220, 255, ${0.06 + Math.random() * 0.04})`;
    ctx.fillRect(0, 0, w, h);
  }

  if (cycle < 60) {
    const sx = rand(w * 0.2, w * 0.8);
    let bx = sx, by = 0;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    const segs = Math.floor(rand(6, 12));
    for (let i = 0; i < segs; i++) {
      bx += rand(-30, 30);
      by += rand(30, 80);
      ctx.lineTo(bx, by);
    }
    ctx.strokeStyle = `rgba(200, 220, 255, ${0.3 + Math.random() * 0.3})`;
    ctx.lineWidth = rand(1, 3);
    ctx.stroke();

    ctx.strokeStyle = `rgba(255, 255, 255, ${0.15})`;
    ctx.lineWidth = rand(3, 6);
    ctx.stroke();
  }
}

// ─── Main canvas component ───

function WeatherCanvasInner({ weather }: WeatherParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{
    weather: WeatherParticlesWeather;
    rain: Raindrop[];
    snow: Snowflake[];
    clouds: CloudBlob[];
    wind: WindStreak[];
    sunRays: SunRay[];
    heatWaves: HeatWave[];
    w: number;
    h: number;
  } | null>(null);
  const rafRef = useRef(0);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w, h };
    };

    const { w, h } = resize();

    const s = stateRef.current;
    if (!s || s.weather !== weather || Math.abs(s.w - w) > 50 || Math.abs(s.h - h) > 50) {
      stateRef.current = {
        weather,
        rain: (weather === 'RAIN' || weather === 'HEAVY_RAIN')
          ? createRaindrops(weather === 'HEAVY_RAIN' ? 120 : 60, w, h, weather === 'HEAVY_RAIN') : [],
        snow: weather === 'SNOW' ? createSnowflakes(50, w, h) : [],
        clouds: weather === 'CLOUDY' ? createClouds(7, w, h) : [],
        wind: weather === 'WINDY' ? createWindStreaks(15, w, h) : [],
        sunRays: (weather === 'CLEAR' || weather === 'HOT') ? createSunRays(weather === 'HOT' ? 24 : 16, weather === 'HOT') : [],
        heatWaves: weather === 'HOT' ? createHeatWaves(10, w, h) : [],
        w, h,
      };
    }

    const isDark = document.documentElement.classList.contains('dark');

    const animate = () => {
      tRef.current += 16;
      const t = tRef.current;
      const st = stateRef.current!;
      ctx.clearRect(0, 0, st.w, st.h);

      switch (weather) {
        case 'CLEAR':
          drawSun(ctx, st.sunRays, st.w, st.h, t, false);
          break;
        case 'HOT':
          drawSun(ctx, st.sunRays, st.w, st.h, t, true);
          drawHeatWaves(ctx, st.heatWaves, st.w, st.h, t);
          break;
        case 'CLOUDY':
          drawClouds(ctx, st.clouds, st.w, isDark);
          break;
        case 'RAIN':
          drawRain(ctx, st.rain, st.w, st.h, false);
          break;
        case 'HEAVY_RAIN':
          drawRain(ctx, st.rain, st.w, st.h, true);
          drawLightning(ctx, st.w, st.h, t);
          break;
        case 'SNOW':
          drawSnow(ctx, st.snow, st.w, st.h, t);
          break;
        case 'WINDY':
          drawWind(ctx, st.wind, st.w, st.h);
          break;
        case 'FOGGY':
          drawFog(ctx, st.w, st.h, t, isDark);
          break;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    const onResize = () => {
      const { w: nw, h: nh } = resize();
      if (stateRef.current) {
        stateRef.current.w = nw;
        stateRef.current.h = nh;
      }
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, [weather]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 5 }}
      aria-hidden
    />
  );
}

export const WeatherParticles = memo(WeatherCanvasInner);
