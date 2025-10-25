/**
 * 视觉小说播放器
 * 职责：视觉小说风格的UI展示
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayerCore } from '../../../shared/player/PlayerCore.ts';
import type { Story, CurrentNode, ChoiceWithTarget, CharacterImages } from '../../../shared/types/index.ts';
import config from '../config/index.ts';
import { initializeBlockly } from '../utils/blocklyInit.ts';
import { usePluginSystem } from '../contexts/PluginContext.tsx';
import '../styles/visual-novel-player.css';

interface Props {
  story: Story;
}

function VisualNovelPlayer({ story }: Props): JSX.Element {
  const navigate = useNavigate();
  const pluginSystem = usePluginSystem();
  const [currentText, setCurrentText] = useState<string>('');
  const [background, setBackground] = useState<string>('');
  const [characterImages, setCharacterImages] = useState<CharacterImages>({});
  const [currentChoices, setCurrentChoices] = useState<ChoiceWithTarget[]>([]);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [commandFeedback, setCommandFeedback] = useState<string>('');
  const playerRef = useRef<PlayerCore | null>(null);
  const dialogueBoxRef = useRef<HTMLDivElement>(null);

  // 初始化 Blockly（仅初始化代码生成器，不显示编辑器）
  useEffect(() => {
    console.log('[VisualNovelPlayer] Initializing Blockly code generator...');
    initializeBlockly(pluginSystem);
  }, [pluginSystem]);

  useEffect(() => {
    startStory();
  }, []);

  useEffect(() => {
    const dialogueBox = dialogueBoxRef.current;
    if (!dialogueBox) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('choice-embed-link') || target.hasAttribute('data-choice-id')) {
        const choiceId = target.getAttribute('data-choice-id');
        if (choiceId && playerRef.current) {
          playerRef.current.makeChoice(choiceId);
        }
      }
    };

    dialogueBox.addEventListener('click', handleClick);
    return () => dialogueBox.removeEventListener('click', handleClick);
  }, []);

  async function startStory(): Promise<void> {
    const player = new PlayerCore({
      saveKeyPrefix: `vn_save_${story.id}_`,
      onNodeChange: (node: CurrentNode) => {
        // 使用渲染后的HTML内容，与终端播放器保持一致
        const renderedText = node.renderedHTML || node.text || '';
        setCurrentText(renderedText);
        
        const baseUrl = config.api.baseURL.replace('/api', '');
        const imageOwner = (story as any)._imageOwner || story.meta.author;
        const encodedOwner = encodeURIComponent(imageOwner);
        
        // 构建背景图URL
        if (node.image?.imagePath) {
          const imageUrl = `${baseUrl}/userdata/${encodedOwner}/${node.image.imagePath}`;
          setBackground(imageUrl);
        } else {
          setBackground('');
        }
        
        // 构建角色立绘URL
        const newCharacterImages: CharacterImages = {};
        if (node.characterImages?.left?.imagePath) {
          newCharacterImages.left = node.characterImages.left;
        }
        if (node.characterImages?.center?.imagePath) {
          newCharacterImages.center = node.characterImages.center;
        }
        if (node.characterImages?.right?.imagePath) {
          newCharacterImages.right = node.characterImages.right;
        }
        setCharacterImages(newCharacterImages);
        
        setGameEnded(node.type === 'ending');
      },
      onChoicesChange: (choices) => {
        setCurrentChoices(choices);
      },
      onExit: () => navigate('/')
    });
    
    playerRef.current = player;
    await player.start(story);
  }

  function handleChoice(choiceId: string): void {
    if (playerRef.current) {
      playerRef.current.makeChoice(choiceId);
    }
  }

  function executeCommand(cmd: string): void {
    if (!playerRef.current) return;

    setCommandFeedback('');

    if (cmd === 'save') {
      const success = playerRef.current.executeSave();
      if (success) {
        setCommandFeedback('进度已保存');
        setTimeout(() => setCommandFeedback(''), 2000);
      } else {
        setCommandFeedback('保存失败');
        setTimeout(() => setCommandFeedback(''), 2000);
      }
      return;
    }

    if (cmd === 'load') {
      const loadedNode = playerRef.current.executeLoad();
      if (loadedNode) {
        setCommandFeedback('进度已加载');
        setTimeout(() => setCommandFeedback(''), 2000);
      } else {
        setCommandFeedback('没有找到存档');
        setTimeout(() => setCommandFeedback(''), 2000);
      }
      return;
    }

    if (cmd === 'back') {
      const prevNode = playerRef.current.executeBack();
      if (!prevNode) {
        setCommandFeedback('已在起点，无法回退');
        setTimeout(() => setCommandFeedback(''), 2000);
      }
      return;
    }

    if (cmd === 'restart') {
      playerRef.current.executeRestart();
      setCommandFeedback('重新开始');
      setTimeout(() => setCommandFeedback(''), 2000);
      return;
    }

    if (cmd === 'exit') {
      navigate('/');
      return;
    }
  }

  return (
    <div className="vn-player">
      <div className="vn-command-bar">
        <a onClick={() => executeCommand('save')}>SAVE</a>
        <span>|</span>
        <a onClick={() => executeCommand('load')}>LOAD</a>
        <span>|</span>
        <a onClick={() => executeCommand('back')}>BACK</a>
        <span>|</span>
        <a onClick={() => executeCommand('restart')}>RESTART</a>
        <span>|</span>
        <a onClick={() => executeCommand('exit')}>EXIT</a>
      </div>

      {background && (
        <div 
          className="vn-background"
          style={{ backgroundImage: `url(${background})` }}
        />
      )}
      
      <div className="vn-dialogue-container">
        {(characterImages.left || characterImages.center || characterImages.right) && (
          <div className="vn-character-images">
            <div className="vn-character-slot vn-character-slot-left">
              {characterImages.left && (
                <img 
                  src={`${config.api.baseURL.replace('/api', '')}/userdata/${encodeURIComponent((story as any)._imageOwner || story.meta.author)}/${characterImages.left.imagePath}`}
                  alt="Left character"
                  className="vn-character-image"
                />
              )}
            </div>
            <div className="vn-character-slot vn-character-slot-center">
              {characterImages.center && (
                <img 
                  src={`${config.api.baseURL.replace('/api', '')}/userdata/${encodeURIComponent((story as any)._imageOwner || story.meta.author)}/${characterImages.center.imagePath}`}
                  alt="Center character"
                  className="vn-character-image"
                />
              )}
            </div>
            <div className="vn-character-slot vn-character-slot-right">
              {characterImages.right && (
                <img 
                  src={`${config.api.baseURL.replace('/api', '')}/userdata/${encodeURIComponent((story as any)._imageOwner || story.meta.author)}/${characterImages.right.imagePath}`}
                  alt="Right character"
                  className="vn-character-image"
                />
              )}
            </div>
          </div>
        )}
        
        <div className="vn-dialogue-box" ref={dialogueBoxRef}>
          <div 
            className="vn-text"
            dangerouslySetInnerHTML={{ __html: currentText }}
          />
          {commandFeedback && (
            <div className="vn-feedback">{commandFeedback}</div>
          )}
        </div>
        
        {currentChoices.length > 0 && !gameEnded && (
          <div className="vn-choices">
            {currentChoices.map((choice) => (
              <span
                key={choice.id}
                className="vn-choice-link"
                onClick={() => handleChoice(choice.id)}
              >
                {choice.text}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {gameEnded && (
        <div className="vn-game-over">
          <div className="vn-game-over-text">游戏结束</div>
          <div className="vn-game-over-hint">
            点击顶部命令栏的 RESTART 重新开始，或 EXIT 退出
          </div>
        </div>
      )}
    </div>
  );
}

export default VisualNovelPlayer;

