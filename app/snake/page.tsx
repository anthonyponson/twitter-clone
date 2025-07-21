"use client";
import React, { useRef, useEffect, useState } from "react";

const CANVAS_SIZE = 400;
const SCALE = 20;
const INITIAL_SNAKE = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const SPEED = 100; // ms

function getRandomFood(snake: { x: number; y: number }[]) {
  let newFood;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * (CANVAS_SIZE / SCALE)),
      y: Math.floor(Math.random() * (CANVAS_SIZE / SCALE)),
    };
    if (!snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
}

const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(getRandomFood(INITIAL_SNAKE));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!started) setStarted(true);
      switch (e.key) {
        case "ArrowUp":
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, started]);

  // Game loop
  useEffect(() => {
    if (gameOver || !started) return;
    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newHead = {
          x: prevSnake[0].x + direction.x,
          y: prevSnake[0].y + direction.y,
        };
        // Check collision with wall
        if (
          newHead.x < 0 ||
          newHead.x >= CANVAS_SIZE / SCALE ||
          newHead.y < 0 ||
          newHead.y >= CANVAS_SIZE / SCALE
        ) {
          setGameOver(true);
          return prevSnake;
        }
        // Check collision with self
        if (prevSnake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }
        let newSnake;
        // Check food
        if (newHead.x === food.x && newHead.y === food.y) {
          newSnake = [newHead, ...prevSnake];
          setFood(getRandomFood(newSnake));
          setScore((s) => s + 1);
        } else {
          newSnake = [newHead, ...prevSnake.slice(0, -1)];
        }
        return newSnake;
      });
    }, SPEED);
    return () => clearInterval(interval);
  }, [direction, food, gameOver, started]);

  // Draw on canvas
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    // Draw snake
    ctx.fillStyle = "#22c55e";
    snake.forEach((segment, idx) => {
      ctx.fillRect(segment.x * SCALE, segment.y * SCALE, SCALE, SCALE);
    });
    // Draw food
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(food.x * SCALE, food.y * SCALE, SCALE, SCALE);
    // Draw grid (optional)
    ctx.strokeStyle = "#e5e7eb";
    for (let i = 0; i < CANVAS_SIZE / SCALE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * SCALE, 0);
      ctx.lineTo(i * SCALE, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * SCALE);
      ctx.lineTo(CANVAS_SIZE, i * SCALE);
      ctx.stroke();
    }
  }, [snake, food]);

  const handleRestart = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(getRandomFood(INITIAL_SNAKE));
    setScore(0);
    setGameOver(false);
    setStarted(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
      <h1>Snake Game</h1>
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        style={{ border: "2px solid #333", background: "#fafafa" }}
      />
      <div style={{ margin: 16, fontSize: 18 }}>Score: {score}</div>
      {gameOver && (
        <div style={{ color: "#ef4444", fontWeight: "bold", marginBottom: 8 }}>
          Game Over!
        </div>
      )}
      <button onClick={handleRestart} style={{ padding: "8px 16px", fontSize: 16 }}>
        {gameOver ? "Restart" : "Restart Game"}
      </button>
      <div style={{ marginTop: 16, color: "#888" }}>
        Use arrow keys to play
      </div>
    </div>
  );
};

export default SnakeGame;
