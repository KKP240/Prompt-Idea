import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format
export const formattedDateToReadable = function (ts) {
  try {
    return ts?.toDate
      ? ts.toDate().toLocaleString('en-Us', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : String(ts || '');
  } catch {
    return String(ts || '');
  }
};

// Fetch Client Id
export const getClientId = async function () {
  try {
    const stored = localStorage.getItem('clientId');
    if (stored) return stored;
    const res = await fetch('https://api.ipify.org?format=json');
    if (res.ok) {
      const data = await res.json();
      if (data?.ip) {
        localStorage.setItem('clientId', data.ip);
        return data.ip;
      }
    }
  } catch (e) {
    // ignore
  }
  const id = 'anon_' + Math.random().toString(36).slice(2, 10);
  localStorage.setItem('clientId', id);
  return id;
};
