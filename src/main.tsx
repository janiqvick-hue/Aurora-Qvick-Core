import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { AuthBoundary } from './components/AuthBoundary.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AuthBoundary>
        <App />
      </AuthBoundary>
    </AuthProvider>
  </StrictMode>,
);

