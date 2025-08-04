import React, { useEffect, useRef, useState } from 'react';

const GRAVITY = 0.5;
const FLAP = -8;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;

const ethImg = new Image();
ethImg.src = "/ethos-bird.png";

export default function App() {
  const canvasRef = useRef(null);
  const [birdY, setBirdY] = useState(200);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  const flap = () => {
    if (!gameOver) {
      setVelocity(FLAP);
    } else {
      setBirdY(dimensions.height / 2);
      setVelocity(0);
      setPipes([{ x: dimensions.width, height: Math.random() * (dimensions.height / 2) }]);
      setScore(0);
      setGameOver(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // initial call

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const ctx = canvas.getContext('2d');

    if (pipes.length === 0) {
      setPipes([{ x: dimensions.width, height: Math.random() * (dimensions.height / 2) }]);
    }

    const interval = setInterval(() => {
      if (gameOver) return;

      const newVelocity = velocity + GRAVITY;
      const newY = birdY + newVelocity;
      setBirdY(newY);
      setVelocity(newVelocity);

      const newPipes = pipes.map(pipe => ({ ...pipe, x: pipe.x - 2 }));
      if (newPipes[0].x < -PIPE_WIDTH) {
        newPipes.shift();
        newPipes.push({ x: dimensions.width, height: Math.random() * (dimensions.height / 2) });
        setScore(prev => prev + 1);
      }
      setPipes(newPipes);

      const currentPipe = newPipes[0];
      if (
        newY > dimensions.height ||
        newY < 0 ||
        (currentPipe.x < 75 && currentPipe.x + PIPE_WIDTH > 0 &&
         (newY < currentPipe.height || newY > currentPipe.height + PIPE_GAP))
      ) {
        setGameOver(true);
      }

      // DRAWING
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      ctx.fillStyle = 'skyblue';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // draw bird
      ctx.drawImage(ethImg, 50, newY - 25, 50, 50);

      newPipes.forEach(pipe => {
        const gradientTop = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
        gradientTop.addColorStop(0, '#4CAF50');
        gradientTop.addColorStop(0.5, '#2E7D32');
        gradientTop.addColorStop(1, '#4CAF50');

        const gradientBottom = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
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
        ctx.fillRect(pipe.x, pipe.height + PIPE_GAP, PIPE_WIDTH, dimensions.height);
        ctx.strokeRect(pipe.x, pipe.height + PIPE_GAP, PIPE_WIDTH, dimensions.height);
      });

      ctx.fillStyle = 'white';
      ctx.font = '24px Arial';
      ctx.fillText(`Score: ${score}`, 20, 40);
    }, 20);

    return () => clearInterval(interval);
  }, [birdY, velocity, pipes, gameOver, dimensions]);

  return (
    <div className="bg-black m-0 p-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        onClick={flap}
        className="block w-full h-full"
        style={{ display: 'block' }}
      />
      <p className="absolute top-4 left-4 text-white text-lg font-semibold">
        {gameOver ? "Game Over - Click to Restart" : "Click to Flap"}
      </p>
    </div>
  );
}
