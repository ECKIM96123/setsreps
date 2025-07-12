import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { PremiumProvider } from './contexts/PremiumContext'

createRoot(document.getElementById("root")!).render(
  <PremiumProvider>
    <App />
  </PremiumProvider>
);
