import { useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 280;
const GROUND_Y = CANVAS_HEIGHT - 40;
const TURTLE_SIZE = 36;
const LOG_WIDTH = 36;
const LOG_HEIGHT = 28;
const GRAVITY = 0.35;
const JUMP_VELOCITY = -9.5;
const GAME_SPEED = 1.6;
const OBSTACLE_MIN_GAP = 260;
const OBSTACLE_MAX_GAP = 440;
const WATER_SCORE = 100;
const WATER_GRAVITY = 0.25;

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
  underwater: boolean;
  waterTransition: number;
}

const QUOTES = [
  { text: "Forgive, O Lord, my little jokes on Thee, and I'll forgive Thy great big joke on me.", author: "Robert Frost" },
  { text: "We are more often frightened than hurt; and we suffer more in imagination than in reality.", author: "Seneca" },
  { text: "The happiness of your life depends upon the quality of your thoughts.", author: "Marcus Aurelius" },
  { text: "Of all the means to insure happiness throughout the whole life, by far the most important is the acquisition of friends.", author: "Epicurus" },
  { text: "Not what we have but what we enjoy, constitutes our abundance.", author: "Epicurus" },
  { text: "Empty is the argument of the philosopher which does not relieve any human suffering.", author: "Epicurus" },
  { text: "The truth springs from argument amongst friends.", author: "David Hume" },
  { text: "Educating the mind without educating the heart is no education at all.", author: "Aristotle" },
  { text: "Actions are right in proportion as they tend to promote happiness, wrong as they tend to produce the reverse of happiness.", author: "John Stuart Mill" },
  { text: "And the tree was happy.", author: "Shel Silverstein" },
  { text: "In every real man a child is hidden that wants to play.", author: "Nietzsche" },
  { text: "Be more concerned with your character than with your reputation. Your character is what you really are while your reputation is merely what others think you are.", author: "John Wooden" },
];

let lastQuoteIdx = -1;
function randomQuote() {
  let idx = Math.floor(Math.random() * QUOTES.length);
  if (QUOTES.length > 1) {
    while (idx === lastQuoteIdx) {
      idx = Math.floor(Math.random() * QUOTES.length);
    }
  }
  lastQuoteIdx = idx;
  return QUOTES[idx];
}

function createInitialState(): GameState {
  return {
    turtleY: GROUND_Y - TURTLE_SIZE,
    velocityY: 0,
    isJumping: false,
    obstacles: [],
    nextObstacleIn: 260,
    score: 0,
    speed: GAME_SPEED,
    phase: "start",
    underwater: false,
    waterTransition: 0,
  };
}

export default function TurtleJump() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gsRef = useRef<GameState>(createInitialState());
  const animFrameRef = useRef(0);
  const turtleImgRef = useRef<HTMLImageElement | null>(null);
  const overlayElRef = useRef<HTMLDivElement>(null);
  const quoteElRef = useRef<HTMLDivElement>(null);

  const jump = useCallback(() => {
    const gs = gsRef.current;
    if (gs.phase === "start" || gs.phase === "over") {
      gsRef.current = createInitialState();
      gsRef.current.phase = "playing";
      if (overlayElRef.current) overlayElRef.current.style.display = "none";
      if (quoteElRef.current) quoteElRef.current.style.display = "none";
      return;
    }
    if (!gs.isJumping) {
      gs.velocityY = JUMP_VELOCITY;
      gs.isJumping = true;
    }
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = "/assets/cursor/turtle-headband-sweat.png";
    img.onload = () => { turtleImgRef.current = img; };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lerpColor = (a: number[], b: number[], t: number) =>
      a.map((v, i) => Math.round(v + (b[i] - v) * t));

    const BG_LAND = [245, 240, 232];
    const BG_WATER = [200, 225, 240];
    const GROUND_LAND = [212, 201, 168];
    const GROUND_WATER = [140, 175, 195];
    const GROUND_LINE_LAND = [184, 168, 138];
    const GROUND_LINE_WATER = [110, 150, 170];

    const drawBackground = (t: number) => {
      const bg = lerpColor(BG_LAND, BG_WATER, t);
      ctx.fillStyle = `rgb(${bg[0]},${bg[1]},${bg[2]})`;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      if (t > 0) {
        ctx.globalAlpha = t * 0.15;
        for (let i = 0; i < 6; i++) {
          const bx = ((performance.now() * 0.02 + i * 110) % (CANVAS_WIDTH + 60)) - 30;
          const by = 40 + i * 35;
          ctx.fillStyle = "rgba(255,255,255,0.5)";
          ctx.beginPath();
          ctx.ellipse(bx, by, 8 + i * 2, 6 + i, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
    };

    const drawGround = (t: number) => {
      const gc = lerpColor(GROUND_LAND, GROUND_WATER, t);
      ctx.fillStyle = `rgb(${gc[0]},${gc[1]},${gc[2]})`;
      ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);
      const lc = lerpColor(GROUND_LINE_LAND, GROUND_LINE_WATER, t);
      ctx.strokeStyle = `rgb(${lc[0]},${lc[1]},${lc[2]})`;
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
      }
    };

    const drawLog = (obs: Obstacle, underwater: boolean) => {
      const lx = obs.x;
      const ly = GROUND_Y - obs.height;
      const lw = obs.width;
      const lh = obs.height;
      const r = lh / 2;

      ctx.fillStyle = underwater ? "#5a7a6a" : "#8B6F47";
      ctx.beginPath();
      ctx.moveTo(lx, ly + r);
      ctx.lineTo(lx, ly + lh - r);
      ctx.arcTo(lx, ly + lh, lx + r, ly + lh, r);
      ctx.lineTo(lx + lw - r, ly + lh);
      ctx.arcTo(lx + lw, ly + lh, lx + lw, ly + lh - r, r);
      ctx.lineTo(lx + lw, ly + r);
      ctx.arcTo(lx + lw, ly, lx + lw - r, ly, r);
      ctx.lineTo(lx + r, ly);
      ctx.arcTo(lx, ly, lx, ly + r, r);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = underwater ? "#4a6a5a" : "#6B5233";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.strokeStyle = underwater ? "#6a8a7a" : "#a08060";
      ctx.lineWidth = 0.8;
      const ringCount = Math.max(1, Math.floor(lw / 14));
      for (let i = 1; i <= ringCount; i++) {
        const rx = lx + (lw / (ringCount + 1)) * i;
        ctx.beginPath();
        ctx.moveTo(rx, ly + 3);
        ctx.lineTo(rx, ly + lh - 3);
        ctx.stroke();
      }

      ctx.fillStyle = underwater ? "#4a6a5a" : "#7a5f3a";
      ctx.beginPath();
      ctx.ellipse(lx + lw, ly + lh / 2, 3, lh / 2 - 1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = underwater ? "#3a5a4a" : "#5a4528";
      ctx.lineWidth = 0.6;
      ctx.stroke();
      ctx.fillStyle = underwater ? "#5a7a6a" : "#6B5233";
      ctx.beginPath();
      ctx.arc(lx + lw, ly + lh / 2, 2, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawScore = (s: number, underwater: boolean) => {
      ctx.fillStyle = underwater ? "#3a6070" : "#666";
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

    const showQuote = (quote: { text: string; author: string }) => {
      if (!quoteElRef.current) return;
      quoteElRef.current.style.display = "block";
      const children = quoteElRef.current.children;
      if (children[0]) children[0].textContent = `"${quote.text}"`;
      if (children[1]) children[1].textContent = `\u2014 ${quote.author}`;
    };

    showOverlay("Turtle Jump", "", "Press Space or Tap to start");

    let lastTime = performance.now();

    const loop = (time: number) => {
      const gs = gsRef.current;
      const dt = Math.min((time - lastTime) / 16.667, 2);
      lastTime = time;

      const waterT = gs.waterTransition;
      drawBackground(waterT);
      drawGround(waterT);

      if (gs.phase === "start") {
        drawTurtle(GROUND_Y - TURTLE_SIZE);
        animFrameRef.current = requestAnimationFrame(loop);
        return;
      }

      if (gs.phase === "over") {
        drawTurtle(gs.turtleY);
        for (const obs of gs.obstacles) drawLog(obs, gs.underwater);
        drawScore(gs.score, gs.underwater);
        animFrameRef.current = requestAnimationFrame(loop);
        return;
      }

      if (gs.score >= WATER_SCORE && !gs.underwater) {
        gs.underwater = true;
      }
      if (gs.underwater && gs.waterTransition < 1) {
        gs.waterTransition = Math.min(1, gs.waterTransition + 0.008 * dt);
      }

      const currentGravity = gs.underwater ? WATER_GRAVITY : GRAVITY;
      gs.velocityY += currentGravity * dt;
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
          width: LOG_WIDTH,
          height: LOG_HEIGHT + Math.random() * 8,
        });
        gs.nextObstacleIn = OBSTACLE_MIN_GAP + Math.random() * (OBSTACLE_MAX_GAP - OBSTACLE_MIN_GAP);
      }

      for (let i = gs.obstacles.length - 1; i >= 0; i--) {
        gs.obstacles[i].x -= gs.speed * dt;
        if (gs.obstacles[i].x + gs.obstacles[i].width < 0) {
          gs.obstacles.splice(i, 1);
        }
      }

      const turtleLeft = 60 + 6;
      const turtleRight = 60 + TURTLE_SIZE - 8;
      const turtleTop = gs.turtleY + 6;
      const turtleBottom = gs.turtleY + TURTLE_SIZE;

      for (const obs of gs.obstacles) {
        const obsLeft = obs.x + 4;
        const obsRight = obs.x + obs.width - 4;
        const obsTop = GROUND_Y - obs.height;

        if (turtleRight > obsLeft && turtleLeft < obsRight && turtleBottom > obsTop) {
          gs.phase = "over";
          const q = randomQuote();
          const funnyLines = [
            "You were outpaced by moss.",
            "The log wins. Again.",
            "Slow and steady... didn't finish.",
            "Even the log looked surprised.",
          ];
          const funnyLine = funnyLines[Math.floor(Math.random() * funnyLines.length)];
          showOverlay(funnyLine, `Score: ${gs.score}`, "Press Space or Tap to restart");
          showQuote(q);
          animFrameRef.current = requestAnimationFrame(loop);
          return;
        }
      }

      gs.score += Math.round(gs.speed * dt * 0.5);
      gs.speed = GAME_SPEED + gs.score * 0.0008;

      drawTurtle(gs.turtleY);
      for (const obs of gs.obstacles) drawLog(obs, gs.underwater);
      drawScore(gs.score, gs.underwater);

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
            <span className="text-[#888] text-sm mt-3 font-body" data-testid="text-game-overlay-cta"></span>
          </div>
          <div
            ref={quoteElRef}
            className="absolute left-1/2 -translate-x-1/2 bottom-[22%] max-w-[85%] text-center pointer-events-none"
            style={{ display: "none" }}
          >
            <p className="text-[#555] text-xs italic leading-relaxed font-body" data-testid="text-game-quote"></p>
            <p className="text-[#999] text-[11px] mt-1 font-body" data-testid="text-game-quote-author"></p>
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
