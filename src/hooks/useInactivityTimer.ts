import { useCallback, useEffect, useState } from "react";

interface UseInactivityTimerProps {
  timeout: number; // in milliseconds
  onTimeout: () => void;
}

export function useInactivityTimer({
  timeout,
  onTimeout,
}: UseInactivityTimerProps) {
  const [isActive, setIsActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState(timeout);

  const resetTimer = useCallback(() => {
    setIsActive(true);
    setTimeLeft(timeout);
  }, [timeout]);

  const pauseTimer = useCallback(() => {
    setIsActive(false);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsActive(true);
    setTimeLeft(timeout);
  }, [timeout]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1000) {
            onTimeout();
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, timeLeft, onTimeout]);

  // Reset timer on user activity
  useEffect(() => {
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const handleActivity = () => {
      if (!isActive) {
        resumeTimer();
      } else {
        resetTimer();
      }
    };

    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [isActive, resetTimer, resumeTimer]);

  return {
    timeLeft,
    isActive,
    resetTimer,
    pauseTimer,
    resumeTimer,
  };
}
