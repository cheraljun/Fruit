/**
 * 播放器页面（独立版）
 * 职责：渲染互动小说游戏界面
 */

import { useState, useEffect, useRef } from 'react';
import { PlayerCore } from '@shared/player/PlayerCore';
import type { TerminalMessage } from '@shared/player/PlayerCore';
import type { ChoiceWithTarget } from '@shared/types/index';
import { initializeBlockly } from './blocklyInit';
import './styles.css';

// 确保 Blockly 在模块加载时就初始化
initializeBlockly();

function Player(): JSX.Element {
  const [messages, setMessages] = useState<TerminalMessage[]>([]);
  const [currentChoices, setCurrentChoices] = useState<ChoiceWithTarget[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const playerRef = useRef<PlayerCore | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAndStartStory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('choice-embed-link') || target.hasAttribute('data-choice-id')) {
        const choiceId = target.getAttribute('data-choice-id');
        if (choiceId && playerRef.current) {
          playerRef.current.makeChoice(choiceId);
        }
      }
    };

    container.addEventListener('click', handleClick);
    return () => container.removeEventListener('click', handleClick);
  }, []);

  async function loadAndStartStory(): Promise<void> {
    try {
      const story = (window as any).STORY_DATA;
      
      if (!story) {
        throw new Error('故事数据未找到');
      }

      const player = new PlayerCore({
        saveKeyPrefix: `mo_save_${story.id}_`,
        onMessagesChange: (msgs) => setMessages([...msgs]),
        onChoicesChange: (choices) => setCurrentChoices(choices),
        onExit: () => {
          window.location.href = '/';
        }
      });
      
      playerRef.current = player;
      await player.start(story);
      
    } catch (error) {
      console.error('加载失败:', error);
      setMessages([{ text: '加载故事失败', type: 'err' }]);
    }
  }

  function handleChoiceClick(choice: ChoiceWithTarget): void {
    if (playerRef.current) {
      playerRef.current.makeChoice(choice.id);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter' && inputValue.trim()) {
      if (playerRef.current) {
        playerRef.current.handleCommand(inputValue.trim());
      }
      setInputValue('');
    }
  }

  return (
    <div className="player">
      <div className="player-container">
        <div className="terminal-content">
          <div className="terminal-messages" ref={messagesContainerRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`terminal-message ${msg.type}`}>
                {msg.isHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                ) : (
                  msg.text
                )}
              </div>
            ))}

            {currentChoices.length > 0 && (
              <div className="choice-links">
                {currentChoices.map((choice) => (
                  <span
                    key={choice.id}
                    className="choice-link"
                    onClick={() => handleChoiceClick(choice)}
                  >
                    {choice.text}
                  </span>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="terminal-input-area">
            <span className="terminal-prompt">&gt;</span>
            <input
              ref={inputRef}
              type="text"
              className="terminal-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type Something..."
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Player;
