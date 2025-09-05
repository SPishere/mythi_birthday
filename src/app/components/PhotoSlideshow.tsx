"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function PhotoSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Add all your photo filenames here
  const photos = [
    "/images/62ad1004-69b3-4682-84dd-87d786537c2c.jpg",
    "/images/BeautyPlus_20210313222735766_save.jpg",
    "/images/BeautyPlus_20210904103958351_save.jpg",
    "/images/IMG_20200816_190624.jpg",
    "/images/IMG_5269.jpg",
    "/images/WhatsApp Image 2025-07-26 at 13.33.38.jpeg",
    "/images/WhatsApp Image 2025-07-26 at 13.36.40.jpeg"
  ];
  
  // Auto-advance slides every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === photos.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    
    return () => clearInterval(interval);
  }, [photos.length]);
  
  // Manual navigation
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };
  
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">Photo Memories with Mythi</h2>
      
      <div className="relative h-[400px] w-full rounded-xl overflow-hidden shadow-2xl">
        {/* Current slide */}
        <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
          <Image 
            src={photos[currentIndex]} 
            alt={`Mythi photo ${currentIndex + 1}`} 
            fill 
            className="object-cover"
            priority
          />
        </div>
        
        {/* Navigation arrows */}
        <button 
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 p-2 rounded-full text-2xl z-10"
          onClick={goToPrevious}
          aria-label="Previous photo"
        >
          ←
        </button>
        <button 
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 p-2 rounded-full text-2xl z-10"
          onClick={goToNext}
          aria-label="Next photo"
        >
          →
        </button>
        
        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3 text-center">
          Photo {currentIndex + 1} of {photos.length}
        </div>
      </div>
      
      {/* Thumbnail navigation */}
      <div className="flex justify-center mt-4 space-x-2">
        {photos.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? 'bg-pink-500' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to photo ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
