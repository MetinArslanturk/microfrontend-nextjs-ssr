import { useState, useEffect } from "react";

const scopeCache = new Set();
export const useDynamicScript = (url: string, scope: string) => {
  const [ready, setReady] = useState(scopeCache.has(scope));
  const [errorLoading, setErrorLoading] = useState(false);

  useEffect(() => {
    if (!url) return;

    if (scopeCache.has(scope)) {
      return;
    }

    setReady(false);
    setErrorLoading(false);

    const element = document.createElement('script');

    element.src = url;
    element.type = 'text/javascript';
    element.async = true;

    element.onload = () => {
      scopeCache.add(scope);
      setReady(true);
    };

    element.onerror = () => {
      setReady(false);
      setErrorLoading(true);
    };

    document.head.appendChild(element);

  }, [url, scope]);

  return {
    errorLoading,
    ready,
  };
};