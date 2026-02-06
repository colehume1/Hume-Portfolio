import { useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 280;
const GROUND_Y = CANVAS_HEIGHT - 40;
const TURTLE_SIZE = 36;
const OBSTACLE_WIDTH = 24;
const OBSTACLE_HEIGHT = 32;
const GRAVITY = 0.45;
const JUMP_VELOCITY = -8;
const GAME_SPEED = 1.8;
const OBSTACLE_MIN_GAP = 180;
const OBSTACLE_MAX_GAP = 360;

interface Obstacle {
  x: number;
  width: number;
  height: number;
}

interface GameState {
  turtleY: number;
  velocityY: number;
  isJumping: boolean;
  obstacles: Obstacle[];
  nextObstacleIn: number;
  score: number;
  speed: number;
  phase: "start" | "playing" | "over";
}

function createInitialState(): GameState {
  return {
    turtleY: GROUND_Y - TURTLE_SIZE,
    velocityY: 0,
    isJumping: false,
    obstacles: [],
    nextObstacleIn: 200,
    score: 0,
    speed: GAME_SPEED,
    phase: "start",
  };
}

export default function TurtleJump() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gsRef = useRef<GameState>(createInitialState());
  const animFrameRef = useRef(0);
  const turtleImgRef = useRef<HTMLImageElement | null>(null);
  const scoreElRef = useRef<HTMLSpanElement>(null);
  const overlayElRef = useRef<HTMLDivElement>(null);

  const jump = useCallback(() => {
    const gs = gsRef.current;
    if (gs.phase === "start" || gs.phase === "over") {
      gsRef.current = createInitialState();
      gsRef.current.phase = "playing";
      if (overlayElRef.current) overlayElRef.current.style.display = "none";
      return;
    }
    if (!gs.isJumping) {
      gs.velocityY = JUMP_VELOCITY;
      gs.isJumping = true;
    }
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = "/assets/cursor/turtle-happy.png";
    img.onload = () => { turtleImgRef.current = img; };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawGround = () => {
      ctx.fillStyle = "#d4c9a8";
      ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);
      ctx.strokeStyle = "#b8a88a";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y);
      ctx.lineTo(CANVAS_WIDTH, GROUND_Y);
      ctx.stroke();
    };

    const drawTurtle = (y: number) => {
      if (turtleImgRef.current) {
        ctx.drawImage(turtleImgRef.current, 60, y, TURTLE_SIZE, TURTLE_SIZE);
      } else {
        ctx.fillStyle = "#5a9e3e";
        ctx.beginPath();
        ctx.ellipse(60 + TURTLE_SIZE / 2, y + TURTLE_SIZE / 2, TURTLE_SIZE / 2, TURTLE_SIZE / 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#4a8530";
        ctx.beginPath();
        ctx.ellipse(60 + TURTLE_SIZE / 2, y + TURTLE_SIZE / 2 - 2, TURTLE_SIZE / 2.8, TURTLE_SIZE / 3, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawObstacle = (obs: Obstacle) => {
      ctx.fillStyle = "#8B7355";
      const rx = obs.x;
      const ry = GROUND_Y - obs.height;
      const rw = obs.width;
      const rh = obs.height;
      const r = 4;
      ctx.beginPath();
      ctx.moveTo(rx + r, ry);
      ctx.lineTo(rx + rw - r, ry);
      ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + r);
      ctx.lineTo(rx + rw, ry + rh);
      ctx.lineTo(rx, ry + rh);
      ctx.lineTo(rx, ry + r);
      ctx.quadraticCurveTo(rx, ry, rx + r, ry);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#6B5640";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.strokeStyle = "#a08b6f";
      ctx.beginPath();
      ctx.moveTo(rx + 4, ry + rh * 0.3);
      ctx.lineTo(rx + rw - 4, ry + rh * 0.3);
      ctx.moveTo(rx + 4, ry + rh * 0.6);
      ctx.lineTo(rx + rw - 4, ry + rh * 0.6);
      ctx.stroke();
    };

    const drawScore = (s: number) => {
      ctx.fillStyle = "#666";
      ctx.font = "14px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(`Score: ${s}`, CANVAS_WIDTH - 16, 28);
      ctx.textAlign = "left";
    };

    const showOverlay = (line1: string, line2: string, line3: string) => {
      if (!overlayElRef.current) return;
      overlayElRef.current.style.display = "flex";
      const children = overlayElRef.current.children;
      if (children[0]) children[0].textContent = line1;
      if (children[1]) children[1].textContent = line2;
      if (children[2]) children[2].textContent = line3;
    };

    showOverlay("Turtle Jump", "", "Press Space or Tap to start");

    let lastTime = performance.now();

    const loop = (time: number) => {
      const gs = gsRef.current;
      const dt = Math.min((time - lastTime) / 16.667, 2);
      lastTime = time;

      ctx.fillStyle = "#f5f0e8";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      drawGround();

      if (gs.phase === "start") {
        drawTurtle(GROUND_Y - TURTLE_SIZE);
        animFrameRef.current = requestAnimationFrame(loop);
        return;
      }

      if (gs.phase === "over") {
        drawTurtle(gs.turtleY);
        for (const obs of gs.obstacles) drawObstacle(obs);
        drawScore(gs.score);
        animFrameRef.current = requestAnimationFrame(loop);
        return;
      }

      gs.velocityY += GRAVITY * dt;
      gs.turtleY += gs.velocityY * dt;

      if (gs.turtleY >= GROUND_Y - TURTLE_SIZE) {
        gs.turtleY = GROUND_Y - TURTLE_SIZE;
        gs.velocityY = 0;
        gs.isJumping = false;
      }

      gs.nextObstacleIn -= gs.speed * dt;
      if (gs.nextObstacleIn <= 0) {
        gs.obstacles.push({
          x: CANVAS_WIDTH,
          width: OBSTACLE_WIDTH,
          height: OBSTACLE_HEIGHT + Math.random() * 12,
        });
        gs.nextObstacleIn = OBSTACLE_MIN_GAP + Math.random() * (OBSTACLE_MAX_GAP - OBSTACLE_MIN_GAP);
      }

      for (let i = gs.obstacles.length - 1; i >= 0; i--) {
        gs.obstacles[i].x -= gs.speed * dt;
        if (gs.obstacles[i].x + gs.obstacles[i].width < 0) {
          gs.obstacles.splice(i, 1);
        }
      }

      const turtleLeft = 60;
      const turtleRight = 60 + TURTLE_SIZE - 8;
      const turtleTop = gs.turtleY + 6;
      const turtleBottom = gs.turtleY + TURTLE_SIZE;

      for (const obs of gs.obstacles) {
        const obsLeft = obs.x + 4;
        const obsRight = obs.x + obs.width - 4;
        const obsTop = GROUND_Y - obs.height;

        if (turtleRight > obsLeft && turtleLeft < obsRight && turtleBottom > obsTop) {
          gs.phase = "over";
          showOverlay("You were outpaced by moss.", `Score: ${gs.score}`, "Press Space or Tap to restart");
          if (scoreElRef.current) scoreElRef.current.textContent = String(gs.score);
          animFrameRef.current = requestAnimationFrame(loop);
          return;
        }
      }

      gs.score += Math.round(gs.speed * dt * 0.5);
      gs.speed = GAME_SPEED + gs.score * 0.001;

      drawTurtle(gs.turtleY);
      for (const obs of gs.obstacles) drawObstacle(obs);
      drawScore(gs.score);

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [jump]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-8 hover:text-foreground transition-colors" data-testid="link-back-home">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2" data-testid="text-turtle-jump-title">Turtle Jump</h1>
          <p className="text-muted-foreground text-sm" data-testid="text-turtle-jump-subtitle">The world's calmest endless runner.</p>
        </div>

        <div
          className="mx-auto border rounded-xl overflow-hidden shadow-sm bg-[#f5f0e8] relative select-none"
          style={{ maxWidth: CANVAS_WIDTH, aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}` }}
          onClick={jump}
          onTouchStart={(e) => { e.preventDefault(); jump(); }}
          data-testid="game-canvas-container"
        >
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="w-full h-full block"
            data-testid="game-canvas"
          />
          <div
            ref={overlayElRef}
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#f5f0e8]/85 pointer-events-none"
          >
            <span className="text-[#444] font-bold text-xl font-body" data-testid="text-game-overlay-title"></span>
            <span className="text-[#888] text-sm mt-1 font-body" data-testid="text-game-overlay-score"></span>
            <span className="text-[#888] text-sm mt-2 font-body" data-testid="text-game-overlay-cta"></span>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground" data-testid="text-game-controls">
            Space to jump (desktop) &middot; Tap to jump (mobile)
          </p>
        </div>
      </div>
    </div>
  );
}
