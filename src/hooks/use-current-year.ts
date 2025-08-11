import { useState, useEffect } from 'react';

export const useCurrentYear = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const updateYear = () => {
      setCurrentYear(new Date().getFullYear());
    };

    // Update year on component mount and set up interval for new year transitions
    updateYear();
    const interval = setInterval(updateYear, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return currentYear;
};