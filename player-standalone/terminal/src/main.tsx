import React from 'react';
import ReactDOM from 'react-dom/client';
import Player from './Player';
import './styles.css';

declare global {
  interface Window {
    STORY_DATA: any;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Player />
  </React.StrictMode>
);

