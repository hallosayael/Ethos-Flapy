import React, { useEffect, useRef, useState } from 'react';

const GRAVITY = 0.5;
const FLAP = -8;
const PIPE_WIDTH = 60;
const PIPE_GAP = 200;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const welcomeImg = new Image();
welcomeImg.src = "/claim-spot.png";


const ethImg = new Image();
ethImg.src = "/ethos-bird.png";

export default function App() {
  const canvasRef = useRef(null);
  const [birdY, setBirdY] = useState(CANVAS_HEIGHT / 2);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState([{ x: CANVAS_WIDTH, height: Math.random() * 300 + 50 }]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const flap = () => {
    if (!gameOver) {
      setVelocity(FLAP);
    } else {
      setBirdY(CANVAS_HEIGHT / 2);
      setVelocity(0);
      setPipes([{ x: CANVAS_WIDTH, height: Math.random() * 300 + 50 }]);
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

      const newPipes = pipes.map(pipe => ({ ...pipe, x: pipe.x - 3 }));
      if (newPipes[0].x < -PIPE_WIDTH) {
        newPipes.shift();
        newPipes.push({ x: CANVAS_WIDTH, height: Math.random() * 300 + 50 });
        setScore(prev => prev + 1);
      }
      setPipes(newPipes);

      const currentPipe = newPipes[0];
      if (
        newY > CANVAS_HEIGHT || newY < 0 ||
        (currentPipe.x < 75 && currentPipe.x + PIPE_WIDTH > 25 &&
         (newY < currentPipe.height || newY > currentPipe.height + PIPE_GAP))
      ) {
        setGameOver(true);
      }

      // DRAWING
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Gambar latar belakang warna biru muda
      ctx.fillStyle = 'skyblue';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Gambar kartu welcome di atas background
      ctx.drawImage(welcomeImg, CANVAS_WIDTH / 2 - 154, 30, 308, 212);


      // Draw bird
      ctx.drawImage(ethImg, 50, newY - 25, 60, 60);

      // Draw pipes
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
        ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.height);

        // Bottom pipe
        ctx.fillStyle = gradientBottom;
        ctx.fillRect(pipe.x, pipe.height + PIPE_GAP, PIPE_WIDTH, CANVAS_HEIGHT);
        ctx.strokeRect(pipe.x, pipe.height + PIPE_GAP, PIPE_WIDTH, CANVAS_HEIGHT);
      });

      // Draw score
      ctx.fillStyle = 'white';
      ctx.font = '28px Arial';
      ctx.fillText(`Score: ${score}`, 20, 40);
    }, 20);

    return () => clearInterval(interval);
  }, [birdY, velocity, pipes, gameOver]);

return (
  <div className="relative flex flex-col items-center justify-center min-h-screen bg-blue-300 text-black">
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      onClick={flap}
      className="border-4 border-white rounded shadow-lg"
    />

    {/* POPUP GAME OVER */}
    {gameOver && (
  <div
    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
    style={{
      width: '300px',
      height: '180px',
      backgroundImage: 'url("/game-over.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingBottom: '20px',
      color: 'white',
      textShadow: '1px 1px 2px black',
    }}
  >
    <p className="text-lg font-bold mb-2">Final Score: {score}</p>
    <button
      onClick={flap}
      className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-4 rounded shadow"
    >
      Play Again
    </button>
  </div>
)}
}
