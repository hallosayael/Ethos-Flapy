const ethImg = new Image();
ethImg.src = "/eth-bird.png";

import React, { useEffect, useRef, useState } from 'react';

const GRAVITY = 0.5;
const FLAP = -8;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;

export default function App() {
  const canvasRef = useRef(null);
  const [birdY, setBirdY] = useState(200);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState([{ x: 400, height: Math.random() * 200 + 50 }]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const flap = () => {
    if (!gameOver) setVelocity(FLAP);
    else {
      setBirdY(200);
      setVelocity(0);
      setPipes([{ x: 400, height: Math.random() * 200 + 50 }]);
      setScore(0);
      setGameOver(false);
    }
  };

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');

    const interval = setInterval(() => {
      if (gameOver) return;

      const newVelocity = velocity + GRAVITY;
      const newY = birdY + newVelocity;
      setBirdY(newY);
      setVelocity(newVelocity);

      const newPipes = pipes.map(pipe => ({ ...pipe, x: pipe.x - 2 }));
      if (newPipes[0].x < -PIPE_WIDTH) {
        newPipes.shift();
        newPipes.push({ x: 400, height: Math.random() * 200 + 50 });
        setScore(prev => prev + 1);
      }
      setPipes(newPipes);

      if (newY > 400 || newY < 0 ||
        (newPipes[0].x < 50 && newPipes[0].x + PIPE_WIDTH > 0 &&
         (newY < newPipes[0].height || newY > newPipes[0].height + PIPE_GAP))) {
        setGameOver(true);
      }

      ctx.clearRect(0, 0, 400, 500);
      ctx.fillStyle = 'skyblue';
      ctx.fillRect(0, 0, 400, 500);

      ctx.drawImage(ethImg, 25, newY - 20, 50, 50); // Gambar logo Ethereum sebagai pemain


      newPipes.forEach(pipe => {
      const gradientTop = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
      gradientTop.addColorStop(0, '#4CAF50');
      gradientTop.addColorStop(0.5, '#2E7D32');
      gradientTop.addColorStop(1, '#4CAF50');

      const gradientBottom = ctx.createLinearGradient(pipe.x, pipe.height + PIPE_GAP, pipe.x + PIPE_WIDTH, 0);
      gradientBottom.addColorStop(0, '#4CAF50');
      gradientBottom.addColorStop(0.5, '#2E7D32');
      gradientBottom.addColorStop(1, '#4CAF50');

      // Top pipe
      ctx.fillStyle = gradientTop;
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.height);
      ctx.strokeStyle = "#1B5E20";
      ctx.lineWidth = 2;
      ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.height);

      // Bottom pipe
      ctx.fillStyle = gradientBottom;
      ctx.fillRect(pipe.x, pipe.height + PIPE_GAP, PIPE_WIDTH, 500);
      ctx.strokeRect(pipe.x, pipe.height + PIPE_GAP, PIPE_WIDTH, 500);
    });


      ctx.fillStyle = 'white';
      ctx.font = '24px Arial';
      ctx.fillText(`Score: ${score}`, 10, 30);
    }, 20);

    return () => clearInterval(interval);
  }, [birdY, velocity, pipes, gameOver]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <canvas
        ref={canvasRef}
        width={400}
        height={500}
        onClick={flap}
        className="border-4 border-white rounded"
      />
      <p className="mt-4">{gameOver ? "Game Over - Click to Restart" : "Click to Flap"}</p>
    </div>
  );
}
