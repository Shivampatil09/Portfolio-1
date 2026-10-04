"use client";

import { useEffect, useRef } from "react";

interface StreamColumn {
  x: number;
  y: number;
  speedPxPerSec: number;
  tokenIndex: number;
  opacity: number;
}

const CODE_TOKENS = [
  "C#",
  ".NET 8",
  "ASP.NET Core",
  "React",
  "TypeScript",
  "SQL Server",
  "PostgreSQL",
  "Clean Architecture",
  "DbContext",
  "IActionResult",
  "async Task",
  "EF Core",
  "200 OK",
  "JWT",
  "Next.js",
  "IMediator",
  "SOLID",
];

export function PublicBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  // 1. Smooth Mouse Spotlight (Direct style updates without React re-renders)
  useEffect(() => {
    // Disable on touch / mobile screens
    if (window.innerWidth < 768) return;

    let rafId: number;
    let targetX = 50;
    let targetY = 25;
    let currentX = 50;
    let currentY = 25;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth) * 100;
      targetY = (e.clientY / window.innerHeight) * 100;
    };

    const animateSpotlight = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(800px circle at ${currentX.toFixed(
          2
        )}% ${currentY.toFixed(2)}%, rgba(237, 187, 95, 0.04), transparent 70%)`;
      }
      rafId = requestAnimationFrame(animateSpotlight);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(animateSpotlight);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // 2. Hardware-Accelerated Sparse Falling Code Stream
  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    // Disable on mobile/touch screens (< 768px) to optimize battery & GPU
    if (window.innerWidth < 768) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let lastTime = performance.now();

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    // 8 sparse columns distributed across the full viewport width
    const streamCount = 8;
    const streams: StreamColumn[] = [];

    const initStreams = () => {
      const colWidth = window.innerWidth / streamCount;
      streams.length = 0;
      for (let i = 0; i < streamCount; i++) {
        const xPos =
          i * colWidth + (Math.random() * (colWidth * 0.6) + colWidth * 0.2);
        streams.push({
          x: xPos,
          y: Math.random() * window.innerHeight,
          speedPxPerSec: 22 + Math.random() * 14, // 22 to 36 px/sec time-based speed
          tokenIndex: Math.floor(Math.random() * CODE_TOKENS.length),
          opacity: 0.12 + Math.random() * 0.08, // Clearly visible but restrained ambient opacity
        });
      }
    };

    initStreams();

    const render = (currentTime: number) => {
      const deltaSec = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);
      ctx.font =
        "500 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

      for (let i = 0; i < streams.length; i++) {
        const stream = streams[i];
        stream.y += stream.speedPxPerSec * deltaSec;

        // Reset to top when passing bottom boundary
        if (stream.y > height + 40) {
          stream.y = -30;
          const colWidth = width / streamCount;
          stream.x =
            i * colWidth + (Math.random() * (colWidth * 0.6) + colWidth * 0.2);
          stream.tokenIndex =
            (stream.tokenIndex + 1) % CODE_TOKENS.length;
          stream.speedPxPerSec = 22 + Math.random() * 14;
        }

        // Edge fade at top and bottom of screen
        let edgeFade = 1;
        if (stream.y < 80) {
          edgeFade = Math.max(0, stream.y / 80);
        } else if (stream.y > height - 120) {
          edgeFade = Math.max(0, (height - stream.y) / 120);
        }

        const effectiveOpacity = stream.opacity * edgeFade;
        const text = CODE_TOKENS[stream.tokenIndex];

        // Soft subtle gold glow
        ctx.shadowColor = "rgba(237, 187, 95, 0.2)";
        ctx.shadowBlur = 3;
        ctx.fillStyle = `rgba(237, 187, 95, ${effectiveOpacity.toFixed(3)})`;
        ctx.fillText(text, stream.x, stream.y);
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#060605]"
      aria-hidden="true"
    >
      {/* Delicate Technical Grid Pattern */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundSize: "56px 56px",
          backgroundImage: `
            linear-gradient(to right, rgba(237, 187, 95, 0.015) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(237, 187, 95, 0.015) 1px, transparent 1px)
          `,
        }}
      />

      {/* Ambient Mouse Spotlight Layer */}
      <div
        ref={spotlightRef}
        className="hidden md:block absolute inset-0 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "radial-gradient(800px circle at 50% 25%, rgba(237, 187, 95, 0.04), transparent 70%)",
        }}
      />

      {/* Warm Ambient Diffuse Glow Layers */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#edbb5f]/8 via-[#38240a]/4 to-transparent rounded-full blur-[140px]" />
      <div className="absolute top-1/3 -left-32 w-[420px] h-[420px] bg-[#38240a]/8 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 -right-32 w-[450px] h-[450px] bg-[#edbb5f]/5 rounded-full blur-[140px]" />

      {/* Hardware-Accelerated Falling Code Stream Canvas */}
      <canvas
        ref={canvasRef}
        className="hidden md:block absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
