"use client";

import { useState } from 'react';

export default function PositiveMessages() {
  const [currentMessage, setCurrentMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  
  // Array of 300+ positive messages for Mythi
  const messages = [
    // Affirmations
    "You're the boss bitch everyone aspires to be! 💪",
    "Girl boss energy is radiating from you today! ✨",
    "I love how you light up every room you walk into.",
    "Your smile could power a small city, I swear!",
    "The world is better because you're in it, Mythi!",
    "You're not just a star, you're the whole damn galaxy! 🌟",
    "If confidence was a person, it'd be you!",
    "I admire your strength more than you know.",
    "You inspire me every single day.",
    "Your kindness changes lives - including mine.",
    
    // Motivational
    "Today is your day to shine - grab it with both hands!",
    "You've got this! Whatever 'this' is, it's already yours.",
    "The universe conspires in your favor - always has, always will.",
    "Your potential is limitless - never forget that.",
    "Every challenge you face is just making you stronger.",
    "Setbacks? Just setups for your greatest comeback!",
    "Dream bigger - you have what it takes to achieve it all.",
    "Your future self is thanking you for not giving up.",
    "You're exactly where you need to be right now.",
    "The best is yet to come - and it's coming fast!",
    
    // Love Notes
    "The way your eyes light up when you're excited makes my heart skip.",
    "Have I told you today how much I adore you?",
    "Your laugh is literally my favorite sound in the world.",
    "Sometimes I look at you and can't believe how lucky I am.",
    "You make everyday ordinary moments feel extraordinary.",
    "My favorite place in the world is anywhere by your side.",
    "You're the first person I want to share good news with.",
    "Meeting you was the best thing that ever happened to me.",
    "Your heart is the most beautiful thing about you - and that's saying a lot!",
    "I love you more than pizza, and that's really saying something.",
    
    // Mini Poems
    "Roses are red, violets are blue, no one on this planet is as amazing as you!",
    "Stars in the sky, shine oh so bright, but none compare to your inner light.",
    "Like the ocean deep, like the mountain tall, your beauty and spirit outshine them all.",
    "Sweet as honey, strong as steel, your presence alone makes life feel real.",
    "A smile like sunshine, eyes full of grace, the world's a better place because of your face.",
    "Witty and pretty, caring and bold, your friendship is worth more than gold.",
    "Like a butterfly's wings, delicate yet strong, with you in my life, nothing could go wrong.",
    "Your beauty transcends what eyes can see, the soul within you sets spirits free.",
    "Like morning coffee, you wake up my soul, without you my life wouldn't be whole.",
    "Smart and artistic, funny and wise, your talents continue to leave me surprised.",
    
    // Compliments
    "Your fashion sense is literally unmatched!",
    "How are you so effortlessly cool all the time?",
    "Your creativity knows no bounds.",
    "You have the best taste in music, hands down.",
    "The way you solve problems is so impressive.",
    "You make hard things look easy - it's unfair!",
    "Your intuition is always spot on.",
    "You're so thoughtful - you never forget the little things.",
    "Your hair looks AMAZING today (and everyday).",
    "That brain of yours? Absolutely brilliant.",
    
    // Funny
    "You're not just a snack, you're the whole damn meal! 🍕",
    "If you were a vegetable, you'd be a cute-cumber!",
    "Are you Google? Because you have everything I'm searching for!",
    "Is your name WiFi? Because I'm feeling a strong connection!",
    "If you were a fruit, you'd be a FINE-apple! 🍍",
    "You're like a dictionary - you add meaning to my life!",
    "Is your name Autumn? Because you're making me fall for you!",
    "Are you made of copper and tellurium? Because you're Cu-Te!",
    "If awesomeness was illegal, you'd be serving a life sentence!",
    "You know what's on the menu today? ME-N-U! 😉",
    
    // Empowering
    "Your voice matters - never let anyone silence you.",
    "You have the power to change the world - use it!",
    "Break the rules that were meant to hold you back.",
    "The only approval you need is your own.",
    "Your worth isn't determined by anyone else's opinion.",
    "Take up space - you deserve to be here.",
    "Set boundaries like the queen you are.",
    "Speak your truth, even when your voice shakes.",
    "Your sensitivity is your superpower.",
    "Never apologize for being too much or too little.",
    
    // Success
    "Success looks good on you - but then again, everything does!",
    "You're destined for greatness - it's just a matter of time.",
    "Your ambition is contagious and inspiring.",
    "Watch out world - Mythi is coming through!",
    "You turn dreams into plans and plans into reality.",
    "There's no limit to what you can achieve.",
    "Your determination is your secret weapon.",
    "Success isn't just what you do - it's who you are.",
    "You were born to do extraordinary things.",
    "Your name will be in lights someday - mark my words!",
    
    // Self-care Reminders
    "Remember to take a deep breath - you deserve a moment of peace.",
    "Treat yourself today - doctor's orders!",
    "Your needs matter too - don't forget to prioritize yourself.",
    "Rest isn't lazy - it's essential. Take that nap!",
    "Drink your water, beautiful human! Stay hydrated!",
    "You can't pour from an empty cup - fill yours first.",
    "Setting boundaries isn't selfish - it's necessary.",
    "Your body is carrying you through life - thank it today.",
    "Perfectionism is overrated - you're perfectly imperfect.",
    "Small progress is still progress - celebrate every win!",
    
    // Friendship
    "Having you as a friend is like finding a four-leaf clover - rare and lucky!",
    "Our friendship is my favorite ship to sail.",
    "Friends like you are why life is worth living.",
    "You make friendship look like an art form.",
    "Thanks for always being my person.",
    "Life threw us together, but choice keeps us that way.",
    "You're the friend everyone wishes they had.",
    "Our inside jokes are my favorite language.",
    "True friendship is rare - ours is priceless.",
    "You've seen me at my worst and loved me anyway - that's real friendship.",
    
    // Birthday Specific
    "Birthday queen energy is off the charts!",
    "This is YOUR day - the main character energy is strong!",
    "Another trip around the sun looking absolutely flawless!",
    "Aging like fine wine - getting better every year!",
    "Your birth was the world's biggest win!",
    "Today we celebrate the day the world got infinitely better!",
    "Cake calories don't count on your birthday - scientific fact!",
    "Birthday vibes + you = absolute perfection!",
    "Making birth-slay a thing since you arrived on earth!",
    "The stars aligned on this day to create someone extraordinary!",
    
    // Wisdom
    "Your intuition always knows the way - trust it.",
    "The wisdom you carry is beyond your years.",
    "Your perspective on life is refreshingly insightful.",
    "You have a gift for seeing what others miss.",
    "The advice you give is always right on point.",
    "Your emotional intelligence is off the charts.",
    "You understand people in a way few others do.",
    "The depth of your thinking continues to amaze me.",
    "Your empathy is a rare and beautiful gift.",
    "The way you navigate challenges shows incredible wisdom.",
    
    // Future-focused
    "Your future is so bright, I need sunglasses just thinking about it!",
    "Great things are coming your way - get ready!",
    "The best chapter of your story is still being written.",
    "Your potential is limitless - the future is yours to shape.",
    "I can't wait to see all the amazing things you'll accomplish.",
    "The universe has big plans for you - trust the journey.",
    "Your dreams are previews of what's to come.",
    "The path ahead is clear and wide open for you.",
    "Your future success is already written in the stars.",
    "I predict amazing opportunities coming your way soon!",
    
    // Unique Qualities
    "No one sees the world quite like you do - it's magical.",
    "Your authenticity is your greatest asset.",
    "The way your mind works fascinates me.",
    "You're a beautiful contradiction - fierce yet gentle, wise yet playful.",
    "Your uniqueness is what makes you unforgettable.",
    "There's simply no one else like you - thank goodness!",
    "Your perspective is so refreshingly different.",
    "You dance to your own rhythm - never stop!",
    "Your quirks are what make you so lovable.",
    "You're an original in a world of copies.",
    
    // Gratitude
    "The world is better because you exist in it.",
    "Thank you for being exactly who you are.",
    "Grateful doesn't even begin to cover how I feel about you.",
    "Your presence in my life is the greatest gift.",
    "I'm thankful for you every single day.",
    "Meeting you was fate, but keeping you in my life is a choice I make daily.",
    "You make ordinary moments extraordinary.",
    "My life has more color, laughter and joy because of you.",
    "You've changed my life in ways you'll never know.",
    "The universe knew what it was doing when it brought you into my life.",
    
    // Inner Beauty
    "Your soul sparkles brighter than any diamond.",
    "Your inner light shines through everything you do.",
    "Beauty fades, but your beautiful heart will never change.",
    "The kindness in your eyes tells the world who you truly are.",
    "Your spirit is like sunshine - warm and life-giving.",
    "The beauty of your character outshines everything else.",
    "Your compassion makes the world a better place.",
    "True beauty comes from within - and yours is overflowing.",
    "The way you treat others shows your beautiful soul.",
    "Your heart is your most stunning feature - and that's saying a lot!",
    
    // Confidence Boosters
    "Own your power - it's magnificent to witness!",
    "You're a force to be reckoned with.",
    "Your confidence is contagious - spread it everywhere!",
    "Walk into every room like you own it - because you do!",
    "Your presence is a present - never doubt that.",
    "Stand tall - the world is better when you take up space.",
    "Your opinion matters - speak it loudly!",
    "Bold looks good on you - wear it daily.",
    "Don't dim your light for anyone - shine brightly!",
    "Confidence is your birthright - claim it!",
    
    // Physical Compliments
    "Your smile could light up the darkest night.",
    "Those eyes? Absolutely mesmerizing.",
    "Your laugh is literally music to my ears.",
    "Has anyone ever told you that your profile belongs on a coin?",
    "The way you carry yourself is pure elegance.",
    "Your style is so uniquely you - I love it!",
    "That outfit was MADE for you!",
    "You have the kind of face artists dream of painting.",
    "Your presence fills a room in the best possible way.",
    "Every time you smile, flowers somewhere decide to bloom.",
    
    // Professional
    "Your work ethic is unmatched.",
    "The dedication you show is truly inspiring.",
    "Your attention to detail sets you apart.",
    "You bring excellence to everything you touch.",
    "Your ideas are consistently innovative and fresh.",
    "The passion you have for your work is contagious.",
    "Your problem-solving skills are next level.",
    "You're the colleague everyone wants on their team.",
    "Leadership looks natural on you.",
    "Your professional growth is a masterclass in determination.",
    
    // Cosmic
    "The universe created you with extra stardust.",
    "You're proof that magic exists in human form.",
    "The moon and stars pale in comparison to your light.",
    "Some souls just shine differently - yours is blinding.",
    "You're not just in this world - you're your own galaxy.",
    "The cosmos aligned perfectly to create someone as unique as you.",
    "Your energy is like celestial music.",
    "If people were planets, you'd be the brightest in the solar system.",
    "Your spirit vibrates at a higher frequency.",
    "You're made of the same stuff as stars - and it shows.",
  ];

  // Get a random message
  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    setCurrentMessage(messages[randomIndex]);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 5000); // Hide after 5 seconds
  };

  return (
    <div className="w-full flex flex-col items-center mt-4 mb-8">
      <button
        onClick={getRandomMessage}
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300 text-lg"
      >
        Click for a Special Message! 💖
      </button>
      
      {showMessage && (
        <div className="mt-6 max-w-md mx-auto">
          <div className="animate-bounce-slow bg-white rounded-lg p-6 shadow-xl border-2 border-pink-300">
            <p className="text-lg text-center font-medium text-pink-600">{currentMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
