import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationsProvider } from './contexts/NotificationsContext';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <NotificationsProvider>
                <App />
            </NotificationsProvider>
        </AuthProvider>
    </StrictMode>
)