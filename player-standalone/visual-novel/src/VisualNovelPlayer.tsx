/**
 * 视觉小说播放器（独立版）
 * 职责：视觉小说风格的UI展示
 */

import { useState, useEffect, useRef } from 'react';
import { PlayerCore } from '@shared/player/PlayerCore';
import type { Story, CurrentNode, ChoiceWithTarget, CharacterImages, NodeImage } from '@shared/types/index';
import { initializeBlockly } from './blocklyInit';
import './styles.css';

initializeBlockly();

interface Hotspot {
  id: string;
  targetNodeId: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface VisitedScene {
  nodeId: string;
  sceneName: string;
}

interface Props {
  story: Story;
}

function VisualNovelPlayer({ story }: Props): JSX.Element {
  const [currentText, setCurrentText] = useState<string>('');
  const [displayText, setDisplayText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [background, setBackground] = useState<string>('');
  const [nodeImage, setNodeImage] = useState<NodeImage | undefined>(undefined);
  const [characterImages, setCharacterImages] = useState<CharacterImages>({});
  const [currentChoices, setCurrentChoices] = useState<ChoiceWithTarget[]>([]);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [commandFeedback, setCommandFeedback] = useState<string>('');
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [showCommandBar, setShowCommandBar] = useState<boolean>(false);
  const [showWorldMap, setShowWorldMap] = useState<boolean>(false);
  const [visitedScenes, setVisitedScenes] = useState<VisitedScene[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState<string>('');
  const [typewriterSpeed, setTypewriterSpeed] = useState<number>(0);
  const [showVariables, setShowVariables] = useState<boolean>(false);
  const [displayVariables, setDisplayVariables] = useState<Array<{id: string, label: string, value: any}>>([]);
  const playerRef = useRef<PlayerCore | null>(null);
  const dialogueBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startStory();
  }, []);

  // 打字机效果
  useEffect(() => {
    if (!typewriterSpeed || typewriterSpeed === 0) {
      setDisplayText(currentText);
      setIsTyping(false);
      return;
    }

    // 提取纯文本
    const temp = document.createElement('div');
    temp.innerHTML = currentText;
    const plainText = temp.textContent || temp.innerText || '';

    setIsTyping(true);
    setDisplayText('');

    let index = 0;
    const timer = setInterval(() => {
      if (index < plainText.length) {
        setDisplayText(plainText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setDisplayText(currentText);
        setIsTyping(false);
      }
    }, typewriterSpeed);

    return () => clearInterval(timer);
  }, [currentText, typewriterSpeed]);

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
  }, [currentText]);

  function updateDisplayVariables(): void {
    if (!playerRef.current) return;
    
    const varsToDisplay = story.variables?.filter(v => v.displayInPlayer) || [];
    if (varsToDisplay.length === 0) {
      setDisplayVariables([]);
      return;
    }
    
    const pluginSystem = playerRef.current.getPluginSystem();
    const runtimePluginEntry = pluginSystem.getPlugin('basicmod.runtime');
    
    if (!runtimePluginEntry || !runtimePluginEntry.enabled) {
      setDisplayVariables([]);
      return;
    }
    
    const runtimePlugin = runtimePluginEntry.plugin as any;
    
    const displayVars = varsToDisplay.map(varDef => ({
      id: varDef.id,
      label: varDef.label,
      value: runtimePlugin.get(varDef.id)
    }));
    
    setDisplayVariables(displayVars);
  }

  async function startStory(): Promise<void> {
    const player = new PlayerCore({
      saveKeyPrefix: `vn_save_${story.id}_`,
      onNodeChange: (node: CurrentNode) => {
        // 使用渲染后的HTML内容，与终端播放器保持一致
        const renderedText = node.renderedHTML || node.text || '';
        setCurrentText(renderedText);
        
        // 获取打字机速度
        const nodeData = story.nodes.find(n => n.id === node.id)?.data as any;
        setTypewriterSpeed(nodeData?.typewriterSpeed || 0);
        
        // 独立版：imagePath在导出时已转为base64，直接使用
        if (node.image?.imagePath) {
          setBackground(node.image.imagePath);
          setNodeImage(node.image);
        } else {
          setBackground('');
          setNodeImage(undefined);
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
        
        // 加载热区数据
        const imageHotspots = nodeData?.pluginData?.['image-hotspots'] || [];
        setHotspots(imageHotspots);
        
        // 记录当前节点ID
        setCurrentNodeId(node.id);
        
        // 如果是热点图片模式，记录已访问场景
        if (imageHotspots.length > 0 && node.image?.imagePath) {
          let sceneName = node.image.sceneName;
          if (!sceneName) {
            const text = node.text.replace(/\s+/g, '');
            sceneName = text.length > 5 ? text.substring(0, 5) + '...' : text;
          }
          
          setVisitedScenes(prev => {
            // 检查是否已访问过
            const alreadyVisited = prev.some(scene => scene.nodeId === node.id);
            if (alreadyVisited) {
              return prev;
            }
            // 添加新场景
            return [...prev, { nodeId: node.id, sceneName }];
          });
        }
        
        setGameEnded(node.type === 'ending');
        
        // 更新属性面板显示的变量
        updateDisplayVariables();
      },
      onChoicesChange: (choices) => {
        setCurrentChoices(choices);
      },
      onExit: () => {
        window.location.href = '/';
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

  function handleWorldMapJump(targetNodeId: string): void {
    if (!playerRef.current) return;
    
    setShowWorldMap(false);
    playerRef.current.jumpToNode(targetNodeId);
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
      setShowCommandBar(false);
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
      setShowCommandBar(false);
      return;
    }

    if (cmd === 'back') {
      const prevNode = playerRef.current.executeBack();
      if (!prevNode) {
        setCommandFeedback('已在起点，无法回退');
        setTimeout(() => setCommandFeedback(''), 2000);
      }
      setShowCommandBar(false);
      return;
    }

    if (cmd === 'restart') {
      playerRef.current.executeRestart();
      setCommandFeedback('重新开始');
      setTimeout(() => setCommandFeedback(''), 2000);
      setShowCommandBar(false);
      return;
    }

    if (cmd === 'exit') {
      window.location.href = 'http://moscript.top';
      return;
    }
  }

  const isImageHotspotMode = hotspots.length > 0 && background && !gameEnded;

  return (
    <div className="vn-player">
      {/* 世界地图（有热点场景时始终显示） */}
      {visitedScenes.length > 0 && (
        <div className="vn-world-map">
          <a 
            className="vn-world-map-toggle"
            onClick={() => setShowWorldMap(!showWorldMap)}
          >
            世界地图
          </a>
          
          {showWorldMap && (
            <div className="vn-world-map-list">
              {visitedScenes.map((scene) => (
                <a
                  key={scene.nodeId}
                  className={scene.nodeId === currentNodeId ? 'current' : ''}
                  onClick={() => handleWorldMapJump(scene.nodeId)}
                >
                  {scene.sceneName}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* 属性面板 */}
      {displayVariables.length > 0 && (
        <div className="vn-variables">
          <a 
            className="vn-variables-toggle"
            onClick={() => setShowVariables(!showVariables)}
          >
            属性
          </a>
          
          {showVariables && (
            <div className="vn-variables-list">
              {displayVariables.map((variable) => (
                <div key={variable.id} className="vn-variable-item">
                  {variable.label}：{String(variable.value)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className="vn-help">
        <a 
          className="vn-help-toggle"
          onClick={() => setShowCommandBar(!showCommandBar)}
        >
          帮助
        </a>
        
        {showCommandBar && (
          <div className="vn-help-list">
            <a onClick={() => executeCommand('save')}>保存</a>
            <a onClick={() => executeCommand('load')}>读档</a>
            <a onClick={() => executeCommand('back')}>回退</a>
            <a onClick={() => executeCommand('restart')}>重来</a>
            <a onClick={() => executeCommand('exit')}>退出</a>
          </div>
        )}
      </div>

      {background && (
        <div 
          className="vn-background"
          style={{ 
            backgroundImage: `url(${background})`,
            backgroundPosition: nodeImage?.position || 'center'
          }}
        />
      )}
      
      {/* 图片热区模式（完全透明，无边框无标签） */}
      {isImageHotspotMode && nodeImage && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: nodeImage.position?.includes('top') ? 'flex-start' : 
                      nodeImage.position?.includes('bottom') ? 'flex-end' : 'center',
          justifyContent: nodeImage.position?.includes('left') ? 'flex-start' : 
                          nodeImage.position?.includes('right') ? 'flex-end' : 'center',
          pointerEvents: 'none',
          zIndex: 100
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            aspectRatio: `${nodeImage.width} / ${nodeImage.height}`,
            pointerEvents: showWorldMap ? 'none' : 'auto'
          }}>
            {hotspots.map((hotspot) => (
              <div
                key={hotspot.id}
                onClick={() => {
                  if (playerRef.current) {
                    playerRef.current.jumpToNode(hotspot.targetNodeId);
                  }
                }}
                style={{
                  position: 'absolute',
                  left: `${hotspot.x * 100}%`,
                  top: `${hotspot.y * 100}%`,
                  width: `${hotspot.width * 100}%`,
                  height: `${hotspot.height * 100}%`,
                  cursor: 'pointer',
                  background: 'transparent'
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* 传统模式 */}
      {!isImageHotspotMode && (
        <div className="vn-dialogue-container">
        {(characterImages.left || characterImages.center || characterImages.right) && (
          <div className="vn-character-images">
            <div className="vn-character-slot vn-character-slot-left">
              {characterImages.left && (
                <img 
                  src={characterImages.left.imagePath}
                  alt="Left character"
                  className="vn-character-image"
                  style={{
                    transform: `scale(${characterImages.left.scale || 1.0})`,
                    transformOrigin: 'left bottom'
                  }}
                />
              )}
            </div>
            <div className="vn-character-slot vn-character-slot-center">
              {characterImages.center && (
                <img 
                  src={characterImages.center.imagePath}
                  alt="Center character"
                  className="vn-character-image"
                  style={{
                    transform: `scale(${characterImages.center.scale || 1.0})`,
                    transformOrigin: 'center bottom'
                  }}
                />
              )}
            </div>
            <div className="vn-character-slot vn-character-slot-right">
              {characterImages.right && (
                <img 
                  src={characterImages.right.imagePath}
                  alt="Right character"
                  className="vn-character-image"
                  style={{
                    transform: `scale(${characterImages.right.scale || 1.0})`,
                    transformOrigin: 'right bottom'
                  }}
                />
              )}
            </div>
          </div>
        )}
        
        <div className="vn-dialogue-box" ref={dialogueBoxRef}>
          {isTyping ? (
            <div className="vn-text" style={{ whiteSpace: 'pre-wrap' }}>
              {displayText}
            </div>
          ) : (
            <div 
              className="vn-text"
              dangerouslySetInnerHTML={{ __html: displayText }}
            />
          )}
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
      )}
      
      {gameEnded && (
        <div className="vn-game-over">
          <div className="vn-game-over-text">游戏结束</div>
          <div className="vn-game-over-hint">
            点击右上角"帮助"打开命令栏，选择 RESTART 重新开始或 EXIT 退出
          </div>
        </div>
      )}
    </div>
  );
}

export default VisualNovelPlayer;

