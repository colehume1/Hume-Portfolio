import { useEffect, useRef, useState } from "react";

const FAST_MIN = 700;
const IDLE_MS = 140;
const CURSOR_SIZE = 42;

const STATE_IMAGES = {
  idle: "/assets/cursor/turtle-happy.png",
  slow: "/assets/cursor/turtle-wide-eyed.png",
  fast: "/assets/cursor/turtle-headband-sweat.png",
};

type CursorState = "idle" | "slow" | "fast";

function preloadImages(urls: string[]): Promise<boolean[]> {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<boolean>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = url;
        })
    )
  );
}

function isDesktopWithFinePointer(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !("ontouchstart" in window)
  );
}

export function TurtleCursor() {
  const [enabled, setEnabled] = useState(false);
  const [cursorState, setCursorState] = useState<CursorState>("idle");
  const [position, setPosition] = useState({ x: -100, y: -100 });

  const lastPositionRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(Date.now());
  const idleTimeoutRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isDesktopWithFinePointer()) {
      return;
    }

    preloadImages(Object.values(STATE_IMAGES)).then((results) => {
      if (results.every((loaded) => loaded)) {
        setEnabled(true);
        document.documentElement.classList.add("turtle-cursor-active");
      }
    });

    return () => {
      document.documentElement.classList.remove("turtle-cursor-active");
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const deltaTime = now - lastTimeRef.current;

      if (deltaTime > 0) {
        const deltaX = e.clientX - lastPositionRef.current.x;
        const deltaY = e.clientY - lastPositionRef.current.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const speed = (distance / deltaTime) * 1000;

        if (speed >= FAST_MIN) {
          setCursorState("fast");
        } else if (speed > 0) {
          setCursorState("slow");
        }

        if (idleTimeoutRef.current) {
          clearTimeout(idleTimeoutRef.current);
        }
        idleTimeoutRef.current = window.setTimeout(() => {
          setCursorState("idle");
        }, IDLE_MS);
      }

      lastPositionRef.current = { x: e.clientX, y: e.clientY };
      lastTimeRef.current = now;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      id="turtle-cursor"
      style={{
        position: "fixed",
        left: position.x - CURSOR_SIZE / 2,
        top: position.y - CURSOR_SIZE / 2,
        width: CURSOR_SIZE,
        height: CURSOR_SIZE,
        backgroundImage: `url(${STATE_IMAGES[cursorState]})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        pointerEvents: "none",
        zIndex: 99999,
        transform: cursorState === "fast" ? "scale(1.1)" : "scale(1)",
        transition: "transform 0.1s ease-out",
        willChange: "left, top, transform",
      }}
      data-testid="turtle-cursor"
    />
  );
}
