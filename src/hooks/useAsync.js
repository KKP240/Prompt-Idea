import { useState, useCallback } from 'react';

export function useAsync(asyncFunction, defaultData = null) {
  const [data, setData] = useState(defaultData); 
  const [isLoaded, setIsLoaded] = useState(false); 
  const [error, setError] = useState({ success: true, message: '' });

  const execute = useCallback(async () => {
    setIsLoaded(false);
    setError({ success: true, message: '' });

    try {
      const response = await asyncFunction();
      setData(response);
    } catch (err) {
      setError({ success: false, message: err.message || 'Something went wrong.' });
    } finally {
      setIsLoaded(true);
    }
  }, [asyncFunction]);

  return { data, setData, isLoaded, error, execute };
}