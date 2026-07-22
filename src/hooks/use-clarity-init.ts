import { useEffect } from "react";

const CLARITY_PROJECT_ID = "xq6i5766do";

declare global {
  interface Window {
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[][] };
    __clarityInitialized?: boolean;
  }
}

export function useClarityInit() {
  useEffect(() => {
    if (!import.meta.env.PROD) return;
    if (typeof window === "undefined" || typeof document === "undefined") return;
    if (window.__clarityInitialized) return;

    const existingScript = document.querySelector(
      `script[data-clarity-id="${CLARITY_PROJECT_ID}"]`,
    );

    if (existingScript) {
      window.__clarityInitialized = true;
      return;
    }

    window.clarity =
      window.clarity ||
      ((...args: unknown[]) => {
        const clarityQueue = window.clarity as ((...queueArgs: unknown[]) => void) & {
          q?: unknown[][];
        };

        clarityQueue.q = clarityQueue.q || [];
        clarityQueue.q.push(args);
      });

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;
    script.setAttribute("data-clarity-id", CLARITY_PROJECT_ID);

    const firstScript = document.getElementsByTagName("script")[0];
    if (firstScript?.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }

    window.__clarityInitialized = true;
  }, []);
}
