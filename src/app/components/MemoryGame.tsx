"use client";

import { useState, useEffect } from 'react';

// Cards for the memory game with birthday theme
const CARD_IMAGES = [
  '🎂', '🎁', '🎈', '🎉', '🎊', '🍰', '🥳', '💝'
];

export default function MemoryGame() {
  // Create pairs of cards (each image appears twice)
  const [cards, setCards] = useState<Array<{id: number, image: string, flipped: boolean, matched: boolean}>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  
  // Initialize game
  useEffect(() => {
    initGame();
  }, []);
  
  const initGame = () => {
    // Create pairs of cards and shuffle them
    const cardPairs = [...CARD_IMAGES, ...CARD_IMAGES]
      .map((image, index) => ({
        id: index,
        image,
        flipped: false,
        matched: false
      }))
      .sort(() => Math.random() - 0.5);
    
    setCards(cardPairs);
    setFlippedCards([]);
    setMoves(0);
    setGameComplete(false);
  };
  
  const handleCardClick = (id: number) => {
    // Ignore clicks if card is already flipped or matched
    if (
      cards[id].flipped ||
      cards[id].matched ||
      flippedCards.length >= 2
    ) {
      return;
    }
    
    // Flip the card
    const updatedCards = [...cards];
    updatedCards[id].flipped = true;
    setCards(updatedCards);
    
    // Add to flipped cards
    const updatedFlippedCards = [...flippedCards, id];
    setFlippedCards(updatedFlippedCards);
    
    // If two cards are flipped, check for a match
    if (updatedFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const [firstId, secondId] = updatedFlippedCards;
      
      // Check if the cards match
      if (cards[firstId].image === cards[secondId].image) {
        // Mark as matched
        updatedCards[firstId].matched = true;
        updatedCards[secondId].matched = true;
        setCards(updatedCards);
        setFlippedCards([]);
        
        // Check if all cards are matched
        if (updatedCards.every(card => card.matched)) {
          setGameComplete(true);
        }
      } else {
        // If no match, flip them back after a delay
        setTimeout(() => {
          updatedCards[firstId].flipped = false;
          updatedCards[secondId].flipped = false;
          setCards(updatedCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex justify-between w-full">
        <span className="text-lg font-bold text-purple-700">Moves: {moves}</span>
        <button
          className="bg-pink-400 text-white font-bold px-4 py-1 rounded-lg text-sm"
          onClick={initGame}
        >
          New Game
        </button>
      </div>
      
      {/* Game board */}
      <div className="grid grid-cols-4 gap-2 w-full">
        {cards.map(card => (
          <div
            key={card.id}
            className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer text-3xl transition-all duration-300 transform ${
              card.flipped || card.matched
                ? 'bg-yellow-200 rotate-0'
                : 'bg-pink-400 rotate-y-180'
            } ${card.matched ? 'bg-green-200' : ''}`}
            onClick={() => handleCardClick(card.id)}
          >
            {(card.flipped || card.matched) ? card.image : ''}
          </div>
        ))}
      </div>
      
      {/* Game complete message */}
      {gameComplete && (
        <div className="mt-4 p-2 bg-green-100 rounded-lg text-center w-full">
          <p className="text-lg font-bold text-green-700">
            🎉 You won in {moves} moves! 🎉
          </p>
          <button
            className="mt-2 bg-green-500 text-white font-bold px-4 py-1 rounded-lg"
            onClick={initGame}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
