import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { PremiumProvider } from './contexts/PremiumContext'
import { ThemeProvider } from "next-themes"

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <PremiumProvider>
      <App />
    </PremiumProvider>
  </ThemeProvider>
);
