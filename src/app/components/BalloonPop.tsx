"use client";

import { useState, useEffect, useRef, useMemo } from 'react';

export default function BalloonPop() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [balloons, setBalloons] = useState<Array<{
    id: number, 
    x: number, 
    y: number, 
    size: number, 
    color: string, 
    speedY: number, 
    speedX: number, 
    directionX: number, 
    isCrazy: boolean
  }>>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastBalloonTime = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const colors = useMemo(() => ['#FF69B4', '#FFD700', '#00FFFF', '#FF6347', '#32CD32', '#8A2BE2', '#FF1493', '#FFAC1C'], []);
  const normalEmojis = ['🎈', '🎁', '🎊', '🎉', '🎂', '🍰', '🥳', '🎀'];
  const crazyEmojis = ['👽', '👻', '🤡', '💥', '🚀', '⚡', '🌪️', '🔥', '🤪', '🦄'];
  
  // Initialize audio and track component mounting
  useEffect(() => {
    console.log("BalloonPop component mounted");
    audioRef.current = new Audio('/pop.mp3');
    audioRef.current.volume = 0.3;
    
    // Test audio preload
    try {
      audioRef.current.load();
    } catch (e) {
      console.log("Audio preload error:", e);
    }
    
    return () => {
      console.log("BalloonPop component unmounted");
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      // Clean up any timers or animations
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Start game with improved timer handling
  const startGame = () => {
    console.log("Starting game...");
    
    // Clear any existing timers and animations
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    // Reset game state
    setScore(0);
    setTimeLeft(30);
    setBalloons([]);
    
    // Small delay to ensure the timer is reset before starting
    setTimeout(() => {
      setIsPlaying(true);
      lastBalloonTime.current = Date.now();
      
      // Create initial balloons
      if (gameAreaRef.current) {
        const areaWidth = gameAreaRef.current.clientWidth;
        const areaHeight = gameAreaRef.current.clientHeight;
        console.log(`Game area dimensions: ${areaWidth}x${areaHeight}`);
        
        // Add 5 initial balloons at different positions
        const initialBalloons = Array.from({ length: 5 }, (_, i) => {
          const size = Math.random() * 20 + 40;
          const isCrazy = Math.random() < 0.2; // 20% chance for crazy emoji
          return {
            id: Date.now() + i + Math.random(),
            x: (i * (areaWidth / 5)) + Math.random() * 20, // Distribute across width
            y: areaHeight - (Math.random() * 100), // Stagger heights
            size: size,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: Math.random() * 3 + 3, // Faster vertical speed
            speedX: Math.random() * 6 - 3, // Wider horizontal range (-3 to 3)
            directionX: Math.random() > 0.5 ? 1 : -1, // Random initial direction
            isCrazy // Flag to determine if it's a crazy emoji
          };
        });
        
        console.log(`Created ${initialBalloons.length} initial balloons`);
        setBalloons(initialBalloons);
      } else {
        console.error("Game area ref not available!");
      }
      
      // Start the timer with a precise interval
      const startTime = Date.now();
      const gameTimer = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        const newTimeLeft = Math.max(0, 30 - elapsedSeconds);
        
        setTimeLeft(newTimeLeft);
        
        if (newTimeLeft <= 0) {
          // Game over
          clearInterval(gameTimer);
          setIsPlaying(false);
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
          }
        }
      }, 100); // Check frequently for accurate timing
      
      timerIntervalRef.current = gameTimer;
      
      // Start the animation loop
      console.log("Starting animation loop...");
      // Use both requestAnimationFrame and a backup interval for safety
      animationRef.current = requestAnimationFrame(animateAllBalloons);
      
      // Safety backup animation in case requestAnimationFrame doesn't work
      const animationBackupInterval = setInterval(() => {
        if (isPlaying && (!animationRef.current || Date.now() - lastBalloonTime.current > 2000)) {
          console.log("Animation backup triggered");
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }
          animationRef.current = requestAnimationFrame(animateAllBalloons);
        }
      }, 1000);
      
      // Cleanup function to clear the backup interval
      const intervalCleanupTimeout = setTimeout(() => {
        clearInterval(animationBackupInterval);
      }, 30000); // Clean up after 30 seconds
      
      return () => {
        clearInterval(animationBackupInterval);
        clearTimeout(intervalCleanupTimeout);
      };
    }, 50);
  };
  
  // Animation function for balloon movement
  const animateAllBalloons = () => {
    if (!isPlaying) return;
    
    const now = Date.now();
    const speedMultiplier = timeLeft < 10 ? 3 - (timeLeft / 10) : 1; // Speed increases as time decreases
    const balloonInterval = Math.max(100, 600 - (30 - timeLeft) * 20); // Gradually decrease spawn interval
    
    // Log animation frame to debug movement issues
    if (balloons.length > 0 && Math.random() < 0.05) { // Only log occasionally
      console.log(`Animating ${balloons.length} balloons with multiplier ${speedMultiplier.toFixed(2)}`);
    }
    
    // Create new balloons periodically
    if (now - lastBalloonTime.current > balloonInterval) {
      lastBalloonTime.current = now;
      
      if (gameAreaRef.current) {
        const areaWidth = gameAreaRef.current.clientWidth;
        const areaHeight = gameAreaRef.current.clientHeight;
        
        // 30% chance for crazy emoji when less than 15 seconds remain
        const isCrazy = timeLeft < 15 ? Math.random() < 0.3 : Math.random() < 0.1;
        
        // Create a new balloon with proper positioning
        const size = Math.random() * 20 + 40;
        const newBalloon = {
          id: now + Math.random(), // Ensure unique IDs
          x: Math.random() * (areaWidth - size), // Account for balloon size
          y: areaHeight + size, // Start slightly below the bottom for smoother entry
          size: size,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedY: (Math.random() * 3 + 3) * speedMultiplier, // Faster vertical speed
          speedX: (Math.random() * 6 - 3) * speedMultiplier, // Wider horizontal range (-3 to 3)
          directionX: Math.random() > 0.5 ? 1 : -1, // Random initial direction
          isCrazy // Flag for crazy emoji
        };
        
        // Add the new balloon to state using a callback to ensure we're working with latest state
        setBalloons(prevBalloons => [...prevBalloons, newBalloon]);
      }
    }
    
    // Move all balloons and remove ones that are off-screen
    setBalloons(prevBalloons => {
      // Make sure we have balloons to update
      if (prevBalloons.length === 0) return prevBalloons;
      
      return prevBalloons
        .map(balloon => {
          // Calculate new position with some randomness for natural movement
          const wobble = balloon.isCrazy ? (Math.random() * 2 - 1) : (Math.random() * 0.6 - 0.3);
          let newX = balloon.x + (balloon.speedX * balloon.directionX) + wobble;
          let newY = balloon.y - balloon.speedY;
          let newDirectionX = balloon.directionX;
          let newSpeedX = balloon.speedX;
          let newSpeedY = balloon.speedY;
          
          // Check boundaries for X direction and bounce
          if (gameAreaRef.current) {
            const maxX = gameAreaRef.current.clientWidth - balloon.size;
            if (newX <= 0 || newX >= maxX) {
              newDirectionX *= -1; // Reverse direction when hitting boundary
              newX = Math.max(0, Math.min(newX, maxX)); // Ensure within bounds
              
              // Add a little random vertical "bounce" when hitting walls
              if (balloon.isCrazy) {
                // Crazy emojis have more dramatic bounces
                newY += (Math.random() * 30) - 15;
                // Sometimes speed up crazy emojis after bouncing
                if (Math.random() > 0.3) {
                  newSpeedX *= 1.3;
                  newSpeedY *= 1.1;
                }
              } else {
                // Normal emojis have subtle bounces
                newY += (Math.random() * 15) - 7.5;
              }
            }
          }
          
          // Add some random movement for crazy emojis
          if (balloon.isCrazy) {
            // More random movement for crazy emojis
            if (Math.random() > 0.9) {
              // Occasionally change direction
              newDirectionX *= -1;
            }
            // Random speed adjustments
            newSpeedX += (Math.random() * 0.8) - 0.4;
            newSpeedY += (Math.random() * 0.4) - 0.1; // More upward tendency
          }
          
          return {
            ...balloon,
            x: newX,
            y: newY,
            directionX: newDirectionX,
            speedX: Math.min(Math.max(newSpeedX, 1), 8), // Clamp speed between 1 and 8
            speedY: Math.min(Math.max(newSpeedY, 1), 8) // Clamp speed between 1 and 8
          };
        })
        .filter(balloon => balloon.y > -balloon.size); // Remove balloons that have gone off screen
    });
    
    // Always continue the animation loop if playing, even if there are no balloons
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animateAllBalloons);
    }
  };
  
  // Pop a balloon
  const popBalloon = (id: number) => {
    try {
      // Use the preloaded audio element
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        const playPromise = audioRef.current.play();
        
        // Handle promise to avoid uncaught errors
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.log("Audio playback prevented by browser:", e);
          });
        }
      }
    } catch (e) {
      console.log("Error with audio:", e);
    }
    
    // Check if it's a crazy balloon (worth 3 points)
    const poppedBalloon = balloons.find(balloon => balloon.id === id);
    const pointValue = poppedBalloon?.isCrazy ? 3 : 1;
    
    // Remove the balloon and add to score
    setBalloons(prev => prev.filter(balloon => balloon.id !== id));
    setScore(prev => prev + pointValue);
  };
  
  // Ensure balloons are created if there are none
  useEffect(() => {
    if (isPlaying && balloons.length === 0) {
      // No balloons visible, create emergency ones
      if (gameAreaRef.current) {
        const areaWidth = gameAreaRef.current.clientWidth;
        const areaHeight = gameAreaRef.current.clientHeight;
        
        // Speed multiplier increases as time decreases
        const speedMultiplier = timeLeft < 10 ? 3 - (timeLeft / 10) : 1;
        
        // 30% chance for crazy emoji when less than 15 seconds remain
        const isCrazy = timeLeft < 15 ? Math.random() < 0.3 : Math.random() < 0.1;
        
        // Add a new emergency balloon
        const size = Math.random() * 20 + 40;
        const newBalloon = {
          id: Date.now() + Math.random(),
          x: Math.random() * (areaWidth - size),
          y: areaHeight + size,
          size: size,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedY: (Math.random() * 3 + 3) * speedMultiplier,
          speedX: (Math.random() * 6 - 3) * speedMultiplier,
          directionX: Math.random() > 0.5 ? 1 : -1,
          isCrazy
        };
        
        setBalloons([newBalloon]);
      }
    }
  }, [isPlaying, balloons.length, timeLeft, colors]);
  
  // Cleanup on unmount or when game ends
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Render balloon content - either an emoji or a colored balloon
  const renderBalloonContent = (balloon: {id: number, color: string, size: number, isCrazy: boolean}) => {
    let emoji;
    if (balloon.isCrazy) {
      // Use a crazy emoji
      const crazyIndex = Math.floor(balloon.id % crazyEmojis.length);
      emoji = crazyEmojis[crazyIndex];
    } else {
      // Use a normal emoji
      const normalIndex = Math.floor(balloon.id % normalEmojis.length);
      emoji = normalEmojis[normalIndex];
    }
    
    return (
      <div className="flex items-center justify-center w-full h-full">
        <span className="select-none" style={{ 
          fontSize: `${balloon.size * 0.8}px`,
          display: 'inline-block',  // Ensure the emoji is properly displayed
          lineHeight: '1',  // Prevent line height from affecting positioning
          transform: balloon.isCrazy ? 'scale(1.2)' : 'scale(1)',  // Make crazy emojis slightly larger
          transition: 'transform 0.3s ease'  // Smooth scaling
        }}>{emoji}</span>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col items-center w-full">
      {/* Game info */}
      <div className="flex justify-between w-full mb-2">
        <div className="text-lg font-bold text-purple-700">Score: {score}</div>
        <div className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-pink-600'}`}>Time: {timeLeft}s</div>
        {!isPlaying && (
          <button 
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-1 px-4 rounded-full shadow-lg transform transition-transform hover:scale-105"
            onClick={startGame}
          >
            {score > 0 ? 'Play Again' : 'Start Game'}
          </button>
        )}
      </div>
      
      {/* Game area */}
      <div 
        ref={gameAreaRef} 
        className="relative w-full h-[300px] bg-gradient-to-b from-blue-100/50 to-pink-100/50 rounded-lg overflow-hidden border-2 border-pink-300"
        style={{ touchAction: 'none' }} // Prevent scrolling on mobile when interacting with game
      >
        {balloons.map(balloon => (
          <div
            key={balloon.id}
            className={`absolute cursor-pointer transition-transform ${balloon.isCrazy ? 'animate-pulse hover:scale-125' : 'hover:scale-110'}`}
            style={{
              left: `${balloon.x}px`,
              top: `${balloon.y}px`,
              width: `${balloon.size}px`,
              height: `${balloon.size}px`,
              zIndex: balloon.isCrazy ? '20' : '10', // Crazy emojis appear on top
              filter: balloon.isCrazy ? 'drop-shadow(0 0 8px rgba(255,0,0,0.5))' : 'drop-shadow(0 0 3px rgba(0,0,0,0.2))',
              transform: `rotate(${Math.sin(balloon.id * 0.1) * 25}deg)`, // Different rotation for each balloon
            }}
            onClick={() => popBalloon(balloon.id)}
          >
            {renderBalloonContent(balloon)}
          </div>
        ))}
        
        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-purple-100/80 backdrop-blur-sm">
            {score > 0 ? (
              <>
                <h3 className="text-2xl font-bold text-pink-600 mb-2">Game Over!</h3>
                <p className="text-xl font-bold text-purple-700 mb-4">You popped {score} balloons!</p>
              </>
            ) : (
              <h3 className="text-2xl font-bold text-pink-600 mb-4">Pop the Balloons!</h3>
            )}
            <button 
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transform transition-transform hover:scale-105"
              onClick={startGame}
            >
              {score > 0 ? 'Play Again' : 'Start Game'}
            </button>
          </div>
        )}
      </div>
      
      {/* Instructions */}
      {!isPlaying && (
        <p className="mt-4 text-sm text-center text-gray-600">
          Click or tap the balloons as they bounce and spin around! 
          <br/>
          <span className="text-purple-600 font-semibold">Crazy emojis</span> are worth 3 points and move faster with wild patterns!
          <br/>
          The game gets more challenging and faster as time runs out!
        </p>
      )}
    </div>
  );
}
