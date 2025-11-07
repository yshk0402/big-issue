'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook for tracking the state of a media query.
 * @param query - The media query string to watch.
 * @returns `true` if the media query matches, otherwise `false`.
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Ensure window is defined (for server-side rendering)
    if (typeof window === 'undefined') {
      return;
    }

    const media = window.matchMedia(query);
    
    // Set the initial state
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => {
      setMatches(media.matches);
    };

    // Add listener for changes
    media.addEventListener('change', listener);

    // Cleanup listener on component unmount
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};
