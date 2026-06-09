import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global API Interceptor to support Admin Panel custom Gemini API dynamic keys
const originalFetch = window.fetch;
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

      if (url.includes("/api/")) {
        const geminiKey = localStorage.getItem("arateb_gemini_api_key");
        if (geminiKey && geminiKey.trim() !== "") {
          init = init || {};
          init.headers = init.headers || {};
          if (init.headers instanceof Headers) {
            init.headers.set("x-gemini-key", geminiKey);
          } else if (Array.isArray(init.headers)) {
            // check if header already exist
            const hasKey = init.headers.some(h => h[0]?.toLowerCase() === "x-gemini-key");
            if (!hasKey) {
              init.headers.push(["x-gemini-key", geminiKey]);
            }
          } else {
            const headersRecord = init.headers as Record<string, string>;
            if (!headersRecord["x-gemini-key"]) {
              headersRecord["x-gemini-key"] = geminiKey;
            }
          }
        }
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

      if (url.includes("/api/")) {
        const geminiKey = localStorage.getItem("arateb_gemini_api_key");
        if (geminiKey && geminiKey.trim() !== "") {
          init = init || {};
          init.headers = init.headers || {};
          if (init.headers instanceof Headers) {
            init.headers.set("x-gemini-key", geminiKey);
          } else if (Array.isArray(init.headers)) {
            const hasKey = init.headers.some((h: any) => h[0]?.toLowerCase() === "x-gemini-key");
            if (!hasKey) {
              init.headers.push(["x-gemini-key", geminiKey]);
            }
          } else {
            const headersRecord = init.headers as Record<string, string>;
            if (!headersRecord["x-gemini-key"]) {
              headersRecord["x-gemini-key"] = geminiKey;
            }
          }
        }
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
