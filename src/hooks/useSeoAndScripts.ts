import { useEffect } from 'react';
import {
  PAGE_TITLE,
  META_TAGS,
  FONT_LINK_HREF,
  HTML2CANVAS_SCRIPT_SRC,
  ADSENSE_SCRIPT_SRC,
} from '../constants.ts';

export function useSeoAndScripts() {
  useEffect(() => {
    document.title = PAGE_TITLE;

    META_TAGS.forEach((tag) => {
      const meta = document.createElement('meta');
      const t = tag as unknown as Record<string, string>;
      Object.keys(tag).forEach((key) => meta.setAttribute(key, t[key]));
      document.head.appendChild(meta);
    });

    const fontLink = document.createElement('link');
    fontLink.href = FONT_LINK_HREF;
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    if (!document.querySelector(`script[src*="adsbygoogle"]`)) {
      const adScript = document.createElement('script');
      adScript.src = ADSENSE_SCRIPT_SRC;
      adScript.async = true;
      adScript.crossOrigin = 'anonymous';
      document.head.appendChild(adScript);
    }

    if (!window.html2canvas) {
      const script = document.createElement('script');
      script.src = HTML2CANVAS_SCRIPT_SRC;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);
}
