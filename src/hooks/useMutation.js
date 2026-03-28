import { useState, useCallback } from 'react';

export function useMutation(actionFunction) {
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState({ success: true, message: '' });

  const execute = useCallback(async function() {
    setIsLoading(true);
    setError({ success: true, message: '' });

    try {
      const result = await actionFunction();
      return result; 
    } catch (err) {
      setError({ success: false, message: err.message || 'Something went wrong.' });
    } finally {
      setIsLoading(false);
    }
  }, [actionFunction]);

  return { isLoading, error, execute };
}
