import { useState, useEffect } from 'react';

export const useAdminMode = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleTitleClick = () => {
    const now = Date.now();
    
    // Reset count if more than 2 seconds have passed
    if (now - lastClickTime > 2000) {
      setClickCount(1);
    } else {
      setClickCount(prev => prev + 1);
    }
    
    setLastClickTime(now);
  };

  useEffect(() => {
    if (clickCount >= 5) {
      setIsAdminMode(true);
      setClickCount(0);
    }
  }, [clickCount]);

  return {
    isAdminMode,
    setIsAdminMode,
    handleTitleClick,
  };
};
