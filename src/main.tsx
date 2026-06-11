import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global API Interceptor to support Admin Panel custom Gemini & OpenRouter API dynamic keys
const originalFetch = window.fetch;

function injectKeysIntoHeaders(init: any, geminiKey: string | null, openRouterKey: string | null, allKeysStr: string | null) {
  init = init || {};
  init.headers = init.headers || {};
  
  if (init.headers instanceof Headers) {
    if (geminiKey && geminiKey.trim() !== "") init.headers.set("x-gemini-key", geminiKey);
    if (openRouterKey && openRouterKey.trim() !== "") init.headers.set("x-openrouter-key", openRouterKey);
    if (allKeysStr && allKeysStr.trim() !== "") init.headers.set("x-ai-provider-keys", allKeysStr);
  } else if (Array.isArray(init.headers)) {
    if (geminiKey && geminiKey.trim() !== "") {
      const hasKey = init.headers.some((h: any) => h[0]?.toLowerCase() === "x-gemini-key");
      if (!hasKey) init.headers.push(["x-gemini-key", geminiKey]);
    }
    if (openRouterKey && openRouterKey.trim() !== "") {
      const hasKey = init.headers.some((h: any) => h[0]?.toLowerCase() === "x-openrouter-key");
      if (!hasKey) init.headers.push(["x-openrouter-key", openRouterKey]);
    }
    if (allKeysStr && allKeysStr.trim() !== "") {
      const hasKey = init.headers.some((h: any) => h[0]?.toLowerCase() === "x-ai-provider-keys");
      if (!hasKey) init.headers.push(["x-ai-provider-keys", allKeysStr]);
    }
  } else {
    const headersRecord = init.headers as Record<string, string>;
    if (geminiKey && geminiKey.trim() !== "" && !headersRecord["x-gemini-key"]) {
      headersRecord["x-gemini-key"] = geminiKey;
    }
    if (openRouterKey && openRouterKey.trim() !== "" && !headersRecord["x-openrouter-key"]) {
      headersRecord["x-openrouter-key"] = openRouterKey;
    }
    if (allKeysStr && allKeysStr.trim() !== "" && !headersRecord["x-ai-provider-keys"]) {
      headersRecord["x-ai-provider-keys"] = allKeysStr;
    }
  }
  return init;
}

const dispatchApiEvent = (status: 'success' | 'retry' | 'error', url: string, message?: string, latency?: number) => {
  const event = new CustomEvent('api-health-event', { detail: { status, url, message, timestamp: Date.now(), latency } });
  window.dispatchEvent(event);
};

const fetchWithRetry = async (input: RequestInfo | URL, init?: RequestInit, maxRetries = 3) => {
  let retries = 0;
  const urlStr = typeof input === "string" ? input : (input instanceof URL ? input.toString() : (input as any)?.url || "unknown");
  while (true) {
    const startTime = performance.now();
    try {
      const response = await originalFetch(input, init);
      const latency = Math.round(performance.now() - startTime);
      // Throw error to trigger retry for rate limits and server errors
      if (!response.ok && (response.status === 429 || response.status >= 500) && retries < maxRetries) {
        throw new Error(`HTTP Error ${response.status}`);
      }
      if (!response.ok) {
         (window as any).__lastFailedRequest = { input, init, url: urlStr, timestamp: Date.now() };
         dispatchApiEvent('error', urlStr, `HTTP Error ${response.status}`, latency);
      } else {
         dispatchApiEvent('success', urlStr, undefined, latency);
      }
      return response;
    } catch (error: any) {
      const latency = Math.round(performance.now() - startTime);
      if (retries >= maxRetries) {
        (window as any).__lastFailedRequest = { input, init, url: urlStr, timestamp: Date.now() };
        dispatchApiEvent('error', urlStr, error.message || String(error), latency);
        throw error;
      }
      retries++;
      const delay = Math.pow(2, retries) * 500 + Math.random() * 500;
      dispatchApiEvent('retry', urlStr, `Attempt ${retries}/${maxRetries} failed: ${error.message || error}`, latency);
      console.warn(`[Fetch Interceptor] API call to ${urlStr} failed (attempt ${retries}/${maxRetries}). Retrying in ${Math.round(delay)}ms... Error:`, error.message || error);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

try {
  Object.defineProperty(window, "fetch", {
    value: async function (input: RequestInfo | URL, init?: RequestInit) {
      let url = "";
      if (typeof input === "string") {
        url = input;
      } else if (input instanceof URL) {
        url = input.toString();
      } else if (input && typeof input === "object" && "url" in input) {
        url = (input as any).url || "";
      }

      if (url.includes("/api/") || url.includes("openrouter.ai")) {
        const geminiKey = localStorage.getItem("arateb_gemini_api_key");
        const openRouterKey = localStorage.getItem("arateb_openrouter_api_key") || localStorage.getItem("arateb_gemini_api_key"); // fallback since we used geminikey for both
        const allKeysStr = localStorage.getItem("arateb_ai_provider_keys");
        init = injectKeysIntoHeaders(init, geminiKey, openRouterKey, allKeysStr);
        return fetchWithRetry(input, init);
      }
      return originalFetch(input, init);
    },
    writable: true,
    configurable: true,
    enumerable: true
  });
} catch (e) {
  console.warn("Could not define property window.fetch via Object.defineProperty, falling back to direct assignment:", e);
  try {
    (window as any).fetch = async function (input: any, init: any) {
      let url = "";
      if (typeof input === "string") {
        url = input;
      } else if (input instanceof URL) {
        url = input.toString();
      } else if (input && typeof input === "object" && "url" in input) {
        url = (input as any).url || "";
      }

      if (url.includes("/api/") || url.includes("openrouter.ai")) {
        const geminiKey = localStorage.getItem("arateb_gemini_api_key");
        const openRouterKey = localStorage.getItem("arateb_openrouter_api_key") || localStorage.getItem("arateb_gemini_api_key");
        const allKeysStr = localStorage.getItem("arateb_ai_provider_keys");
        init = injectKeysIntoHeaders(init, geminiKey, openRouterKey, allKeysStr);
        return fetchWithRetry(input, init);
      }
      return originalFetch(input, init);
    };
  } catch (err) {
    console.error("Critical: Absolutely unable to intercept window.fetch", err);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered with scope:', registration.scope);
      })
      .catch((err) => {
        console.log('SW registration failed:', err);
      });
  });
}
