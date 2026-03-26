import { useEffect, useRef, useCallback, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 280;
const GROUND_Y = CANVAS_HEIGHT - 40;
const TURTLE_SIZE = 36;

const LOG_WIDTH_MIN = 24;
const LOG_WIDTH_MAX = 44;
const LOG_HEIGHT_BASE = 22;
const LOG_HEIGHT_VAR = 8;

const GRAVITY = 0.35;
const JUMP_VELOCITY = -9.5;
const GAME_SPEED = 1.6;
const OBSTACLE_MIN_GAP = 240;
const OBSTACLE_MAX_GAP = 460;
const BLOCK_SCORE_BONUS = 100;
const BLOCK_POPUP_DURATION = 400;
const SPEED_STEP_INTERVAL = 1000;
const SPEED_STEP_MULTIPLIER = 0.1;
const WATER_GRAVITY = 0.25;
const SCORE_PER_SECOND = 5;
const MODE_INTERVAL = 200;

const BIRD_WIDTH = 30;
const BIRD_HEIGHT = 22;
const BIRD_Y_MIN = 70;
const BIRD_Y_MAX = 155;
const BIRD_SPAWN_CHANCE = 0.28;

const FISH_WIDTH = 32;
const FISH_HEIGHT = 20;
const FISH_Y_MIN = 75;
const FISH_Y_MAX = 160;
const FISH_SPAWN_CHANCE = 0.30;

const BLOCK_DURATION = 500;
const BLOCK_COOLDOWN = 1300;

const SKY_QUOTE_SPEED = 0.75;
const SKY_QUOTE_INTERVAL_MIN = 20000;
const SKY_QUOTE_INTERVAL_MAX = 40000;
const SKY_QUOTE_FIRST_DELAY_MIN = 8000;
const SKY_QUOTE_FIRST_DELAY_MAX = 14000;

type ObstacleType = "log" | "bird" | "fish";
type GameMode = "land" | "water";

interface Obstacle {
  x: number;
  width: number;
  height: number;
  type: ObstacleType;
  y: number;
  dead: boolean;
}

interface ScorePopup {
  x: number;
  y: number;
  timer: number;
  text: string;
}

interface SkyQuote {
  x: number;
  y: number;
  text: string;
  author: string;
}

interface GameState {
  turtleY: number;
  velocityY: number;
  isJumping: boolean;
  obstacles: Obstacle[];
  nextObstacleIn: number;
  score: number;
  scoreAccum: number;
  speed: number;
  phase: "start" | "playing" | "over";
  mode: GameMode;
  waterTransition: number;
  blocking: boolean;
  blockTimer: number;
  blockCooldown: number;
  scorePopups: ScorePopup[];
  skyQuotes: SkyQuote[];
  nextSkyQuoteIn: number;
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
    scoreAccum: 0,
    speed: GAME_SPEED,
    phase: "start",
    mode: "land",
    waterTransition: 0,
    blocking: false,
    blockTimer: 0,
    blockCooldown: 0,
    scorePopups: [],
    skyQuotes: [],
    nextSkyQuoteIn: SKY_QUOTE_FIRST_DELAY_MIN + Math.random() * (SKY_QUOTE_FIRST_DELAY_MAX - SKY_QUOTE_FIRST_DELAY_MIN),
  };
}

export default function TurtleJump() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gsRef = useRef<GameState>(createInitialState());
  const animFrameRef = useRef(0);
  const turtleImgRef = useRef<HTMLImageElement | null>(null);
  const overlayElRef = useRef<HTMLDivElement>(null);
  const controlsElRef = useRef<HTMLParagraphElement>(null);
  const [blockReady, setBlockReady] = useState(true);

  const jump = useCallback(() => {
    const gs = gsRef.current;
    if (gs.phase === "start" || gs.phase === "over") {
      gsRef.current = createInitialState();
      gsRef.current.phase = "playing";
      setBlockReady(true);
      if (overlayElRef.current) overlayElRef.current.style.display = "none";
      return;
    }
    if (!gs.isJumping) {
      gs.velocityY = JUMP_VELOCITY;
      gs.isJumping = true;
    }
  }, []);

  const block = useCallback(() => {
    const gs = gsRef.current;
    if (gs.phase !== "playing") return;
    if (gs.blocking || gs.blockCooldown > 0) return;
    gs.blocking = true;
    gs.blockTimer = BLOCK_DURATION;
    setBlockReady(false);
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

    const drawTurtle = (y: number, isBlocking: boolean) => {
      const tx = 60;
      if (isBlocking) {
        ctx.fillStyle = "#5a8e3e";
        ctx.beginPath();
        ctx.ellipse(tx + TURTLE_SIZE / 2, y + TURTLE_SIZE / 2, TURTLE_SIZE / 2, TURTLE_SIZE / 2.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#3d6b28";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#4a7e2e";
        const sr = TURTLE_SIZE * 0.35;
        ctx.beginPath();
        ctx.ellipse(tx + TURTLE_SIZE / 2, y + TURTLE_SIZE / 2, sr, sr, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#3d6b28";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(tx + TURTLE_SIZE / 2 - sr * 0.5, y + TURTLE_SIZE / 2);
        ctx.lineTo(tx + TURTLE_SIZE / 2 + sr * 0.5, y + TURTLE_SIZE / 2);
        ctx.moveTo(tx + TURTLE_SIZE / 2, y + TURTLE_SIZE / 2 - sr * 0.5);
        ctx.lineTo(tx + TURTLE_SIZE / 2, y + TURTLE_SIZE / 2 + sr * 0.5);
        ctx.stroke();
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(tx + TURTLE_SIZE / 2, y + TURTLE_SIZE / 2, TURTLE_SIZE / 2 + 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else if (turtleImgRef.current) {
        ctx.drawImage(turtleImgRef.current, tx, y, TURTLE_SIZE, TURTLE_SIZE);
      } else {
        ctx.fillStyle = "#5a9e3e";
        ctx.beginPath();
        ctx.ellipse(tx + TURTLE_SIZE / 2, y + TURTLE_SIZE / 2, TURTLE_SIZE / 2, TURTLE_SIZE / 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawLog = (obs: Obstacle, underwater: boolean) => {
      const lx = obs.x;
      const ly = obs.y;
      const lw = obs.width;
      const lh = obs.height;
      const cr = 3;
      const endRx = 5;
      const endRy = lh / 2 - 1;
      const cx = lx + lw;
      const cy = ly + lh / 2;

      ctx.fillStyle = underwater ? "rgba(70,100,90,0.2)" : "rgba(80,60,30,0.15)";
      ctx.beginPath();
      ctx.ellipse(lx + lw / 2, GROUND_Y + 2, lw / 2 + 2, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      const barkMain = underwater ? "#5a7a6a" : "#8B6914";
      const barkDark = underwater ? "#4a6a5a" : "#6B5010";
      const barkHighlight = underwater ? "#6a8a7a" : "#a08530";
      const barkGrain = underwater ? "#507060" : "#7a5c12";

      ctx.fillStyle = barkMain;
      ctx.beginPath();
      ctx.moveTo(lx + cr, ly);
      ctx.lineTo(lx + lw, ly);
      ctx.lineTo(lx + lw, ly + lh);
      ctx.lineTo(lx + cr, ly + lh);
      ctx.arcTo(lx, ly + lh, lx, ly + lh - cr, cr);
      ctx.lineTo(lx, ly + cr);
      ctx.arcTo(lx, ly, lx + cr, ly, cr);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = barkDark;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.strokeStyle = barkHighlight;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(lx + 1, ly + 1);
      ctx.lineTo(lx + lw - 1, ly + 1);
      ctx.stroke();

      ctx.strokeStyle = barkGrain;
      ctx.lineWidth = 0.6;
      const grainLines = 3;
      for (let i = 1; i <= grainLines; i++) {
        const gy = ly + (lh / (grainLines + 1)) * i;
        ctx.beginPath();
        ctx.moveTo(lx + 2, gy);
        ctx.lineTo(lx + lw - 1, gy);
        ctx.stroke();
      }

      const endFill = underwater ? "#4f6f5f" : "#7a5c14";
      const endStroke = underwater ? "#3a5a4a" : "#5a4510";
      const ringColor = underwater ? "#5a7a6a" : "#8B6914";
      const centerDot = underwater ? "#3a5a4a" : "#5a4510";

      ctx.fillStyle = endFill;
      ctx.beginPath();
      ctx.ellipse(cx, cy, endRx, endRy, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = endStroke;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.strokeStyle = ringColor;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy, endRx * 0.6, endRy * 0.6, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx, cy, endRx * 0.3, endRy * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = centerDot;
      ctx.beginPath();
      ctx.arc(cx, cy, 1.2, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawBird = (obs: Obstacle) => {
      const bx = obs.x + obs.width / 2;
      const by = obs.y + obs.height / 2;
      const wingPhase = Math.sin(performance.now() * 0.008 + obs.x) * 0.4;

      ctx.fillStyle = "#555";
      ctx.beginPath();
      ctx.ellipse(bx, by, obs.width / 2, obs.height / 3, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#444";
      ctx.beginPath();
      ctx.moveTo(bx - 4, by);
      ctx.quadraticCurveTo(bx - obs.width * 0.55, by - 14 + wingPhase * 10, bx - obs.width * 0.35, by - 8 + wingPhase * 6);
      ctx.lineTo(bx - 2, by);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(bx + 4, by);
      ctx.quadraticCurveTo(bx + obs.width * 0.55, by - 14 - wingPhase * 10, bx + obs.width * 0.35, by - 8 - wingPhase * 6);
      ctx.lineTo(bx + 2, by);
      ctx.fill();

      ctx.fillStyle = "#333";
      ctx.beginPath();
      ctx.arc(bx - 5, by - 2, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#c97";
      ctx.beginPath();
      ctx.moveTo(bx - obs.width / 2 - 3, by);
      ctx.lineTo(bx - obs.width / 2, by - 2);
      ctx.lineTo(bx - obs.width / 2, by + 2);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(bx - 5, by - 2.5, 1, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawFish = (obs: Obstacle) => {
      const fx = obs.x + obs.width / 2;
      const fy = obs.y + obs.height / 2;
      const wobble = Math.sin(performance.now() * 0.006 + obs.x) * 2;

      ctx.fillStyle = "#3a8a9e";
      ctx.beginPath();
      ctx.ellipse(fx, fy + wobble, obs.width / 2, obs.height / 2.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#2a7a8e";
      ctx.beginPath();
      ctx.moveTo(fx + obs.width / 2 - 2, fy + wobble);
      ctx.lineTo(fx + obs.width / 2 + 8, fy + wobble - 6);
      ctx.lineTo(fx + obs.width / 2 + 8, fy + wobble + 6);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#4a9aae";
      ctx.beginPath();
      ctx.moveTo(fx, fy + wobble - obs.height / 3);
      ctx.lineTo(fx + 3, fy + wobble - obs.height / 3 - 5);
      ctx.lineTo(fx + 6, fy + wobble - obs.height / 3);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#1a3a44";
      ctx.beginPath();
      ctx.arc(fx - obs.width / 4, fy + wobble - 1, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(fx - obs.width / 4, fy + wobble - 1.5, 0.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#3090a5";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 3; i++) {
        const sx = fx - 2 + i * 5;
        ctx.beginPath();
        ctx.moveTo(sx, fy + wobble);
        ctx.quadraticCurveTo(sx + 2, fy + wobble + 2, sx + 4, fy + wobble);
        ctx.stroke();
      }
    };

    const drawScore = (s: number, underwater: boolean) => {
      ctx.fillStyle = underwater ? "#3a6070" : "#666";
      ctx.font = "14px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(`Score: ${s}`, CANVAS_WIDTH - 16, 28);
      ctx.textAlign = "left";
    };

    const drawBlockIndicator = (gs: GameState) => {
      const ix = 16;
      const iy = 20;
      if (gs.blocking) {
        ctx.fillStyle = gs.mode === "water" ? "#2a7a8e" : "#5a8e3e";
        ctx.font = "bold 11px Inter, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("SHELL!", ix, iy);
      } else if (gs.blockCooldown > 0) {
        const pct = 1 - gs.blockCooldown / BLOCK_COOLDOWN;
        ctx.fillStyle = "#bbb";
        ctx.fillRect(ix, iy - 6, 40, 5);
        ctx.fillStyle = gs.mode === "water" ? "#3a9aae" : "#6aae4e";
        ctx.fillRect(ix, iy - 6, 40 * pct, 5);
        ctx.strokeStyle = "#999";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(ix, iy - 6, 40, 5);
      } else {
        ctx.fillStyle = gs.mode === "water" ? "#3a8a9e" : "#5a9e3e";
        ctx.font = "10px Inter, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("[B] Block", ix, iy);
      }
    };

    const showOverlay = (title: string, score: string, cta: string, quote?: { text: string; author: string }) => {
      if (!overlayElRef.current) return;
      overlayElRef.current.style.display = "flex";
      const children = overlayElRef.current.children;
      if (children[0]) children[0].textContent = title;
      if (children[1]) children[1].textContent = score;
      const quoteEl = children[2] as HTMLElement;
      const authorEl = children[3] as HTMLElement;
      if (quote) {
        quoteEl.textContent = `"${quote.text}"`;
        quoteEl.style.display = "block";
        authorEl.textContent = `\u2014 ${quote.author}`;
        authorEl.style.display = "block";
      } else {
        quoteEl.textContent = "";
        quoteEl.style.display = "none";
        authorEl.textContent = "";
        authorEl.style.display = "none";
      }
      if (children[4]) children[4].textContent = cta;
    };

    const updateControlsHint = (mode: GameMode) => {
      if (!controlsElRef.current) return;
      if (mode === "water") {
        controlsElRef.current.textContent = "Space/Tap to swim-jump \u00B7 B to shell-block fish";
      } else {
        controlsElRef.current.textContent = "Space/Tap to jump \u00B7 B to shell-block birds";
      }
    };

    showOverlay("Turtle Jump", "", "Press Space or Tap to start");
    updateControlsHint("land");

    let lastTime = performance.now();
    let prevMode: GameMode = "land";

    const loop = (time: number) => {
      const gs = gsRef.current;
      const rawDt = time - lastTime;
      const dt = Math.min(rawDt / 16.667, 2);
      lastTime = time;

      const waterT = gs.waterTransition;
      drawBackground(waterT);
      drawGround(waterT);

      if (gs.phase === "start") {
        drawTurtle(GROUND_Y - TURTLE_SIZE, false);
        animFrameRef.current = requestAnimationFrame(loop);
        return;
      }

      if (gs.phase === "over") {
        drawTurtle(gs.turtleY, gs.blocking);
        for (const obs of gs.obstacles) {
          if (obs.dead) continue;
          if (obs.type === "log") drawLog(obs, gs.mode === "water");
          else if (obs.type === "bird") drawBird(obs);
          else if (obs.type === "fish") drawFish(obs);
        }
        drawScore(gs.score, gs.mode === "water");
        animFrameRef.current = requestAnimationFrame(loop);
        return;
      }

      const targetMode: GameMode = (Math.floor(gs.score / MODE_INTERVAL) % 2 === 0) ? "land" : "water";
      gs.mode = targetMode;

      if (targetMode !== prevMode) {
        updateControlsHint(targetMode);
        prevMode = targetMode;
      }

      const targetT = targetMode === "water" ? 1 : 0;
      if (gs.waterTransition < targetT) {
        gs.waterTransition = Math.min(targetT, gs.waterTransition + 0.012 * dt);
      } else if (gs.waterTransition > targetT) {
        gs.waterTransition = Math.max(targetT, gs.waterTransition - 0.012 * dt);
      }

      if (gs.blocking) {
        gs.blockTimer -= rawDt;
        if (gs.blockTimer <= 0) {
          gs.blocking = false;
          gs.blockTimer = 0;
          gs.blockCooldown = BLOCK_COOLDOWN;
        }
      }
      if (gs.blockCooldown > 0) {
        gs.blockCooldown -= rawDt;
        if (gs.blockCooldown <= 0) {
          gs.blockCooldown = 0;
          setBlockReady(true);
        }
      }

      const currentGravity = gs.mode === "water" ? WATER_GRAVITY : GRAVITY;
      gs.velocityY += currentGravity * dt;
      gs.turtleY += gs.velocityY * dt;

      if (gs.turtleY >= GROUND_Y - TURTLE_SIZE) {
        gs.turtleY = GROUND_Y - TURTLE_SIZE;
        gs.velocityY = 0;
        gs.isJumping = false;
      }

      gs.nextObstacleIn -= gs.speed * dt;
      if (gs.nextObstacleIn <= 0) {
        const isAerial = gs.mode === "land"
          ? Math.random() < BIRD_SPAWN_CHANCE
          : Math.random() < FISH_SPAWN_CHANCE;

        if (isAerial) {
          const aType = gs.mode === "land" ? "bird" : "fish";
          const aW = aType === "bird" ? BIRD_WIDTH : FISH_WIDTH;
          const aH = aType === "bird" ? BIRD_HEIGHT : FISH_HEIGHT;
          const yMin = aType === "bird" ? BIRD_Y_MIN : FISH_Y_MIN;
          const yMax = aType === "bird" ? BIRD_Y_MAX : FISH_Y_MAX;
          gs.obstacles.push({
            x: CANVAS_WIDTH,
            width: aW,
            height: aH,
            type: aType,
            y: yMin + Math.random() * (yMax - yMin),
            dead: false,
          });
          gs.nextObstacleIn = OBSTACLE_MIN_GAP * 0.7 + Math.random() * (OBSTACLE_MAX_GAP - OBSTACLE_MIN_GAP) * 0.6;
        } else {
          const lw = LOG_WIDTH_MIN + Math.random() * (LOG_WIDTH_MAX - LOG_WIDTH_MIN);
          const lh = LOG_HEIGHT_BASE + Math.random() * LOG_HEIGHT_VAR;
          gs.obstacles.push({
            x: CANVAS_WIDTH,
            width: lw,
            height: lh,
            type: "log",
            y: GROUND_Y - lh,
            dead: false,
          });
          gs.nextObstacleIn = OBSTACLE_MIN_GAP + Math.random() * (OBSTACLE_MAX_GAP - OBSTACLE_MIN_GAP);
        }
      }

      for (let i = gs.obstacles.length - 1; i >= 0; i--) {
        const obs = gs.obstacles[i];
        const spd = (obs.type === "bird" || obs.type === "fish") ? gs.speed * 1.15 : gs.speed;
        obs.x -= spd * dt;
        if (obs.x + obs.width + 10 < 0) {
          gs.obstacles.splice(i, 1);
        }
      }

      const turtleLeft = 60 + 6;
      const turtleRight = 60 + TURTLE_SIZE - 8;
      const turtleTop = gs.turtleY + 6;
      const turtleBottom = gs.turtleY + TURTLE_SIZE;

      for (const obs of gs.obstacles) {
        if (obs.dead) continue;

        let obsLeft: number, obsRight: number, obsTop: number, obsBottom: number;
        if (obs.type === "log") {
          obsLeft = obs.x + 4;
          obsRight = obs.x + obs.width - 4;
          obsTop = obs.y;
          obsBottom = obs.y + obs.height;
        } else {
          obsLeft = obs.x + 3;
          obsRight = obs.x + obs.width - 3;
          obsTop = obs.y + 2;
          obsBottom = obs.y + obs.height - 2;
        }

        if (turtleRight > obsLeft && turtleLeft < obsRight && turtleBottom > obsTop && turtleTop < obsBottom) {
          if ((obs.type === "bird" || obs.type === "fish") && gs.blocking) {
            obs.dead = true;
            gs.scoreAccum += BLOCK_SCORE_BONUS;
            gs.score = Math.floor(gs.scoreAccum);
            gs.scorePopups.push({
              x: 60 + TURTLE_SIZE + 4,
              y: gs.turtleY - 4,
              timer: BLOCK_POPUP_DURATION,
              text: `+${BLOCK_SCORE_BONUS}`,
            });
            continue;
          }
          gs.phase = "over";
          gs.blocking = false;
          gs.blockTimer = 0;
          gs.blockCooldown = 0;
          setBlockReady(true);
          const q = randomQuote();
          const funnyLines = obs.type === "log"
            ? [
                "You were outpaced by moss.",
                "The log wins. Again.",
                "Slow and steady... didn't finish.",
                "Even the log looked surprised.",
              ]
            : obs.type === "bird"
            ? [
                "That bird had attitude.",
                "Should've ducked. Or blocked.",
                "Aerial assault, turtle down.",
                "Wings beat shell today.",
              ]
            : [
                "That fish meant business.",
                "Fin slap. Game over.",
                "The ocean is not your friend.",
                "Shell-block next time.",
              ];
          const funnyLine = funnyLines[Math.floor(Math.random() * funnyLines.length)];
          showOverlay(funnyLine, `Score: ${gs.score}`, "Press Space or Tap to restart", q);
          animFrameRef.current = requestAnimationFrame(loop);
          return;
        }
      }

      gs.scoreAccum += SCORE_PER_SECOND * (dt * 16.667 / 1000);
      gs.score = Math.floor(gs.scoreAccum);
      const speedMultiplier = 1 + SPEED_STEP_MULTIPLIER * Math.floor(gs.score / SPEED_STEP_INTERVAL);
      gs.speed = GAME_SPEED * speedMultiplier;

      for (let pi = gs.scorePopups.length - 1; pi >= 0; pi--) {
        gs.scorePopups[pi].timer -= rawDt;
        gs.scorePopups[pi].y -= 0.4 * dt;
        if (gs.scorePopups[pi].timer <= 0) {
          gs.scorePopups.splice(pi, 1);
        }
      }

      gs.nextSkyQuoteIn -= rawDt;
      if (gs.nextSkyQuoteIn <= 0) {
        const sq = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        gs.skyQuotes.push({
          x: CANVAS_WIDTH + 8,
          y: 18 + Math.random() * 30,
          text: sq.text,
          author: sq.author,
        });
        gs.nextSkyQuoteIn = SKY_QUOTE_INTERVAL_MIN + Math.random() * (SKY_QUOTE_INTERVAL_MAX - SKY_QUOTE_INTERVAL_MIN);
      }
      for (let si = gs.skyQuotes.length - 1; si >= 0; si--) {
        gs.skyQuotes[si].x -= SKY_QUOTE_SPEED * dt;
        if (gs.skyQuotes[si].x < -700) {
          gs.skyQuotes.splice(si, 1);
        }
      }

      for (const sq of gs.skyQuotes) {
        const fullText = `${sq.text}  \u2014 ${sq.author}`;
        ctx.font = "italic 9px serif";
        const tw = ctx.measureText(fullText).width;
        if (sq.x + tw < 0) continue;
        let alpha = Math.min(1, (CANVAS_WIDTH - sq.x) / 100);
        alpha = Math.min(alpha, Math.min(1, (sq.x + tw) / 100));
        alpha = Math.max(0, alpha);
        const r = Math.round(100 + (55 - 100) * waterT);
        const g = Math.round(72 + (92 - 72) * waterT);
        const b = Math.round(42 + (125 - 42) * waterT);
        ctx.save();
        ctx.font = "italic 9px serif";
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.45})`;
        ctx.fillText(fullText, sq.x, sq.y);
        ctx.restore();
      }

      drawTurtle(gs.turtleY, gs.blocking);
      for (const obs of gs.obstacles) {
        if (obs.dead) continue;
        if (obs.type === "log") drawLog(obs, gs.mode === "water");
        else if (obs.type === "bird") drawBird(obs);
        else if (obs.type === "fish") drawFish(obs);
      }
      drawScore(gs.score, gs.mode === "water");
      drawBlockIndicator(gs);

      for (const popup of gs.scorePopups) {
        const alpha = Math.min(1, popup.timer / (BLOCK_POPUP_DURATION * 0.3));
        ctx.globalAlpha = alpha;
        ctx.font = "bold 14px monospace";
        ctx.fillStyle = "#2d8a4e";
        ctx.fillText(popup.text, popup.x, popup.y);
        ctx.globalAlpha = 1;
      }

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
      if (e.code === "KeyB") {
        e.preventDefault();
        block();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [jump, block]);

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
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#f5f0e8]/90 pointer-events-none px-4"
          >
            <span className="text-[#333] font-bold text-lg font-body" data-testid="text-game-overlay-title"></span>
            <span className="text-[#666] text-sm mt-1 font-body" data-testid="text-game-overlay-score"></span>
            <p className="text-[#1f2937] font-bold text-base md:text-lg italic leading-snug max-w-[90%] text-center mt-4 font-body" style={{ display: "none" }} data-testid="text-game-quote"></p>
            <p className="text-[#4b5563] text-sm font-medium mt-1 font-body" style={{ display: "none" }} data-testid="text-game-quote-author"></p>
            <span className="text-[#888] text-sm mt-4 font-body" data-testid="text-game-overlay-cta"></span>
          </div>
        </div>

        <div className="text-center mt-6">
          <p ref={controlsElRef} className="text-xs text-muted-foreground" data-testid="text-game-controls">
            Space/Tap to jump &middot; B to shell-block birds
          </p>
          <p className="text-xs text-muted-foreground mt-1" data-testid="text-block-status">
            {blockReady ? "Block ready" : "Block recharging..."}
          </p>
        </div>
      </div>
    </div>
  );
}
