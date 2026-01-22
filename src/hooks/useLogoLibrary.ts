import { useState, useCallback } from 'react';

interface LogoItem {
  id: string;
  url: string;
  name: string;
}

export function useLogoLibrary() {
  const [logos, setLogos] = useState<LogoItem[]>([]);

  const addLogo = useCallback((url: string, name: string) => {
    const newLogo: LogoItem = {
      id: Date.now().toString(),
      url,
      name,
    };
    setLogos((prev) => [...prev, newLogo]);
    return newLogo;
  }, []);

  const removeLogo = useCallback((id: string) => {
    setLogos((prev) => prev.filter((logo) => logo.id !== id));
  }, []);

  const getLogos = useCallback(() => logos, [logos]);

  return {
    logos,
    addLogo,
    removeLogo,
    getLogos,
  };
}
