import React, { useState, useEffect } from 'react';
import './ServerWakeup.css';

const messages = [
  { text: "Waking up the server...", sub: "Our server is on a free tier and sleeps after inactivity" },
  { text: "Almost there...", sub: "Establishing connection to the kitchen" },
  { text: "Warming up the ovens...", sub: "This usually takes 30-50 seconds" },
  { text: "Just a moment more...", sub: "Setting up your experience" },
];

const ServerWakeup = ({ onDismiss }) => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [dots, setDots] = useState('');
  const [elapsed, setElapsed] = useState(0);

  // Cycle through messages every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Track elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="server-wakeup-overlay">
      <div className="server-wakeup-card">
        {/* Animated server icon */}
        <div className="wakeup-icon-container">
          <div className="wakeup-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
              <line x1="6" y1="6" x2="6.01" y2="6" />
              <line x1="6" y1="18" x2="6.01" y2="18" />
            </svg>
          </div>
          <div className="wakeup-pulse"></div>
          <div className="wakeup-pulse wakeup-pulse-delayed"></div>
        </div>

        {/* Text content */}
        <div className="wakeup-text">
          <h2 className="wakeup-title">
            {messages[msgIndex].text}<span className="wakeup-dots">{dots}</span>
          </h2>
          <p className="wakeup-subtitle">{messages[msgIndex].sub}</p>
        </div>

        {/* Progress bar */}
        <div className="wakeup-progress-track">
          <div className="wakeup-progress-bar"></div>
        </div>

        {/* Elapsed time */}
        <div className="wakeup-elapsed">
          <span className="wakeup-timer-icon">⏱</span>
          <span>Waiting for {formatTime(elapsed)}</span>
        </div>

        {/* Tip */}
        <p className="wakeup-tip">
          💡 Tip: The server auto-sleeps after 15 min of inactivity. First load may take up to a minute.
        </p>
      </div>

      {/* Background decoration */}
      <div className="wakeup-bg-glow glow-1"></div>
      <div className="wakeup-bg-glow glow-2"></div>
    </div>
  );
};

export default ServerWakeup;
