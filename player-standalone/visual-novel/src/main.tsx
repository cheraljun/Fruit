import React from 'react';
import ReactDOM from 'react-dom/client';
import VisualNovelPlayer from './VisualNovelPlayer';
import ChatStylePlayer from './ChatStylePlayer';
import './styles.css';

declare global {
  interface Window {
    STORY_DATA: any;
  }
}

// 从window.STORY_DATA读取故事数据
const story = window.STORY_DATA;

// 根据 renderStyle 选择播放器
const renderStyle = story?.meta?.renderStyle || 'visual-novel';
const PlayerComponent = renderStyle === 'chat' ? ChatStylePlayer : VisualNovelPlayer;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PlayerComponent story={story} />
  </React.StrictMode>
);

