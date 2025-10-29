import React from 'react';
import ReactDOM from 'react-dom/client';
import VisualNovelPlayer from './VisualNovelPlayer';
import './styles.css';

declare global {
  interface Window {
    STORY_DATA: any;
  }
}

// 从window.STORY_DATA读取故事数据
const story = window.STORY_DATA;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <VisualNovelPlayer story={story} />
  </React.StrictMode>
);

