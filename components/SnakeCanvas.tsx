import React, { useEffect, useRef } from 'react';
import { Direction, Point } from '../types';
import { GAME_CONFIG } from '../constants';

interface SnakeCanvasProps {
  onEat: () => void;
  onInteractionStart: () => void;
  onAutoStart: () => void;
  onUserTookControl: () => void;
  onMenuHit: () => void;
  onToggleDark: () => void;
  isPaused: boolean;
  isDark: boolean;
  resetKey: number;
}

const SnakeCanvas: React.FC<SnakeCanvasProps> = ({ onEat, onInteractionStart, onAutoStart, onUserTookControl, onMenuHit, onToggleDark, isPaused, isDark, resetKey }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Game State Refs
  const snakeRef = useRef<Point[]>([]); 
  const directionRef = useRef<Direction>(null);
  // Input Queue to prevent missed turns during fast inputs
  const directionQueueRef = useRef<Direction[]>([]);
  
  const foodRef = useRef<Point>({ x: 0, y: 0 });
  const frameIdRef = useRef<number>(0);
  const canvasSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const menuPositionRef = useRef<Point>({ x: 0, y: 0 });
  const switchPositionRef = useRef<Point>({ x: 0, y: 0 });
  const inSwitchZoneRef = useRef<boolean>(false); // prevent repeated toggle while snake stays in area
  const autoStartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userHasInteractedRef = useRef(false);
  const autoPlayingRef = useRef(false);

  // Helper to safely queue direction changes
  const queueDirection = (newDir: Direction) => {
    // Determine the last planned direction to validate the next move
    const lastPlanned = directionQueueRef.current.length > 0 
       ? directionQueueRef.current[directionQueueRef.current.length - 1] 
       : directionRef.current;
     
    // If not moving yet, allow any valid direction
    if (!lastPlanned) {
      // Just ensure we don't duplicate
      if (directionQueueRef.current.length === 0) {
        directionQueueRef.current.push(newDir);
      }
      return;
    }

    // Prevent 180 degree turns (reversing) and duplicates
    const isOpposite = 
      (lastPlanned === 'UP' && newDir === 'DOWN') ||
      (lastPlanned === 'DOWN' && newDir === 'UP') ||
      (lastPlanned === 'LEFT' && newDir === 'RIGHT') ||
      (lastPlanned === 'RIGHT' && newDir === 'LEFT');
    
    if (!isOpposite && lastPlanned !== newDir) {
       // Limit queue to 2 moves to prevent huge buffers
       if (directionQueueRef.current.length < 2) {
          directionQueueRef.current.push(newDir);
       }
    }
  };

  const updateMenuPosition = (width: number) => {
    menuPositionRef.current = { x: width - 50, y: 50 };
    switchPositionRef.current = { x: width < 768 ? 53 : 58, y: 50 };
  };

  const spawnFood = (width: number, height: number) => {
    const margin = 50;
    const safeWidth = Math.max(width - margin * 2, 10);
    const safeHeight = Math.max(height - margin * 2, 10);

    const isBlocked = (x: number, y: number): boolean => {
      // Menu icon + "HIT TO OPEN" text (top right)
      const menu = menuPositionRef.current;
      const distToMenu = Math.sqrt(Math.pow(x - menu.x, 2) + Math.pow(y - menu.y, 2));
      if (distToMenu < 150) return true;

      // Switch icon + "HIT TO SWITCH" text (top left)
      const sw = switchPositionRef.current;
      if (x >= sw.x - 25 && x <= sw.x + 170 && y >= sw.y - 25 && y <= sw.y + 25) return true;

      // Hero text block (centered, middle of screen)
      const heroHalfW = Math.min(width * 0.38, 340);
      if (Math.abs(x - width / 2) < heroHalfW && Math.abs(y - height / 2) < 120) return true;

      // Bottom hint text ("MOVE THE SNAKE TO EXPLORE")
      if (y > height - 90) return true;

      return false;
    };

    for (let attempts = 0; attempts < 50; attempts++) {
      const x = margin + Math.random() * safeWidth;
      const y = margin + Math.random() * safeHeight;
      if (!isBlocked(x, y)) {
        foodRef.current = { x, y };
        return;
      }
    }

    // Fallback: pick first safe candidate
    const fallbacks = [
      { x: width * 0.15, y: height * 0.35 },
      { x: width * 0.85, y: height * 0.65 },
      { x: width * 0.5,  y: height * 0.15 },
    ];
    for (const pos of fallbacks) {
      if (!isBlocked(pos.x, pos.y)) { foodRef.current = pos; return; }
    }
    foodRef.current = { x: width * 0.15, y: height * 0.35 };
  };

  const initGame = (width: number, height: number) => {
    const startX = Math.floor(width / 2);
    const startY = Math.floor(height * 0.75);
    
    const initialSnake: Point[] = [];
    for (let i = 0; i < 20; i++) {
      initialSnake.push({ x: startX, y: startY + i * (GAME_CONFIG.segmentSize / 2) });
    }
    
    snakeRef.current = initialSnake;
    directionRef.current = null;
    directionQueueRef.current = [];
    inSwitchZoneRef.current = false;
    
    updateMenuPosition(width);
    spawnFood(width, height);
  };

  // Reset effect when resetKey changes (e.g. closing menu)
  useEffect(() => {
    const { w, h } = canvasSizeRef.current;
    if (w > 0 && h > 0) {
      initGame(w, h);
    }
  }, [resetKey]);

  // Auto-start snake after 5 seconds of no interaction
  useEffect(() => {
    userHasInteractedRef.current = false;
    autoPlayingRef.current = false;
    if (autoStartTimerRef.current) clearTimeout(autoStartTimerRef.current);

    autoStartTimerRef.current = setTimeout(() => {
      if (!userHasInteractedRef.current && directionRef.current === null) {
        autoPlayingRef.current = true;
        onInteractionStart();
        onAutoStart();
        queueDirection('UP');
      }
    }, 3000);

    return () => {
      if (autoStartTimerRef.current) {
        clearTimeout(autoStartTimerRef.current);
        autoStartTimerRef.current = null;
      }
    };
  }, [resetKey, onInteractionStart, onAutoStart]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle Resize
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      
      ctx.scale(dpr, dpr);
      
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      
      canvasSizeRef.current = { w, h };
      
      // If snake is empty (first load), init
      if (snakeRef.current.length === 0) {
        initGame(w, h);
      } else {
        // If resized, ensure menu and food are updated
        updateMenuPosition(w);
        if (foodRef.current.x > w || foodRef.current.y > h) {
          spawnFood(w, h);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Input Handling
    const handleKeydown = (e: KeyboardEvent) => {
      userHasInteractedRef.current = true;
      if (autoStartTimerRef.current) { clearTimeout(autoStartTimerRef.current); autoStartTimerRef.current = null; }
      if (autoPlayingRef.current) { autoPlayingRef.current = false; onUserTookControl(); }
      if (isPaused) return;

      const key = e.key;
      
      if (!directionRef.current && (key.startsWith('Arrow') || key === ' ')) {
        onInteractionStart();
      }

      if (key === 'ArrowUp') queueDirection('UP');
      else if (key === 'ArrowDown') queueDirection('DOWN');
      else if (key === 'ArrowLeft') queueDirection('LEFT');
      else if (key === 'ArrowRight') queueDirection('RIGHT');
    };
    
    // Context-Aware Input Handler for Touch/Mouse
    const handlePointerInput = (clientX: number, clientY: number) => {
      if (isPaused) return;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const cx = w / 2;
      const cy = h / 2;
      
      // Get the intended next direction to determine split axis
      const lastPlanned = directionQueueRef.current.length > 0 
          ? directionQueueRef.current[directionQueueRef.current.length - 1] 
          : directionRef.current;
      
      // Case 1: Start (Stationary) - Use 4-cone logic
      if (!lastPlanned) {
         onInteractionStart();
         const dx = clientX - cx;
         const dy = clientY - cy;
         
         if (Math.abs(dx) > Math.abs(dy)) {
             queueDirection(dx > 0 ? 'RIGHT' : 'LEFT');
         } else {
             queueDirection(dy > 0 ? 'DOWN' : 'UP');
         }
         return;
      }
      
      // Case 2: Moving Vertically -> Split screen Left/Right
      if (lastPlanned === 'UP' || lastPlanned === 'DOWN') {
         queueDirection(clientX < cx ? 'LEFT' : 'RIGHT');
      }
      // Case 3: Moving Horizontally -> Split screen Up/Down
      else if (lastPlanned === 'LEFT' || lastPlanned === 'RIGHT') {
         queueDirection(clientY < cy ? 'UP' : 'DOWN');
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const tx = touch.clientX;
      const ty = touch.clientY;

      // Switch — always works regardless of pause state
      const { x: swx, y: swy } = switchPositionRef.current;
      if (tx >= swx - 25 && tx <= swx + 170 && ty >= swy - 25 && ty <= swy + 25) {
        if (e.cancelable) e.preventDefault();
        onToggleDark();
        return;
      }

      // Dismiss auto-play hint on any intentional touch
      if (autoPlayingRef.current) { autoPlayingRef.current = false; onUserTookControl(); }

      // When paused (menu/modal open): let React handle everything else
      // (X button, nav items, modal close — all rely on React onClick)
      if (isPaused) return;

      // From here on — real game input, count as user interaction
      userHasInteractedRef.current = true;
      if (autoStartTimerRef.current) { clearTimeout(autoStartTimerRef.current); autoStartTimerRef.current = null; }

      // Menu icon — only when game is running (not when menu already open)
      const dxMenu = tx - menuPositionRef.current.x;
      const dyMenu = ty - menuPositionRef.current.y;
      if (Math.sqrt(dxMenu * dxMenu + dyMenu * dyMenu) < 50) {
        if (e.cancelable) e.preventDefault();
        if (!directionRef.current) onInteractionStart();
        onMenuHit();
        return;
      }

      // Game input — prevent scroll/zoom
      if (e.cancelable) e.preventDefault();

      // Tap on food
      const dxFood = tx - foodRef.current.x;
      const dyFood = ty - foodRef.current.y;
      if (Math.sqrt(dxFood * dxFood + dyFood * dyFood) < 24) {
        if (!directionRef.current) onInteractionStart();
        onEat();
        spawnFood(canvasSizeRef.current.w, canvasSizeRef.current.h);
        return;
      }

      handlePointerInput(tx, ty);
    };

    const handleMouseDown = (e: MouseEvent) => {
      userHasInteractedRef.current = true;
      if (autoStartTimerRef.current) { clearTimeout(autoStartTimerRef.current); autoStartTimerRef.current = null; }
      if (autoPlayingRef.current) { autoPlayingRef.current = false; onUserTookControl(); }
      const cx = e.clientX;
      const cy = e.clientY;

      // Click on food → trigger eat
      const dxFood = cx - foodRef.current.x;
      const dyFood = cy - foodRef.current.y;
      if (Math.sqrt(dxFood * dxFood + dyFood * dyFood) < 24) {
        if (!directionRef.current) onInteractionStart();
        onEat();
        spawnFood(canvasSizeRef.current.w, canvasSizeRef.current.h);
        return;
      }

      // Click on menu icon → trigger menu open
      const dxMenu = cx - menuPositionRef.current.x;
      const dyMenu = cy - menuPositionRef.current.y;
      if (Math.sqrt(dxMenu * dxMenu + dyMenu * dyMenu) < 40) {
        if (!directionRef.current) onInteractionStart();
        onMenuHit();
        return;
      }

      // Click on switch icon or its label text → toggle dark mode
      const { x: swx, y: swy } = switchPositionRef.current;
      if (cx >= swx - 15 && cx <= swx + 130 && cy >= swy - 15 && cy <= swy + 15) {
        onToggleDark();
        return;
      }

      handlePointerInput(cx, cy);
    };

    window.addEventListener('keydown', handleKeydown);
    // Add passive: false to allow preventDefault
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('mousedown', handleMouseDown);

    // Game Loop
    const loop = () => {
      if (isPaused) {
        draw(ctx);
        frameIdRef.current = requestAnimationFrame(loop);
        return;
      }

      update();
      draw(ctx);
      frameIdRef.current = requestAnimationFrame(loop);
    };

    const update = () => {
      // Consume direction from queue
      if (directionQueueRef.current.length > 0) {
        directionRef.current = directionQueueRef.current.shift()!;
      }

      if (!directionRef.current) return;

      const head = { ...snakeRef.current[0] };
      const speed = GAME_CONFIG.speed;

      switch (directionRef.current) {
        case 'UP': head.y -= speed; break;
        case 'DOWN': head.y += speed; break;
        case 'LEFT': head.x -= speed; break;
        case 'RIGHT': head.x += speed; break;
      }

      const { w, h } = canvasSizeRef.current;
      if (head.x < 0) head.x = w;
      if (head.x > w) head.x = 0;
      if (head.y < 0) head.y = h;
      if (head.y > h) head.y = 0;

      snakeRef.current.unshift(head);
      
      // Collision with Food
      const dxFood = head.x - foodRef.current.x;
      const dyFood = head.y - foodRef.current.y;
      if (Math.sqrt(dxFood * dxFood + dyFood * dyFood) < GAME_CONFIG.segmentSize + 10) {
        onEat();
        spawnFood(w, h);
      } else {
        snakeRef.current.pop();
      }

      // Collision with Menu
      const dxMenu = head.x - menuPositionRef.current.x;
      const dyMenu = head.y - menuPositionRef.current.y;
      if (Math.sqrt(dxMenu * dxMenu + dyMenu * dyMenu) < 40) {
        onMenuHit();
      }

      // Collision with Switch — fire only on entry, not every frame
      const { x: swx, y: swy } = switchPositionRef.current;
      const nowInSwitch = head.x >= swx - 15 && head.x <= swx + 130 && head.y >= swy - 15 && head.y <= swy + 15;
      if (nowInSwitch && !inSwitchZoneRef.current) {
        onToggleDark();
      }
      inSwitchZoneRef.current = nowInSwitch;
    };

    const draw = (context: CanvasRenderingContext2D) => {
      const { w, h } = canvasSizeRef.current;
      const color = isDark ? '#9e9e9e' : '#959090';
      const colorDim = isDark ? '#6b6b6b' : '#b7b0ab';

      context.clearRect(0, 0, w, h);

      // Draw Menu Target (top right)
      const mx = menuPositionRef.current.x;
      const my = menuPositionRef.current.y;

      context.strokeStyle = color;
      context.lineWidth = 2;
      context.lineCap = 'round';

      context.beginPath();
      context.moveTo(mx - 12, my - 7);
      context.lineTo(mx + 12, my - 7);
      context.moveTo(mx - 12, my);
      context.lineTo(mx + 12, my);
      context.moveTo(mx - 12, my + 7);
      context.lineTo(mx + 12, my + 7);
      context.stroke();

      if (directionRef.current) {
        context.font = '10px Inter, sans-serif';
        context.fillStyle = colorDim;
        context.textAlign = 'right';
        context.fillText('HIT TO OPEN', mx - 25, my + 4);
      }

      // Draw Switch Target (top left) — sun or moon icon
      const sx = switchPositionRef.current.x;
      const sy = switchPositionRef.current.y;

      context.strokeStyle = color;
      context.fillStyle = color;
      context.lineWidth = 1.5;

      if (isDark) {
        // Stroke-only crescent moon: two arcs connecting at intersection points
        // Outer circle R=9 at (sx,sy), inner circle r=7.5 at (sx+5, sy-3)
        // Intersection angles (precomputed): outer start=0.435, outer end=-1.515
        //   inner start=4.072, inner end=1.135
        context.save();
        context.beginPath();
        context.arc(sx, sy, 9, 0.435, -1.515, false);       // outer back arc (clockwise)
        context.arc(sx + 5, sy - 3, 7.5, 4.072, 1.135, true); // inner concave arc (CCW)
        context.strokeStyle = color;
        context.lineWidth = 1.5;
        context.stroke();
        context.restore();
      } else {
        // Sun icon
        context.beginPath();
        context.arc(sx, sy, 5, 0, Math.PI * 2);
        context.stroke();
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI) / 4;
          context.beginPath();
          context.moveTo(sx + Math.cos(angle) * 8, sy + Math.sin(angle) * 8);
          context.lineTo(sx + Math.cos(angle) * 11, sy + Math.sin(angle) * 11);
          context.stroke();
        }
      }

      if (directionRef.current) {
        context.font = '10px Inter, sans-serif';
        context.fillStyle = colorDim;
        context.textAlign = 'left';
        context.fillText('HIT TO SWAP', sx + 25, sy + 4);
      }

      // Draw Snake
      context.beginPath();
      context.lineWidth = GAME_CONFIG.segmentSize;
      context.strokeStyle = isDark ? '#7e7e7e' : GAME_CONFIG.colorSnake;

      if (snakeRef.current.length > 1) {
        context.moveTo(snakeRef.current[0].x, snakeRef.current[0].y);
        for (let i = 1; i < snakeRef.current.length; i++) {
          const p1 = snakeRef.current[i - 1];
          const p2 = snakeRef.current[i];
          
          if (Math.abs(p1.x - p2.x) > 100 || Math.abs(p1.y - p2.y) > 100) {
            context.stroke();
            context.beginPath();
            context.moveTo(p2.x, p2.y);
          } else {
            context.lineTo(p2.x, p2.y);
          }
        }
        context.stroke();
      }

      // Draw Food
      const foodColor = isDark ? '#7e7e7e' : GAME_CONFIG.colorFood;
      context.beginPath();
      context.strokeStyle = foodColor;
      context.lineWidth = 1.5;
      context.arc(foodRef.current.x, foodRef.current.y, 8, 0, Math.PI * 2);
      context.stroke();

      context.beginPath();
      context.fillStyle = foodColor;
      context.arc(foodRef.current.x, foodRef.current.y, 3, 0, Math.PI * 2);
      context.fill();
    };

    frameIdRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('mousedown', handleMouseDown);
      cancelAnimationFrame(frameIdRef.current);
    };
  }, [onEat, onInteractionStart, onMenuHit, onToggleDark, isPaused, isDark, resetKey]);

  return <canvas ref={canvasRef} className="block absolute top-0 left-0 w-full h-full z-0" />;
};

export default SnakeCanvas;