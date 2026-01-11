import React, { useState, useCallback, useMemo, memo } from 'react';

/**
 * ParentalGate Component
 *
 * A verification gate to prevent children from accessing settings.
 * Uses a simple math problem that's easy for adults but difficult for young children.
 */
const ParentalGate = memo(function ParentalGate({ onSuccess, onCancel }) {
  // Generate a random math problem
  const mathProblem = useMemo(() => {
    const operations = ['+', '-', '×'];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let num1, num2, answer;

    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 20) + 10;
        num2 = Math.floor(Math.random() * 20) + 10;
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 30) + 20;
        num2 = Math.floor(Math.random() * 15) + 5;
        answer = num1 - num2;
        break;
      case '×':
        num1 = Math.floor(Math.random() * 8) + 3;
        num2 = Math.floor(Math.random() * 8) + 3;
        answer = num1 * num2;
        break;
      default:
        num1 = 10;
        num2 = 5;
        answer = 15;
    }

    return { num1, num2, operation, answer };
  }, []);

  const [userAnswer, setUserAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showError, setShowError] = useState(false);

  // Handle input change
  const handleInputChange = useCallback((e) => {
    const value = e.target.value.replace(/[^0-9-]/g, '');
    setUserAnswer(value);
    setShowError(false);
  }, []);

  // Handle submit
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const parsed = parseInt(userAnswer, 10);

      if (parsed === mathProblem.answer) {
        onSuccess();
      } else {
        setAttempts((prev) => prev + 1);
        setShowError(true);
        setUserAnswer('');

        // After 3 failed attempts, auto-cancel
        if (attempts >= 2) {
          setTimeout(onCancel, 1500);
        }
      }
    },
    [userAnswer, mathProblem.answer, attempts, onSuccess, onCancel]
  );

  return (
    <div className="parental-gate-overlay">
      <div className="parental-gate-modal">
        {/* Close Button */}
        <button
          className="gate-close-button"
          onClick={onCancel}
          aria-label="Cancel"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="gate-title">
          <span className="gate-icon">🔒</span>
          Parent Verification
        </h2>

        {/* Instructions */}
        <p className="gate-instructions">
          Please solve this math problem to access settings:
        </p>

        {/* Math Problem */}
        <div className="math-problem">
          <span className="math-num">{mathProblem.num1}</span>
          <span className="math-op">{mathProblem.operation}</span>
          <span className="math-num">{mathProblem.num2}</span>
          <span className="math-equals">=</span>
          <span className="math-answer">?</span>
        </div>

        {/* Answer Form */}
        <form onSubmit={handleSubmit} className="gate-form">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={userAnswer}
            onChange={handleInputChange}
            placeholder="Enter answer"
            className={`gate-input ${showError ? 'input-error' : ''}`}
            autoFocus
            autoComplete="off"
          />

          {showError && (
            <p className="error-message">
              {attempts >= 3 ? 'Too many attempts!' : 'Incorrect, try again'}
            </p>
          )}

          <div className="gate-buttons">
            <button type="button" className="gate-cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button
              type="submit"
              className="gate-submit-btn"
              disabled={!userAnswer}
            >
              Verify
            </button>
          </div>
        </form>

        {/* Alternative: Hold Button */}
        <div className="gate-alternative">
          <p className="alternative-text">Or hold this button for 3 seconds:</p>
          <HoldButton onComplete={onSuccess} />
        </div>
      </div>
    </div>
  );
});

/**
 * HoldButton Component
 *
 * A button that must be held for 3 seconds to activate.
 * Alternative parental gate mechanism.
 */
const HoldButton = memo(function HoldButton({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const intervalRef = React.useRef(null);
  const HOLD_DURATION = 3000; // 3 seconds
  const UPDATE_INTERVAL = 50; // Update every 50ms

  const startHold = useCallback(() => {
    setIsHolding(true);
    setProgress(0);

    let elapsed = 0;
    intervalRef.current = setInterval(() => {
      elapsed += UPDATE_INTERVAL;
      const newProgress = (elapsed / HOLD_DURATION) * 100;
      setProgress(newProgress);

      if (elapsed >= HOLD_DURATION) {
        clearInterval(intervalRef.current);
        onComplete();
      }
    }, UPDATE_INTERVAL);
  }, [onComplete]);

  const stopHold = useCallback(() => {
    setIsHolding(false);
    setProgress(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <button
      className={`hold-button ${isHolding ? 'holding' : ''}`}
      onMouseDown={startHold}
      onMouseUp={stopHold}
      onMouseLeave={stopHold}
      onTouchStart={startHold}
      onTouchEnd={stopHold}
      onTouchCancel={stopHold}
      style={{ '--progress': `${progress}%` }}
    >
      <span className="hold-icon">👆</span>
      <span className="hold-text">{isHolding ? 'Keep holding...' : 'Hold Here'}</span>
      <div className="hold-progress" style={{ width: `${progress}%` }} />
    </button>
  );
});

export default ParentalGate;
