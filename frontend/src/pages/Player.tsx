/**
 * 播放器页面
 * 职责：渲染互动小说游戏界面
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { PlayerCore } from '../../../shared/player/PlayerCore';
import type { TerminalMessage } from '../../../shared/player/PlayerCore';
import type { ChoiceWithTarget } from '../../../shared/types/index';
import api from '../services/api.ts';
import { guestStorage } from '../services/GuestStorage.ts';
import config from '../config/index.ts';
import { initializeBlockly } from '../utils/blocklyInit.ts';
import { usePluginSystem } from '../contexts/PluginContext.tsx';
import '../styles/player.css';

function Player(): JSX.Element {
  const { id, username, gameId } = useParams<{ id?: string; username?: string; gameId?: string }>();
  const navigate = useNavigate();
  const pluginSystem = usePluginSystem();
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState<TerminalMessage[]>([]);
  const [currentChoices, setCurrentChoices] = useState<ChoiceWithTarget[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const playerRef = useRef<PlayerCore | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // 初始化 Blockly（仅初始化代码生成器，不显示编辑器）
  useEffect(() => {
    console.log('[Player] Initializing Blockly code generator...');
    initializeBlockly(pluginSystem);
  }, [pluginSystem]);

  useEffect(() => {
    loadAndStartStory(username, gameId, id);
  }, [id, username, gameId]);

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

  async function loadAndStartStory(publishUsername?: string, publishGameId?: string, localId?: string): Promise<void> {
    try {
      let story;
      
      if (publishUsername && publishGameId) {
        story = await api.publish.getPublished(publishUsername, publishGameId);
      } else if (localId) {
        const currentUsername = localStorage.getItem('username');
        
        if (currentUsername) {
          story = await api.drafts.getById(localId);
        } else {
          story = guestStorage.getById(localId);
          if (!story) {
            throw new Error('游客故事不存在');
          }
        }
      } else {
        throw new Error('无效的游戏参数');
      }
      
      const saveKeyPrefix = publishUsername 
        ? `${config.storage.saveKeyPrefix}published_${publishUsername}_${publishGameId}_`
        : config.storage.saveKeyPrefix;

      const player = new PlayerCore({
        saveKeyPrefix,
        onMessagesChange: (msgs) => setMessages([...msgs]),
        onChoicesChange: (choices) => setCurrentChoices(choices),
        onExit: () => navigate('/')
      });
      
      playerRef.current = player;
      
      const startNodeId = searchParams.get('startNode');
      if (startNodeId) {
        await player.start(story, startNodeId);
      } else {
        await player.start(story);
      }
      
    } catch (error) {
      console.error('加载失败:', error);
      setMessages([{ text: '加载故事失败', type: 'err' }]);
      setTimeout(() => navigate('/app'), 2000);
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
