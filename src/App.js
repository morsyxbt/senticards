import React, { useState, useEffect } from 'react';
import './App.css';

// Dynamically use all images in public/cards (user imported 11 images)
const CARD_IMAGES = [
  '/cards/cards1.jpg',
  '/cards/cards2.jpg',
  '/cards/cards3.jpg',
  '/cards/cards4.jpg',
  '/cards/cards5.jpg',
  '/cards/cards6.jpg',
  '/cards/cards7.jpg',
  '/cards/cards8.jpg',
  '/cards/cards9.jpg',
  '/cards/cards10.jpg',
  '/cards/cards11.jpg',
];

function shuffle(array) {
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const getCardsForLevel = (level) => {
  const pairs = 3 + (level - 1); // 3 pairs in level 1, increase each level
  let images = shuffle(CARD_IMAGES).slice(0, pairs); // Select random images for pairs
  // Ensure each image appears exactly twice
  const deck = [];
  images.forEach(img => {
    deck.push({ img });
    deck.push({ img });
  });
  // Assign unique ids and shuffle
  const shuffled = shuffle(deck).map((card, idx) => ({
    id: idx,
    img: card.img,
    flipped: false,
    matched: false,
  }));
  return shuffled;
};

import StartScreen from './StartScreen';

function App() {
  const [showEnd, setShowEnd] = useState(false);
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState(getCardsForLevel(1));
  const [flipped, setFlipped] = useState([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [showStart, setShowStart] = useState(true);

  let maxMoves = 12;
if (level === 2) maxMoves = 15;
else if (level === 3) maxMoves = 18;
else if (level === 4) maxMoves = 21;
else if (level === 5) maxMoves = 23;

  useEffect(() => {
    if (!gameOver && matchedCount < cards.length / 2) {
      const id = setInterval(() => setTimer((t) => t + 1), 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    }
  }, [gameOver, matchedCount, cards.length]);

  const LAST_LEVEL = 5; // Set your intended last level here

useEffect(() => {
    if (matchedCount === cards.length / 2 && !gameOver) {
      setTimeout(() => {
        if (level === LAST_LEVEL) {
          setGameOver(true);
          setShowEnd(true);
        } else {
          setLevel((l) => l + 1);
          resetGame(level + 1);
        }
      }, 1300);
    }
    // eslint-disable-next-line
  }, [matchedCount]);

  useEffect(() => {
    // If out of moves and not already gameOver
    if ((moves >= maxMoves) && !gameOver && matchedCount < cards.length / 2) {
      // If only one pair left to match and two cards are flipped, let the match logic (below) decide
      if (matchedCount === cards.length / 2 - 1 && flipped.length === 2) {
        // Let handleCardClick finish the pair
      } else {
        setGameOver(true);
        if (intervalId) clearInterval(intervalId);
      }
    }
    // eslint-disable-next-line
  }, [moves, gameOver, matchedCount, cards.length, intervalId, flipped.length]);

  const resetGame = (nextLevel = level) => {
    setCards(getCardsForLevel(nextLevel));
    setFlipped([]);
    setMatchedCount(0);
    setMoves(0);
    setTimer(0);
    setGameOver(false);
    if (nextLevel === 1) setScore(0); // reset score if restarting from level 1
  };

  const tickSound = new Audio('/tick.mp3');
const handleCardClick = (idx) => {
    if (flipped.length === 2 || cards[idx].flipped || cards[idx].matched || gameOver) return;
    tickSound.currentTime = 0; tickSound.play();
    const newFlipped = [...flipped, idx];
    const newCards = cards.map((card, i) =>
      i === idx ? { ...card, flipped: true } : card
    );
    setCards(newCards);
    setFlipped(newFlipped);
    setMoves((m) => m + 1); // 1 click = 1 move
    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      const isMatch = newCards[first].img === newCards[second].img;
      // If this is the last pair and moves are at max, allow win if match, else fail
      if (moves + 1 >= maxMoves && matchedCount === cards.length / 2 - 1) {
        if (isMatch) {
          setTimeout(() => {
            setCards((cards) =>
              cards.map((card, i) =>
                i === first || i === second ? { ...card, matched: true } : card
              )
            );
            setMatchedCount((c) => c + 1);
            setScore((s) => s + 2);
            setFlipped([]);
          }, 700);
        } else {
          setTimeout(() => {
            setCards((cards) =>
              cards.map((card, i) =>
                i === first || i === second ? { ...card, flipped: false } : card
              )
            );
            setFlipped([]);
            setGameOver(true);
          }, 900);
        }
      } else {
        if (isMatch) {
          setTimeout(() => {
            setCards((cards) =>
              cards.map((card, i) =>
                i === first || i === second ? { ...card, matched: true } : card
              )
            );
            setMatchedCount((c) => c + 1);
            setScore((s) => s + 2);
            setFlipped([]);
          }, 700);
        } else {
          setTimeout(() => {
            setCards((cards) =>
              cards.map((card, i) =>
                i === first || i === second ? { ...card, flipped: false } : card
              )
            );
            setFlipped([]);
          }, 900);
        }
      }
    }
  };

  if (showStart) {
    return <StartScreen onStart={() => setShowStart(false)} />;
  }
  return (
  <>
    <div className="app-container">
      <h1 className="glow-title">Sentient Cards</h1>
      <h2 style={{color:'#38BDF8'}}>Level {level}</h2>
      <div className="stats">
  <span>Moves Left: {maxMoves - moves}</span>
  <span>Time: {timer}s</span>
  <span className="scoreboard" style={{
    marginLeft: '1.2rem',
    background: 'linear-gradient(135deg, #23272F 60%, #181A20 100%)',
    color: '#FFD600', // yellow like timer
    borderRadius: '12px',
    padding: '0.45rem 1.4rem',
    fontWeight: 700,
    fontSize: '1.1rem',
    boxShadow: '0 2px 10px rgba(67,233,123,0.13)',
    letterSpacing: '0.04em',
    fontFamily: 'Segoe UI, Arial, sans-serif',
    display: 'inline-block',
    minWidth: 80,
    textAlign: 'center',
  }}>Score: {score}</span>
</div>
      <div className="cards-grid" style={{ gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(cards.length))}, 1fr)` }}>
        {cards.map((card, idx) => (
          <div
            key={card.id}
            className={`card ${card.flipped || card.matched ? 'flipped' : ''}`}
            onClick={() => handleCardClick(idx)}
          >
            <div className="card-inner">
              <div className="card-front">
  <img src={'/cards/senti.jpg'} alt="back" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px'}} />
</div>
              <div className="card-back">
                <img src={card.img} alt="card" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {matchedCount === cards.length / 2 && !showEnd && (
        <div className="game-over">
          <h3 style={{
            fontWeight: 800,
            color: '#fff',
            fontSize: '2rem',
            letterSpacing: '0.04em',
            textShadow: '0 2px 12px rgba(67,233,123,0.13)',
            margin: '1.5rem 0 0.5rem 0',
            fontFamily: 'Segoe UI, Arial, sans-serif',
          }}>
            completed - new level unlocked
          </h3>
        </div>
      )}
      {gameOver && showEnd && (
        <div className="fail-popup">
          {level === 5 ? (
  <h3 style={{fontWeight: 800, color: '#fff', fontSize: '2rem'}}>Game finished - nice played</h3>
) : (
  <h3 style={{fontWeight: 800, color: '#222', fontSize: '2rem'}}>Game Has Ended<br/>Thank you!</h3>
)}
          <button className="restart-btn" onClick={() => { setShowEnd(false); resetGame(1); setLevel(1); setGameOver(false); }}>
            Play Again
          </button>
        </div>
      )}
      {gameOver && !showEnd && (
  <div className="fail-popup premium-fail animate-fade-in">
    <div className="fail-popup-content">
      <img src="/cards/fail.jpg" alt="fail" />
      <h3 style={{fontWeight: 800, color: '#FFD600', fontSize: '2rem', marginBottom: 8}}>
        Level Failed!
      </h3>
      <p style={{color: '#FFD600', fontWeight: 500, marginBottom: 16, fontSize: '1.1rem'}}>Don't give up! Try again for a better score!</p>
      <div style={{display: 'flex', gap: '1.2rem', justifyContent: 'center'}}>
        <button className="restart-btn outline" onClick={() => resetGame(level)}>
          Restart Level
        </button>
        <button className="restart-btn outline" onClick={() => resetGame(1)}>
          Restart from Level 1
        </button>
      </div>
    </div>
  </div>
)}
    <footer>
      <span style={{color: '#fff', opacity: 0.7}}>Made with <span role="img" aria-label="heart">❤️</span> by </span>
      <a className="footer-author" href="https://x.com/morsyxbt" target="_blank" rel="noopener noreferrer">Morsy</a>
      <span style={{color: '#fff', opacity: 0.7}}>for</span>
      <a className="footer-brand" href="https://x.com/SentientAGI" target="_blank" rel="noopener noreferrer">Sentient</a>
    </footer>
    </div>
  </>);

}

export default App;
