'use client';

import { useState, useEffect } from 'react';

export default function useImage(url: string): [HTMLImageElement | undefined, string] {
  const [image, setImage] = useState<HTMLImageElement>();
  const [status, setStatus] = useState<string>('loading');

  useEffect(() => {
    if (!url) {
      setStatus('idle');
      return;
    }

    const img = new window.Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      setImage(img);
      setStatus('loaded');
    };

    img.onerror = () => {
      setStatus('error');
    };

    img.src = url;
  }, [url]);

  return [image, status];
}
