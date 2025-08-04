import React from 'react';
import './App.css';

export default function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <div className="start-content modern">
        <h1 className="glow-title">Sentient Cards</h1>
        <h2 className="subtitle">Ready to Start?</h2>
        
        <div className="start-btn-row">
          <button className="start-btn gradient" onClick={onStart}>Start Game</button>
          {/* Optionally, add a second button for info/rules modal */}
          {/* <button className="info-btn gradient-outline" onClick={...}>How to Play</button> */}
        </div>
        <div className="info-row">
  <div><span className="info-num level-badge-11">11+</span><br/>Cards</div>
  <div><span className="info-num level-badge-5">5</span><br/>Levels</div>
  <div><span className="info-num text-247">24/7</span><br/>Available</div>
</div>
        <div className="rules-quick">
          <b>• All cards feature original artwork by Sentient artists<br/>• Each piece represents the creativity of our AGI network<br/>• By playing you acknowledge and respect the artistic rights of Sentient contributors</b>
        </div>
      </div>
      <footer className="start-footer">
        Made with <span style={{color:'#e25555', fontSize:'1.1em'}}>❤️</span> by <a className="footer-author" href="https://x.com/morsyxbt" target="_blank" rel="noopener noreferrer">Morsy</a> for <a className="footer-brand" href="https://x.com/SentientAGI" target="_blank" rel="noopener noreferrer">Sentient</a>
      </footer>
    </div>
  );
}

