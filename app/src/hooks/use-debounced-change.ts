import {useEffect, useState} from "react";

export const useDebouncedChange = (callback: () => void, delay = 2500) => {
  const [isTyping, setIsTyping] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);

  useEffect(() => {
    if (!isTyping) return;

    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = setTimeout(() => {
      callback(); // Trigger callback when typing stops
      setIsTyping(false);
    }, delay);

    setTimer(newTimer);

    return () => clearTimeout(newTimer);
  }, [isTyping, callback, delay]);

  return () => setIsTyping(true); // Call this when input changes
};
