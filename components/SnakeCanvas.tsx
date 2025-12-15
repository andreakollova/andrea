import React, { useEffect, useRef } from 'react';
import { Direction, Point } from '../types';
import { GAME_CONFIG } from '../constants';

interface SnakeCanvasProps {
  onEat: () => void;
  onInteractionStart: () => void;
  onMenuHit: () => void;
  isPaused: boolean;
  resetKey: number;
}

const SnakeCanvas: React.FC<SnakeCanvasProps> = ({ onEat, onInteractionStart, onMenuHit, isPaused, resetKey }) => {
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
    // Top right corner with padding
    menuPositionRef.current = { x: width - 50, y: 50 };
  };

  const spawnFood = (width: number, height: number) => {
    const margin = 50;
    // Ensure we have positive dimensions
    const safeWidth = Math.max(width - margin * 2, 10);
    const safeHeight = Math.max(height - margin * 2, 10);
    
    let placed = false;
    let attempts = 0;
    
    // Try to place food 20 times, if fail, just place it safely
    while (!placed && attempts < 20) {
      const x = margin + Math.random() * safeWidth;
      const y = margin + Math.random() * safeHeight;
      
      // Avoid spawning too close to menu
      const menu = menuPositionRef.current;
      const distToMenu = Math.sqrt(Math.pow(x - menu.x, 2) + Math.pow(y - menu.y, 2));
      
      if (distToMenu >= 120) {
        foodRef.current = { x, y };
        placed = true;
      }
      attempts++;
    }

    // Fallback: if we couldn't place it randomly, place it in upper center
    if (!placed) {
       foodRef.current = { x: width / 2, y: height / 3 };
    }
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
      if (isPaused) return;
      // Prevent default to avoid scrolling/zooming and mouse event emulation
      if (e.cancelable) e.preventDefault(); 
      const touch = e.touches[0];
      handlePointerInput(touch.clientX, touch.clientY);
    };

    const handleMouseDown = (e: MouseEvent) => {
        handlePointerInput(e.clientX, e.clientY);
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
    };

    const draw = (context: CanvasRenderingContext2D) => {
      const { w, h } = canvasSizeRef.current;
      
      context.clearRect(0, 0, w, h);

      // Draw Menu Target
      const mx = menuPositionRef.current.x;
      const my = menuPositionRef.current.y;
      
      context.strokeStyle = '#a8a29e'; 
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
          context.fillStyle = '#a8a29e'; 
          context.textAlign = 'right';
          context.fillText('HIT TO OPEN', mx - 25, my + 4);
      }

      // Draw Snake
      context.beginPath();
      context.lineWidth = GAME_CONFIG.segmentSize;
      context.strokeStyle = GAME_CONFIG.colorSnake;

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
      context.beginPath();
      context.strokeStyle = GAME_CONFIG.colorFood;
      context.lineWidth = 1.5;
      context.arc(foodRef.current.x, foodRef.current.y, 8, 0, Math.PI * 2);
      context.stroke();

      context.beginPath();
      context.fillStyle = GAME_CONFIG.colorFood;
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
  }, [onEat, onInteractionStart, onMenuHit, isPaused, resetKey]);

  return <canvas ref={canvasRef} className="block absolute top-0 left-0 w-full h-full z-0 cursor-none" />;
};

export default SnakeCanvas;