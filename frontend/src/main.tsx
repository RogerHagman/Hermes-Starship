import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/messhall.css';
import './styles/landing.css';
import './styles/quarters.css';
import './styles/holodeck.css';
import './styles/sensors.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
