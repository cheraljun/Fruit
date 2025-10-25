/**
 * 视觉小说播放器（独立版）
 * 职责：视觉小说风格的UI展示
 */

import { useState, useEffect, useRef } from 'react';
import { PlayerCore } from '@shared/player/PlayerCore';
import type { Story, CurrentNode, ChoiceWithTarget, CharacterImages } from '@shared/types/index';
import { initializeBlockly } from './blocklyInit';
import './styles.css';

initializeBlockly();

interface Props {
  story: Story;
}

function VisualNovelPlayer({ story }: Props): JSX.Element {
  const [currentText, setCurrentText] = useState<string>('');
  const [background, setBackground] = useState<string>('');
  const [characterImages, setCharacterImages] = useState<CharacterImages>({});
  const [currentChoices, setCurrentChoices] = useState<ChoiceWithTarget[]>([]);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [commandFeedback, setCommandFeedback] = useState<string>('');
  const playerRef = useRef<PlayerCore | null>(null);
  const dialogueBoxRef = useRef<HTMLDivElement>(null);

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
        
        // 独立版：imagePath在导出时已转为base64，直接使用
        if (node.image?.imagePath) {
          setBackground(node.image.imagePath);
        } else {
          setBackground('');
        }
        
        // 构建角色立绘（imagePath也是base64）
        const newCharacterImages: CharacterImages = {};
        if (node.characterImages?.left) {
          newCharacterImages.left = node.characterImages.left;
        }
        if (node.characterImages?.center) {
          newCharacterImages.center = node.characterImages.center;
        }
        if (node.characterImages?.right) {
          newCharacterImages.right = node.characterImages.right;
        }
        setCharacterImages(newCharacterImages);
        
        setGameEnded(node.type === 'ending');
      },
      onChoicesChange: (choices) => {
        setCurrentChoices(choices);
      },
      onExit: () => {
        console.log('感谢游玩！');
      }
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
      console.log('感谢游玩！');
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
                  src={characterImages.left.imagePath}
                  alt="Left character"
                  className="vn-character-image"
                />
              )}
            </div>
            <div className="vn-character-slot vn-character-slot-center">
              {characterImages.center && (
                <img 
                  src={characterImages.center.imagePath}
                  alt="Center character"
                  className="vn-character-image"
                />
              )}
            </div>
            <div className="vn-character-slot vn-character-slot-right">
              {characterImages.right && (
                <img 
                  src={characterImages.right.imagePath}
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
      </div>
      
      {currentChoices.length > 0 && !gameEnded && (
        <div className="vn-choices">
          {currentChoices.map((choice) => (
            <button
              key={choice.id}
              className="vn-choice-button"
              onClick={() => handleChoice(choice.id)}
            >
              {choice.text}
            </button>
          ))}
        </div>
      )}
      
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

