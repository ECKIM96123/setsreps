import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './lib/i18n'
import { ThemeProvider } from "next-themes"

// Register service worker for offline functionality
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then((registration) => {
      console.log('SW registered: ', registration);
    })
    .catch((registrationError) => {
      console.log('SW registration failed: ', registrationError);
    });
}

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <App />
  </ThemeProvider>
);
