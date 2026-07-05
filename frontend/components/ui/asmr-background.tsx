"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * ASMRStaticBackground
 *
 * High-density canvas particle field with a reactive "magnetic vortex" on hover
 * and a "friction glow" as particles accelerate. Glass-shard + charcoal-dust look.
 *
 * Adapted for Next.js / this codebase:
 * - "use client" (it touches window + canvas).
 * - Sizes to its OWN container (ResizeObserver) instead of the whole window, so it
 *   can be used as a section background. Mouse coords are offset by the container.
 * - The raw <script> + custom `cursor-none` cursor from the original were dropped
 *   (hydration-unsafe / would hide the cursor site-wide).
 * - Overlay caption is opt-in via `showOverlay`.
 */
export interface ASMRStaticBackgroundProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of particles. Lower it on weak devices. Default 1000. */
  particleCount?: number;
  /** Render the demo "Atmospheric Friction" caption overlay. Default false. */
  showOverlay?: boolean;
}

export function ASMRStaticBackground({
  particleCount = 1000,
  showOverlay = false,
  className,
  children,
  ...props
}: ASMRStaticBackgroundProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId = 0;
    let particles: Particle[] = [];
    const mouse = { x: -1000, y: -1000 };

    const MAGNETIC_RADIUS = 280;
    const VORTEX_STRENGTH = 0.07;
    const PULL_STRENGTH = 0.12;

    class Particle {
      x = 0;
      y = 0;
      vx = 0;
      vy = 0;
      size = 0;
      alpha = 0;
      color = "";
      rotation = 0;
      rotationSpeed = 0;
      frictionGlow = 0;

      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        // 70% Charcoal, 30% Glass
        const isGlass = Math.random() > 0.7;
        this.color = isGlass ? "240, 245, 255" : "80, 80, 85";
        this.alpha = Math.random() * 0.4 + 0.1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
      }

      update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        if (dist < MAGNETIC_RADIUS) {
          const force = (MAGNETIC_RADIUS - dist) / MAGNETIC_RADIUS;

          // Magnetic center pull
          this.vx += (dx / dist) * force * PULL_STRENGTH;
          this.vy += (dy / dist) * force * PULL_STRENGTH;

          // Swirl vortex motion (perpendicular to radius)
          this.vx += (dy / dist) * force * VORTEX_STRENGTH * 10;
          this.vy -= (dx / dist) * force * VORTEX_STRENGTH * 10;

          // Glow based on proximity and velocity
          this.frictionGlow = force * 0.7;
        } else {
          this.frictionGlow *= 0.92;
        }

        // Physics application
        this.x += this.vx;
        this.y += this.vy;

        // Friction / damping
        this.vx *= 0.95;
        this.vy *= 0.95;

        // Background jitter (frozen static feel)
        this.vx += (Math.random() - 0.5) * 0.04;
        this.vy += (Math.random() - 0.5) * 0.04;

        this.rotation +=
          this.rotationSpeed +
          (Math.abs(this.vx) + Math.abs(this.vy)) * 0.05;

        // Screen wrap
        if (this.x < -20) this.x = width + 20;
        if (this.x > width + 20) this.x = -20;
        if (this.y < -20) this.y = height + 20;
        if (this.y > height + 20) this.y = -20;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        const finalAlpha = Math.min(this.alpha + this.frictionGlow, 0.9);
        ctx.fillStyle = `rgba(${this.color}, ${finalAlpha})`;

        if (this.frictionGlow > 0.3) {
          ctx.shadowBlur = 8 * this.frictionGlow;
          ctx.shadowColor = `rgba(180, 220, 255, ${this.frictionGlow})`;
        }

        // Sharp shard geometry
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 2.5);
        ctx.lineTo(this.size, 0);
        ctx.lineTo(0, this.size * 2.5);
        ctx.lineTo(-this.size, 0);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }
    }

    const init = () => {
      const rect = container.getBoundingClientRect();
      width = canvas.width = Math.max(1, Math.floor(rect.width));
      height = canvas.height = Math.max(1, Math.floor(rect.height));
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const render = () => {
      // Slight motion-blur trail
      ctx.fillStyle = "rgba(10, 10, 12, 0.18)";
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const setMouse = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      mouse.x = clientX - rect.left;
      mouse.y = clientY - rect.top;
    };
    const handleMouseMove = (e: MouseEvent) => setMouse(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) setMouse(e.touches[0].clientX, e.touches[0].clientY);
    };

    const ro = new ResizeObserver(init);
    ro.observe(container);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    init();
    render();

    return () => {
      ro.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleCount]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full overflow-hidden bg-[#0a0a0c]",
        className,
      )}
      {...props}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />

      {showOverlay && (
        <div className="relative z-10 flex h-full flex-col items-center justify-center pointer-events-none">
          <div className="rounded-sm border border-white/5 bg-white/[0.02] px-8 py-4 backdrop-blur-sm">
            <h2 className="text-sm font-light uppercase tracking-[0.7em] text-white/30 md:text-xl">
              Atmospheric Friction
            </h2>
            <div className="my-4 h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <p className="text-center text-[10px] tracking-widest text-white/10">
              INTERACTIVE KINETIC ENVIRONMENT
            </p>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}

export default ASMRStaticBackground;
