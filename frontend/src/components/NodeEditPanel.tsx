/**
 * 节点编辑面板
 * 职责：编辑单个节点的内容，实时保存
 */

import { useState, useEffect, useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import type { StoryNode, StoryMeta, Choice, NodeType, NodeImage, CharacterImages, BlocklyWorkspaceState, NodeScripts } from '../../../shared/types/index.ts';
import { processImageFile, formatFileSize, validateImageFile } from '../utils/imageProcessor.ts';
import { useTheme } from '../contexts/ThemeContext.tsx';
import { usePluginSystem } from '../contexts/PluginContext.tsx';
import BlocklyEditor from './BlocklyEditor.tsx';
import DraggableWindow from './ui/DraggableWindow.tsx';
import HotspotEditor, { type Hotspot } from './HotspotEditor.tsx';
import api from '../services/api.ts';
import config from '../config/index.ts';

interface NodeEditPanelProps {
  node: StoryNode;
  allNodes: StoryNode[]; // 所有节点列表（用于热区选择目标节点）
  onUpdate: (nodeId: string, data: Partial<StoryNode['data']>) => void;
  onClose: () => void;
  onDeleteChoice?: (nodeId: string, choiceIndex: number, choice: Choice) => void;
  globalVariables?: import('../../../shared/types/index.ts').VariableDefinition[];
  storyMeta: StoryMeta;
}

// 暴露给父组件的方法接口
export interface NodeEditPanelRef {
  applyChanges: () => void;
}

// TODO: 将来会用 Blockly 编辑器替代这里的高级功能

const NodeEditPanel = forwardRef<NodeEditPanelRef, NodeEditPanelProps>(({ node, allNodes, onUpdate, onClose, onDeleteChoice, globalVariables = [], storyMeta }, ref) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'theme.dark';
  const pluginSystem = usePluginSystem();
  
  const [text, setText] = useState<string>('');
  const [choices, setChoices] = useState<Choice[]>([]);
  const [nodeType, setNodeType] = useState<NodeType>(node.data.nodeType || 'normal');
  const [nodeImage, setNodeImage] = useState<NodeImage | undefined>(undefined);
  const [characterImages, setCharacterImages] = useState<CharacterImages>({});
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');
  const [typewriterSpeed, setTypewriterSpeed] = useState<number>(0);
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number>(-1);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadingCharacter, setUploadingCharacter] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const characterFileInputRefs = {
    left: useRef<HTMLInputElement>(null),
    center: useRef<HTMLInputElement>(null),
    right: useRef<HTMLInputElement>(null)
  };
  
  // Blockly 脚本状态
  const [nodeScripts, setNodeScripts] = useState<NodeScripts>({});
  const [editingScript, setEditingScript] = useState<{
    type: 'node-enter' | 'node-leave' | 'choice-condition' | 'choice-select';
    choiceIndex?: number;
    currentState?: BlocklyWorkspaceState;
  } | null>(null);
  const [deleteScriptConfirm, setDeleteScriptConfirm] = useState<boolean>(false);
  
  // 热区编辑状态
  const [editingHotspots, setEditingHotspots] = useState<boolean>(false);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [hotspotForm, setHotspotForm] = useState<{
    show: boolean;
    rect: { x: number; y: number; width: number; height: number } | null;
    label: string;
    targetNodeId: string;
  }>({
    show: false,
    rect: null,
    label: '',
    targetNodeId: ''
  });
  const [deleteHotspotConfirm, setDeleteHotspotConfirm] = useState<string | null>(null);
  
  const renderedHTML = useMemo(() => {
    const story = {
      meta: storyMeta
    };
    const rendered = pluginSystem.trigger('content:render', { 
      text, 
      nodeId: node.id,
      story 
    });
    return rendered.renderedHTML || text;
  }, [text, pluginSystem, node.id, storyMeta]);

  const isVisualNovelMode = storyMeta.displayMode === 'visual-novel';

  useEffect(() => {
    setText(node.data.text);
    setChoices(node.data.choices);
    setNodeType(node.data.nodeType || 'normal');
    setNodeImage(node.data.image);
    setCharacterImages(node.data.characterImages || {});
    setTags((node.data as any).tags || []);
    setTypewriterSpeed((node.data as any).typewriterSpeed || 0);
    
    // 加载 Blockly 脚本
    const data = node.data as any;
    const blocklyScripts = data.pluginData?.['blockly.scripts'] || {};
    setNodeScripts(blocklyScripts);
    
    // 加载热区数据
    const imageHotspots = data.pluginData?.['image-hotspots'] || [];
    setHotspots(imageHotspots);
    
    setDeleteConfirmIndex(-1);
    setDeleteScriptConfirm(false);
    setEditingHotspots(false);
    setDeleteHotspotConfirm(null);
  }, [node]);

  useEffect(() => {
    if (deleteConfirmIndex >= 0) {
      const timer = setTimeout(() => {
        setDeleteConfirmIndex(-1);
      }, 3000);
      return () => clearTimeout(timer);
    }
    return () => {};
  }, [deleteConfirmIndex]);

  useEffect(() => {
    if (deleteScriptConfirm) {
      const timer = setTimeout(() => {
        setDeleteScriptConfirm(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
    return () => {};
  }, [deleteScriptConfirm]);

  useEffect(() => {
    if (deleteHotspotConfirm) {
      const timer = setTimeout(() => {
        setDeleteHotspotConfirm(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
    return () => {};
  }, [deleteHotspotConfirm]);

  const buildNodeData = (): Partial<StoryNode['data']> => {
    // 合并选项的 Blockly 脚本
    const choicesWithScripts = choices.map((choice) => {
      const choiceData = choice as any;
      const existingPluginData = choiceData.pluginData || {};
      return {
        ...choice,
        pluginData: {
          ...existingPluginData,
          'blockly.scripts': choiceData.pluginData?.['blockly.scripts'] || {}
        }
      };
    });
    
    return {
      ...node.data,
      text,
      choices: choicesWithScripts,
      nodeType,
      image: nodeImage,
      characterImages,
      tags,
      typewriterSpeed,
      pluginData: {
        ...(node.data as any).pluginData,
        'blockly.scripts': nodeScripts,
        'image-hotspots': hotspots.length > 0 ? hotspots : undefined
      }
    } as any;
  };

  // 暴露方法给父组件（用于保存前自动应用更改）
  useImperativeHandle(ref, () => ({
    applyChanges: () => {
      const nodeData = buildNodeData();
      onUpdate(node.id, nodeData);
    }
  }), [node.id, onUpdate, text, choices, nodeType, nodeImage, characterImages, tags, typewriterSpeed, nodeScripts, hotspots]);

  // 应用更改到全局状态（内存），不持久化到后端
  const handleSave = (): void => {
    const nodeData = buildNodeData();
    onUpdate(node.id, nodeData);
  };

  // 关闭面板时自动应用更改到全局状态
  const handleClose = (): void => {
    const nodeData = buildNodeData();
    onUpdate(node.id, nodeData);
    onClose();
  };

  const handleTextChange = (newText: string): void => {
    setText(newText);
  };


  const handleNodeTypeChange = (newType: NodeType): void => {
    setNodeType(newType);
  };

  const addChoice = (): void => {
    const newChoice: Choice = {
      id: `c${node.id}_${choices.length + 1}`,
      text: `选项${choices.length + 1}`
    };
    const newChoices = [...choices, newChoice];
    setChoices(newChoices);
  };

  const updateChoice = (index: number, newText: string): void => {
    const newChoices = [...choices];
    newChoices[index].text = newText;
    setChoices(newChoices);
  };

  const handleDeleteChoiceClick = (index: number): void => {
    if (choices.length <= 1) return;
    
    if (deleteConfirmIndex === index) {
      const choiceToDelete = choices[index];
      const newChoices = choices.filter((_, i) => i !== index);
      setChoices(newChoices);
      setDeleteConfirmIndex(-1);
      
      if (onDeleteChoice) {
        onDeleteChoice(node.id, index, choiceToDelete);
      }
    } else {
      setDeleteConfirmIndex(index);
    }
  };


  const handleAddTag = (): void => {
    const trimmedTag = tagInput.trim();
    if (!trimmedTag) return;
    if (tags.includes(trimmedTag)) {
      alert('标签已存在');
      return;
    }
    if (tags.length >= 10) {
      alert('最多添加10个标签');
      return;
    }
    
    const newTags = [...tags, trimmedTag];
    setTags(newTags);
    setTagInput('');
  };

  const handleDeleteTag = (tagToDelete: string): void => {
    const newTags = tags.filter(tag => tag !== tagToDelete);
    setTags(newTags);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setUploading(true);
    try {
      // 先处理图片（压缩、转换格式）
      const processed = await processImageFile(file);
      
      // 上传到后端（自动去重）
      const uploaded = await api.images.upload(
        processed.imageData,
        processed.fileName,
        processed.width,
        processed.height,
        processed.originalFormat
      );
      
      const newImage: NodeImage = {
        imagePath: uploaded.imagePath,
        fileName: uploaded.fileName,
        fileSize: uploaded.fileSize,
        originalFormat: uploaded.originalFormat,
        hash: uploaded.hash,
        width: uploaded.width,
        height: uploaded.height
      };
      
      setNodeImage(newImage);
      
    } catch (error) {
      alert('图片上传失败: ' + (error as Error).message);
    } finally {
      setUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleDeleteImage = () => {
    setNodeImage(undefined);
  };

  const handleCharacterImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    position: 'left' | 'center' | 'right'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setUploadingCharacter(position);
    try {
      const processed = await processImageFile(file);
      
      const uploaded = await api.images.upload(
        processed.imageData,
        processed.fileName,
        processed.width,
        processed.height,
        processed.originalFormat
      );
      
      const newImage: NodeImage = {
        imagePath: uploaded.imagePath,
        fileName: uploaded.fileName,
        fileSize: uploaded.fileSize,
        originalFormat: uploaded.originalFormat,
        hash: uploaded.hash,
        width: uploaded.width,
        height: uploaded.height
      };
      
      setCharacterImages({
        ...characterImages,
        [position]: newImage
      });
      
    } catch (error) {
      alert('图片上传失败: ' + (error as Error).message);
    } finally {
      setUploadingCharacter(null);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleDeleteCharacterImage = (position: 'left' | 'center' | 'right') => {
    const newCharacterImages = { ...characterImages };
    delete newCharacterImages[position];
    setCharacterImages(newCharacterImages);
  };

  return (
    <>
      <DraggableWindow
        title={`编辑节点 ${node.data.nodeId}`}
        onClose={handleClose}
        width={420}
        maxHeight="85vh"
        defaultPosition={{ x: window.innerWidth - 480, y: 60 }}
        zIndex={1000}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="form-group">
          <label>节点类型</label>
          <select value={nodeType} onChange={(e) => handleNodeTypeChange(e.target.value as NodeType)}>
            <option value="start">开始节点</option>
            <option value="normal">普通节点</option>
            <option value="ending">结局节点</option>
          </select>
        </div>

        <div className="form-group">
          <label>标签</label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="输入标签，按回车添加"
              style={{ 
                flex: 1,
                padding: '8px 12px',
                fontSize: '0.95rem',
                minHeight: '38px'
              }}
              maxLength={20}
            />
            <button 
              type="button"
              onClick={handleAddTag}
              disabled={!tagInput.trim()}
              style={{
                padding: '6px 14px',
                fontSize: '0.875rem',
                height: '38px',
                background: !tagInput.trim() ? '#e5e7eb' : '#6b7280',
                color: !tagInput.trim() ? '#9ca3af' : '#ffffff',
                border: 'none',
                borderRadius: '6px',
                cursor: !tagInput.trim() ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              添加
            </button>
          </div>
          {tags.length > 0 && (
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '6px',
              padding: '8px',
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '6px'
            }}>
              {tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    background: isDark ? '#1e3a5f' : '#e0f2fe',
                    color: isDark ? '#60a5fa' : '#0369a1',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    border: isDark ? '1px solid #334155' : '1px solid #bae6fd'
                  }}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleDeleteTag(tag)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: isDark ? '#60a5fa' : '#0369a1',
                      cursor: 'pointer',
                      padding: '0 2px',
                      fontSize: '1rem',
                      lineHeight: '1',
                      fontWeight: 'bold'
                    }}
                    title="删除标签"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          {tags.length === 0 && (
            <div style={{ 
              fontSize: '0.875rem', 
              color: isDark ? '#9ca3af' : '#9ca3af',
              fontStyle: 'italic'
            }}>
              暂无标签
            </div>
          )}
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ margin: 0 }}>小说文本</label>
            <span style={{ fontSize: '0.8rem', color: isDark ? '#9ca3af' : '#6b7280' }}>
              {text.replace(/\s/g, '').length} 字
            </span>
          </div>
          <div style={{ 
            marginBottom: '6px', 
            padding: '6px 10px', 
            background: isDark ? '#1e293b' : '#f0f9ff',
            border: `1px solid ${isDark ? '#334155' : '#bae6fd'}`,
            borderRadius: '4px',
            fontSize: '0.8rem',
            color: isDark ? '#94a3b8' : '#0369a1'
          }}>
            提示：查看左侧"脚本助手"了解所有可用的语法（Markdown、角色对话、变量、游戏模组等）
          </div>
          <textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="输入小说内容，支持 **粗体** *斜体* [color=red]彩色[/color] [[选项文本]] @角色名：对话 等格式..."
            rows={15}
          />
          <div style={{ marginTop: '12px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px',
              fontSize: '0.9rem',
              fontWeight: '500',
              color: isDark ? '#cbd5e1' : '#374151'
            }}>
              打字机速度：{typewriterSpeed === 0 ? '关闭' : `${typewriterSpeed}ms/字`}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={typewriterSpeed}
              onChange={(e) => setTypewriterSpeed(parseInt(e.target.value))}
              style={{
                width: '100%',
                cursor: 'pointer'
              }}
            />
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '0.75rem', 
              color: isDark ? '#9ca3af' : '#6b7280',
              marginTop: '4px'
            }}>
              <span>关闭</span>
              <span>快速</span>
              <span>中速</span>
              <span>慢速</span>
            </div>
          </div>
        </div>

        <div className="form-group">
          <div className="label-with-button">
            <label>选项列表</label>
            <button className="btn-add-choice" onClick={addChoice}>
              + 添加选项
            </button>
          </div>
          {choices.map((choice, index) => {
            const choiceData = choice as any;
            const choiceScripts = choiceData.pluginData?.['blockly.scripts'] || {};
            
            return (
              <div key={choice.id} style={{ marginBottom: '16px' }}>
                <div className="choice-edit" style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={choice.text}
                    onChange={(e) => updateChoice(index, e.target.value)}
                    placeholder={`选项 ${index + 1}`}
                    style={{ flex: 1 }}
                  />
                  <button 
                    className={`btn-delete ${deleteConfirmIndex === index ? 'btn-danger-confirm' : ''}`}
                    onClick={() => handleDeleteChoiceClick(index)}
                    disabled={choices.length <= 1}
                    title={deleteConfirmIndex === index ? '确认删除？' : '删除选项'}
                  >
                    {deleteConfirmIndex === index ? '确认？' : '×'}
                  </button>
                </div>
                
                {/* 选项脚本设置按钮 */}
                <div style={{ 
                  display: 'flex', 
                  gap: '6px', 
                  marginTop: '6px',
                  marginLeft: '4px'
                }}>
                  <button
                    type="button"
                    onClick={() => setEditingScript({ 
                      type: 'choice-condition', 
                      choiceIndex: index,
                      currentState: choiceScripts.condition 
                    })}
                    className="btn btn-secondary btn-small"
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.75rem'
                    }}
                    title="设置此选项的显示条件"
                  >
                    {choiceScripts.condition ? '显示条件' : '+ 显示条件'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingScript({ 
                      type: 'choice-select', 
                      choiceIndex: index,
                      currentState: choiceScripts.onSelect 
                    })}
                    className="btn btn-secondary btn-small"
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.75rem'
                    }}
                    title="设置选择此选项时执行的脚本"
                  >
                    {choiceScripts.onSelect ? '选择时执行' : '+ 选择时执行'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {isVisualNovelMode && (
        <>
        <div className="form-group">
          <label>背景图（可选）</label>
          {nodeImage ? (
            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              padding: '12px',
              background: '#f9fafb'
            }}>
              <img 
                src={`${config.api.baseURL.replace('/api', '')}/userdata/${encodeURIComponent(localStorage.getItem('username') || '')}/${nodeImage.imagePath}`}
                alt={nodeImage.fileName}
                style={{
                  width: '100%',
                  maxHeight: '200px',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  marginBottom: '8px'
                }}
              />
              <div style={{ fontSize: '0.875rem', color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '8px' }}>
                <div><strong>文件名：</strong>{nodeImage.fileName}</div>
                <div><strong>大小：</strong>{formatFileSize(nodeImage.fileSize)}</div>
                <div><strong>格式：</strong>{nodeImage.originalFormat.toUpperCase()}</div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: isDark ? '#cbd5e1' : '#374151'
                }}>
                  场景名称（可选）
                </label>
                <input
                  type="text"
                  value={nodeImage.sceneName || ''}
                  onChange={(e) => {
                    const newImage = { ...nodeImage, sceneName: e.target.value };
                    setNodeImage(newImage);
                  }}
                  placeholder="不填则使用节点文本前8个字"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '0.875rem',
                    border: `1px solid var(--theme-border)`,
                    borderRadius: '4px',
                    background: 'var(--theme-background-primary)',
                    color: 'var(--theme-text-primary)',
                    marginBottom: '12px'
                  }}
                  maxLength={20}
                />
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: isDark ? '#9ca3af' : '#6b7280',
                  marginBottom: '12px',
                  lineHeight: '1.4'
                }}>
                  热点图片模式下，此名称会显示在玩家的世界地图中
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: isDark ? '#cbd5e1' : '#374151'
                }}>
                  背景位置
                </label>
                <select
                  value={nodeImage.position || 'center'}
                  onChange={(e) => {
                    const newImage = { ...nodeImage, position: e.target.value as any };
                    setNodeImage(newImage);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '0.875rem',
                    border: `1px solid var(--theme-border)`,
                    borderRadius: '4px',
                    background: 'var(--theme-background-primary)',
                    color: 'var(--theme-text-primary)'
                  }}
                >
                  <option value="center">居中（默认）</option>
                  <option value="top">顶部</option>
                  <option value="bottom">底部</option>
                  <option value="left">左侧</option>
                  <option value="right">右侧</option>
                  <option value="top left">左上角</option>
                  <option value="top right">右上角</option>
                  <option value="bottom left">左下角</option>
                  <option value="bottom right">右下角</option>
                </select>
              </div>
              <div style={{ 
                display: 'flex', 
                gap: '8px',
                flexWrap: 'nowrap',
                width: '100%'
              }}>
                <button 
                  type="button"
                  className="btn btn-secondary btn-small" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {uploading ? '处理中...' : '更换图片'}
                </button>
                <button 
                  type="button"
                  className="btn btn-danger btn-small" 
                  onClick={handleDeleteImage}
                  disabled={uploading}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  删除图片
                </button>
                <button 
                  type="button"
                  className={`btn ${editingHotspots ? 'btn-success' : 'btn-info'} btn-small`}
                  onClick={() => setEditingHotspots(!editingHotspots)}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {editingHotspots ? '完成编辑' : (hotspots.length > 0 ? `编辑热区 (${hotspots.length})` : '编辑热区')}
                </button>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #d1d5db',
                borderRadius: '6px',
                padding: '32px',
                textAlign: 'center',
                cursor: 'pointer',
                background: '#f9fafb',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ color: isDark ? '#cbd5e1' : '#374151', marginBottom: '4px' }}>点击上传配图</div>
              <div style={{ fontSize: '0.875rem', color: isDark ? '#9ca3af' : '#9ca3af' }}>
                支持 JPG、PNG、WebP、GIF，最大 10MB
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </div>

        {editingHotspots && nodeImage && (
          <div className="form-group">
            <label>图片热区管理</label>
            
            {/* 热区列表 */}
            <div style={{
              marginBottom: '12px',
              padding: '12px',
              background: isDark ? '#1e293b' : '#f9fafb',
              border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
              borderRadius: '6px'
            }}>
              <div style={{ 
                fontWeight: '600', 
                marginBottom: '8px',
                color: isDark ? '#cbd5e1' : '#374151',
                fontSize: '0.9rem'
              }}>
                热区列表 ({hotspots.length})
              </div>
              
              {hotspots.length === 0 ? (
                <div style={{ 
                  color: isDark ? '#9ca3af' : '#6b7280',
                  fontSize: '0.85rem',
                  fontStyle: 'italic'
                }}>
                  暂无热区，点击下方按钮开始添加
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {hotspots.map((hotspot) => {
                    const targetNode = allNodes.find(n => n.id === hotspot.targetNodeId);
                    const nodeLabel = targetNode ? `节点${targetNode.data.nodeId}` : '节点已删除';
                    const nodeText = targetNode?.data.text.substring(0, 20) || '';
                    
                    return (
                      <div
                        key={hotspot.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px',
                          background: isDark ? '#0f172a' : '#ffffff',
                          border: `1px solid ${isDark ? '#1e293b' : '#e5e7eb'}`,
                          borderRadius: '4px'
                        }}
                      >
                        <div style={{ 
                          width: '8px', 
                          height: '8px', 
                          borderRadius: '50%', 
                          background: 'var(--theme-info)',
                          flexShrink: 0
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ 
                            fontWeight: '500',
                            color: isDark ? '#e2e8f0' : '#1f2937',
                            fontSize: '0.875rem',
                            marginBottom: '2px'
                          }}>
                            {hotspot.label}
                          </div>
                          <div style={{ 
                            fontSize: '0.75rem',
                            color: isDark ? '#94a3b8' : '#6b7280'
                          }}>
                            → {nodeLabel}{nodeText ? ` - ${nodeText}...` : ''}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (deleteHotspotConfirm === hotspot.id) {
                              setHotspots(hotspots.filter(h => h.id !== hotspot.id));
                              setDeleteHotspotConfirm(null);
                            } else {
                              setDeleteHotspotConfirm(hotspot.id);
                            }
                          }}
                          style={{
                            padding: '4px 8px',
                            background: deleteHotspotConfirm === hotspot.id ? '#ef4444' : 'transparent',
                            border: `1px solid ${isDark ? '#475569' : '#d1d5db'}`,
                            borderRadius: '4px',
                            color: deleteHotspotConfirm === hotspot.id ? '#ffffff' : (isDark ? '#ef4444' : '#dc2626'),
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            flexShrink: 0,
                            transition: 'all 0.2s'
                          }}
                        >
                          {deleteHotspotConfirm === hotspot.id ? '确认删除？' : '删除'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* 添加热区表单 */}
            {hotspotForm.show && (
              <div style={{
                marginBottom: '12px',
                padding: '12px',
                background: isDark ? '#1e3a5f' : '#e0f2fe',
                border: `2px solid ${isDark ? '#3b82f6' : '#3b82f6'}`,
                borderRadius: '6px'
              }}>
                <div style={{ 
                  fontWeight: '600', 
                  marginBottom: '12px',
                  color: isDark ? '#60a5fa' : '#0369a1',
                  fontSize: '0.9rem'
                }}>
                  新建热区
                </div>
                
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '4px',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    color: isDark ? '#cbd5e1' : '#374151'
                  }}>
                    标签文本
                  </label>
                  <input
                    type="text"
                    value={hotspotForm.label}
                    onChange={(e) => setHotspotForm({ ...hotspotForm, label: e.target.value })}
                    placeholder="如：打开门、查看窗户"
                    style={{
                      width: '100%',
                      padding: '8px',
                      fontSize: '0.875rem',
                      border: `1px solid ${isDark ? '#475569' : '#d1d5db'}`,
                      borderRadius: '4px',
                      background: isDark ? '#0f172a' : '#ffffff',
                      color: isDark ? '#e2e8f0' : '#1f2937'
                    }}
                    autoFocus
                  />
                </div>
                
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '4px',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    color: isDark ? '#cbd5e1' : '#374151'
                  }}>
                    目标节点
                  </label>
                  <select
                    value={hotspotForm.targetNodeId}
                    onChange={(e) => setHotspotForm({ ...hotspotForm, targetNodeId: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      fontSize: '0.875rem',
                      border: `1px solid ${isDark ? '#475569' : '#d1d5db'}`,
                      borderRadius: '4px',
                      background: isDark ? '#0f172a' : '#ffffff',
                      color: isDark ? '#e2e8f0' : '#1f2937'
                    }}
                  >
                    <option value="">请选择目标节点</option>
                    {allNodes
                      .filter(n => n.id !== node.id)
                      .map(n => (
                        <option key={n.id} value={n.id}>
                          节点{n.data.nodeId} - {n.data.text.substring(0, 30)}{n.data.text.length > 30 ? '...' : ''}
                        </option>
                      ))
                    }
                  </select>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (!hotspotForm.label.trim()) {
                        alert('请输入标签文本');
                        return;
                      }
                      if (!hotspotForm.targetNodeId) {
                        alert('请选择目标节点');
                        return;
                      }
                      
                      const newHotspot: Hotspot = {
                        id: `hotspot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        targetNodeId: hotspotForm.targetNodeId,
                        label: hotspotForm.label.trim(),
                        x: hotspotForm.rect!.x,
                        y: hotspotForm.rect!.y,
                        width: hotspotForm.rect!.width,
                        height: hotspotForm.rect!.height
                      };
                      
                      setHotspots([...hotspots, newHotspot]);
                      setHotspotForm({ show: false, rect: null, label: '', targetNodeId: '' });
                    }}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: 'var(--theme-brand-primary)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                  >
                    确定
                  </button>
                  <button
                    type="button"
                    onClick={() => setHotspotForm({ show: false, rect: null, label: '', targetNodeId: '' })}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: isDark ? '#475569' : '#e5e7eb',
                      color: isDark ? '#e2e8f0' : '#374151',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}
                  >
                    取消
                  </button>
                </div>
              </div>
            )}
            
            {/* 图片热区编辑器 */}
            <HotspotEditor
              imageUrl={`${config.api.baseURL.replace('/api', '')}/userdata/${encodeURIComponent(localStorage.getItem('username') || '')}/${nodeImage.imagePath}`}
              hotspots={hotspots}
              onFinishDrawing={(rect) => {
                if (allNodes.filter(n => n.id !== node.id).length === 0) {
                  alert('没有可用的目标节点，请先创建其他节点');
                  return;
                }
                setHotspotForm({
                  show: true,
                  rect,
                  label: '',
                  targetNodeId: ''
                });
              }}
              isDark={isDark}
            />
          </div>
        )}

        <div className="form-group">
          <label>角色立绘（可选）</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            {(['left', 'center', 'right'] as const).map((position) => {
              const positionLabel = position === 'left' ? '左侧' : position === 'center' ? '中间' : '右侧';
              const image = characterImages[position];
              
              return (
                <div key={position}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px', textAlign: 'center', color: isDark ? '#cbd5e1' : '#374151' }}>
                    {positionLabel}
                  </div>
                  {image ? (
                    <div style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      padding: '8px',
                      background: '#f9fafb'
                    }}>
                      <img 
                        src={`${config.api.baseURL.replace('/api', '')}/userdata/${encodeURIComponent(localStorage.getItem('username') || '')}/${image.imagePath}`}
                        alt={`${positionLabel}立绘`}
                        style={{
                          width: '100%',
                          maxHeight: '120px',
                          objectFit: 'contain',
                          borderRadius: '4px',
                          marginBottom: '6px'
                        }}
                      />
                      <div style={{ fontSize: '0.75rem', color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '6px', wordBreak: 'break-all' }}>
                        {image.fileName}
                      </div>
                      <div style={{ marginBottom: '6px' }}>
                        <label style={{ 
                          display: 'block', 
                          fontSize: '0.7rem', 
                          color: isDark ? '#9ca3af' : '#6b7280',
                          marginBottom: '4px',
                          textAlign: 'center'
                        }}>
                          缩放: {(image.scale || 1.0).toFixed(1)}x
                        </label>
                        <input
                          type="range"
                          min="0.1"
                          max="3.0"
                          step="0.1"
                          value={image.scale || 1.0}
                          onChange={(e) => {
                            const newScale = parseFloat(e.target.value);
                            setCharacterImages({
                              ...characterImages,
                              [position]: { ...image, scale: newScale }
                            });
                          }}
                          style={{
                            width: '100%',
                            cursor: 'pointer'
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <button 
                          type="button"
                          onClick={() => characterFileInputRefs[position].current?.click()}
                          disabled={uploadingCharacter === position}
                          style={{
                            padding: '4px 8px',
                            fontSize: '0.75rem',
                            background: '#6b7280',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: uploadingCharacter === position ? 'not-allowed' : 'pointer',
                            opacity: uploadingCharacter === position ? 0.6 : 1
                          }}
                        >
                          {uploadingCharacter === position ? '处理中...' : '更换'}
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleDeleteCharacterImage(position)}
                          disabled={uploadingCharacter === position}
                          style={{
                            padding: '4px 8px',
                            fontSize: '0.75rem',
                            background: '#dc2626',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: uploadingCharacter === position ? 'not-allowed' : 'pointer',
                            opacity: uploadingCharacter === position ? 0.6 : 1
                          }}
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => characterFileInputRefs[position].current?.click()}
                      style={{
                        border: '2px dashed #d1d5db',
                        borderRadius: '6px',
                        padding: '20px 8px',
                        textAlign: 'center',
                        cursor: uploadingCharacter === position ? 'not-allowed' : 'pointer',
                        background: '#f9fafb',
                        minHeight: '120px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: uploadingCharacter === position ? 0.6 : 1
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', color: isDark ? '#9ca3af' : '#9ca3af' }}>
                        {uploadingCharacter === position ? '处理中...' : '点击上传'}
                      </div>
                    </div>
                  )}
                  <input
                    ref={characterFileInputRefs[position]}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleCharacterImageUpload(e, position)}
                    style={{ display: 'none' }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        </>
        )}

        {/* 节点脚本设置（Blockly） */}
        <details 
          style={{
            marginTop: '24px',
            padding: '16px',
            background: isDark ? '#1e293b' : '#f0f9ff',
            border: `1px solid ${isDark ? '#334155' : '#bae6fd'}`,
            borderRadius: '8px',
            color: isDark ? '#e2e8f0' : '#0c4a6e'
          }}
        >
          <summary style={{ 
            cursor: 'pointer', 
            fontWeight: '600', 
            color: isDark ? '#94a3b8' : '#0369a1',
            fontSize: '0.95rem',
            userSelect: 'none'
          }}>
            节点脚本设置
          </summary>
          
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setEditingScript({ type: 'node-enter', currentState: nodeScripts.onEnter })}
                className="btn btn-secondary"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  fontSize: '0.875rem'
                }}
              >
                {nodeScripts.onEnter ? '进入节点时' : '+ 进入节点时'}
              </button>
              <button
                type="button"
                onClick={() => setEditingScript({ type: 'node-leave', currentState: nodeScripts.onLeave })}
                className="btn btn-secondary"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  fontSize: '0.875rem'
                }}
              >
                {nodeScripts.onLeave ? '离开节点时' : '+ 离开节点时'}
              </button>
            </div>
          </div>
        </details>

        <details 
          open={showPreview}
          onToggle={(e) => setShowPreview((e.target as HTMLDetailsElement).open)}
          style={{
            marginTop: '24px',
            padding: '16px',
            background: isDark ? '#1e293b' : '#f0f9ff',
            border: `1px solid ${isDark ? '#334155' : '#bae6fd'}`,
            borderRadius: '8px'
          }}
        >
          <summary style={{ 
            cursor: 'pointer', 
            fontWeight: '600', 
            color: isDark ? '#94a3b8' : '#0369a1',
            fontSize: '0.95rem',
            userSelect: 'none',
            marginBottom: showPreview ? '16px' : '0'
          }}>
            实时预览
          </summary>
          
          <div 
            style={{
              padding: '16px',
              background: isDark ? '#0f172a' : '#ffffff',
              border: `1px solid ${isDark ? '#1e293b' : '#e5e7eb'}`,
              borderRadius: '6px',
              minHeight: '200px',
              maxHeight: '400px',
              overflow: 'auto',
              color: isDark ? '#e2e8f0' : '#1f2937',
              lineHeight: '1.6'
            }}
            dangerouslySetInnerHTML={{ __html: renderedHTML }}
          />
        </details>
        </div>
      </DraggableWindow>

      {/* Blockly 编辑器可拖动窗口 */}
      {editingScript && (
        <DraggableWindow
          title={
            editingScript.type === 'node-enter' ? '进入节点时执行' :
            editingScript.type === 'node-leave' ? '离开节点时执行' :
            editingScript.type === 'choice-condition' ? '选项显示条件' :
            '选择时执行'
          }
          onClose={() => {
            setEditingScript(null);
            setDeleteScriptConfirm(false);
          }}
          width={650}
          maxHeight="85vh"
          defaultPosition={{ x: (window.innerWidth - 650) / 2, y: 50 }}
          zIndex={1100}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
            {/* 使用提示 */}
            <div style={{
              padding: '10px 14px',
              background: isDark ? '#1e3a5f' : '#e0f2fe',
              border: `1px solid ${isDark ? '#334155' : '#bae6fd'}`,
              borderRadius: '6px',
              fontSize: '0.8rem',
              color: isDark ? '#94a3b8' : '#0369a1',
              lineHeight: '1.5'
            }}>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>变量使用说明</div>
              <div>
                • <strong>全局变量</strong>：在左侧栏"变量"面板中创建，所有节点共享<br/>
                • 在 Blockly 中从"故事变量"类别的下拉列表中选择使用<br/>
                • 用于管理游戏状态
              </div>
            </div>
            
            <BlocklyEditor
              key={`blockly-${editingScript.type}-${globalVariables.length}`}
              initialState={editingScript.currentState}
              globalVariables={globalVariables}
              onChange={(newState) => {
                if (editingScript.type === 'node-enter') {
                  setNodeScripts({ ...nodeScripts, onEnter: newState });
                } else if (editingScript.type === 'node-leave') {
                  setNodeScripts({ ...nodeScripts, onLeave: newState });
                } else if (editingScript.type === 'choice-condition' || editingScript.type === 'choice-select') {
                  // 更新选项脚本
                  const choiceIndex = editingScript.choiceIndex!;
                  const updatedChoices = [...choices];
                  const choiceData = updatedChoices[choiceIndex] as any;
                  
                  if (!choiceData.pluginData) {
                    choiceData.pluginData = {};
                  }
                  if (!choiceData.pluginData['blockly.scripts']) {
                    choiceData.pluginData['blockly.scripts'] = {};
                  }
                  
                  if (editingScript.type === 'choice-condition') {
                    choiceData.pluginData['blockly.scripts'].condition = newState;
                  } else {
                    choiceData.pluginData['blockly.scripts'].onSelect = newState;
                  }
                  
                  setChoices(updatedChoices);
                }
              }}
              height={450}
            />
            
            {/* 操作按钮 */}
            <div style={{
              display: 'flex',
              gap: '12px',
              paddingTop: '12px',
              borderTop: `1px solid ${isDark ? '#333' : '#e5e7eb'}`
            }}>
              <button
                onClick={() => {
                  if (deleteScriptConfirm) {
                    // 第二次点击，确认删除
                    if (editingScript.type === 'node-enter') {
                      setNodeScripts({ ...nodeScripts, onEnter: undefined });
                    } else if (editingScript.type === 'node-leave') {
                      setNodeScripts({ ...nodeScripts, onLeave: undefined });
                    } else if (editingScript.type === 'choice-condition' || editingScript.type === 'choice-select') {
                      const choiceIndex = editingScript.choiceIndex!;
                      const updatedChoices = [...choices];
                      const choiceData = updatedChoices[choiceIndex] as any;
                      
                      if (choiceData.pluginData?.['blockly.scripts']) {
                        if (editingScript.type === 'choice-condition') {
                          delete choiceData.pluginData['blockly.scripts'].condition;
                        } else {
                          delete choiceData.pluginData['blockly.scripts'].onSelect;
                        }
                      }
                      
                      setChoices(updatedChoices);
                    }
                    setDeleteScriptConfirm(false);
                    setEditingScript(null);
                  } else {
                    // 第一次点击，显示确认状态
                    setDeleteScriptConfirm(true);
                  }
                }}
                className={`btn ${deleteScriptConfirm ? 'btn-danger-confirm' : 'btn-danger'}`}
                style={{
                  flex: 1,
                  padding: '10px 20px',
                  fontSize: '0.95rem'
                }}
              >
                {deleteScriptConfirm ? '确认删除？' : '删除脚本'}
              </button>
            </div>
          </div>
        </DraggableWindow>
      )}
    </>
  );
});

export default NodeEditPanel;
