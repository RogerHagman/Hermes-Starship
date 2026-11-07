import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/messhall.css';
import './styles/landing.css';
import './styles/quarters.css';
import './styles/holodeck.css';
import './styles/sensors.css';
import './styles/engineering.css';
import './styles/ops.css';
import './styles/computer.css';
import './styles/yeoman.css';
import './styles/science.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
