import { useState, useCallback } from 'react';

export function useQuery(asyncFunction, defaultData = null) {
  const [data, setData] = useState(defaultData); 
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState({ success: true, message: '' });

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError({ success: true, message: '' });

    try {
      const response = await asyncFunction();
      setData(response);
    } catch (err) {
      setError({ success: false, message: err.message || 'Something went wrong.' });
    } finally {
      setIsLoading(false);
    }
  }, [asyncFunction]);

  return { data, setData, isLoading, error, execute };
}
