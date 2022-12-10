import { useLocation } from '@remix-run/react';
import { load, trackPageview } from 'fathom-client';
import { useEffect } from 'react';

const Fathom = () => {
  const location = useLocation();

  useEffect(() => {
    load('OXJZWIXK', {
      url: 'outstanding-phone.steamedapples.com/script.js',
      includedDomains: [
        'www.steamedapples.com',
        'steamedapples.com',
        '*.steamedapples.com',
        'www.applesilicongaming.com',
        'applesilicongaming.com',
        '*.applesilicongaming.com',
      ],
    });
  }, []);

  useEffect(() => {
    trackPageview();
  }, [location.pathname, location.search]);

  return null;
};

export default Fathom;
