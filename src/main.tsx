import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './components/App';

// Add transitions after page load to prevent flash
/* v8 ignore next -- @preserve */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const style = document.createElement('style');
    style.textContent = `
        @media (prefers-reduced-motion: no-preference) {
          * {
            transition-property: color, background-color, border-color;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 300ms;
          }
        }
      `;
    document.head.appendChild(style);
  }, 300);
});

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
