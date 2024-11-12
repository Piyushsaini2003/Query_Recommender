// src/components/LoadingScreen.js

import React, { useState, useEffect } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [fadeOut, setFadeOut] = useState(false);
  const fullText = 'Query Recommendation System';
  const duration = 3000; // Total duration in milliseconds
  const interval = 50;   // Interval between updates in milliseconds

  useEffect(() => {
    let iteration = 0;
    const totalIterations = Math.floor(duration / interval);
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let timer;

    const scramble = () => {
      let scrambledText = '';
      for (let i = 0; i < fullText.length; i++) {
        if (i < (iteration / totalIterations) * fullText.length) {
          scrambledText += fullText[i];
        } else {
          scrambledText += characters.charAt(Math.floor(Math.random() * characters.length));
        }
      }
      setDisplayText(scrambledText);
      iteration++;

      if (iteration >= totalIterations) {
        clearInterval(timer);
        setDisplayText(fullText);
        setFadeOut(true); // Start fade-out effect
        setTimeout(onComplete, 500); // Call onComplete after fade-out
      }
    };

    scramble(); // Call scramble immediately to display initial text
    timer = setInterval(scramble, interval);

    return () => clearInterval(timer);
  }, [fullText, duration, interval, onComplete]);

  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}>
      <h1 className="scramble-text">{displayText}</h1>
      <div className="loading-bar">
        <div className="loading-progress"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
