/**
 * 角色管理组件
 * 职责：管理故事中的角色定义
 */

import { useState, useRef } from 'react';
import type { Character, NodeImage } from '../../../shared/types/index.ts';
import { processImageFile, formatFileSize, validateImageFile } from '../utils/imageProcessor.ts';
import api from '../services/api.ts';
import config from '../config/index.ts';

interface CharacterManagerProps {
  characters: Character[];
  onCharactersChange: (characters: Character[]) => void;
  allNodesText?: string[];
}

function CharacterManager({ characters, onCharactersChange, allNodesText = [] }: CharacterManagerProps): JSX.Element {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Partial<Character>>({
    id: '',
    name: '',
    nameColor: '#5bc0de',
    description: '',
    avatar: undefined
  });

  const filteredCharacters = characters.filter(char => 
    char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (char.description && char.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getCharacterUsageCount = (characterName: string): number => {
    return allNodesText.filter(text => {
      const regex = new RegExp(`@${characterName}[：:]`, 'g');
      return regex.test(text);
    }).length;
  };

  const handleEdit = (character: Character) => {
    setIsAdding(false);
    setEditingId(character.id);
    setFormData({ ...character });
  };

  const handleSave = () => {
    if (!formData.name) {
      alert('请输入角色名称');
      return;
    }

    const newId = formData.id || `char_${Date.now()}`;

    const newChar: Character = {
      id: newId,
      name: formData.name,
      nameColor: formData.nameColor || '#5bc0de',
      description: formData.description,
      avatar: formData.avatar
    };

    let updatedChars: Character[];

    if (editingId) {
      updatedChars = characters.map(c => c.id === editingId ? newChar : c);
    } else {
      updatedChars = [...characters, newChar];
    }

    onCharactersChange(updatedChars);

    setIsAdding(false);
    setEditingId(null);
    setFormData({
      id: '',
      name: '',
      nameColor: '#5bc0de',
      description: '',
      avatar: undefined
    });
  };

  const handleDelete = (characterId: string) => {
    if (!confirm('确定要删除这个角色吗？')) {
      return;
    }

    const updatedChars = characters.filter(c => c.id !== characterId);
    onCharactersChange(updatedChars);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      id: '',
      name: '',
      nameColor: '#5bc0de',
      description: '',
      avatar: undefined
    });
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
      
      setFormData({ ...formData, avatar: newImage });
      
    } catch (error) {
      alert('图片上传失败: ' + (error as Error).message);
    } finally {
      setUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleDeleteAvatar = () => {
    setFormData({ ...formData, avatar: undefined });
  };

  const renderCharacterForm = () => (
    <div className="variable-form">
      <div className="variable-form-group">
        <label>角色名称</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="如：爱莉"
        />
      </div>

      <div className="variable-form-group">
        <label>名称颜色</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="color"
            value={formData.nameColor || '#5bc0de'}
            onChange={(e) => setFormData({ ...formData, nameColor: e.target.value })}
            style={{ width: '60px', height: '36px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}
          />
          <input
            type="text"
            value={formData.nameColor || '#5bc0de'}
            onChange={(e) => setFormData({ ...formData, nameColor: e.target.value })}
            placeholder="#5bc0de"
            style={{ flex: 1 }}
          />
        </div>
      </div>

      <div className="variable-form-group">
        <label>角色描述 (可选)</label>
        <input
          type="text"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="角色简介"
        />
      </div>

      <div className="variable-form-group">
        <label>角色头像 (可选)</label>
        {formData.avatar ? (
          <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            padding: '12px',
            background: '#f9fafb'
          }}>
            <img 
              src={`${config.api.baseURL.replace('/api', '')}/userdata/${encodeURIComponent(localStorage.getItem('username') || '')}/${formData.avatar.imagePath}`}
              alt={formData.avatar.fileName}
              style={{
                width: '80px',
                height: '80px',
                objectFit: 'cover',
                borderRadius: '50%',
                marginBottom: '8px',
                display: 'block'
              }}
            />
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '8px' }}>
              {formData.avatar.fileName} ({formatFileSize(formData.avatar.fileSize)})
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  flex: 1,
                  padding: '6px 12px',
                  fontSize: '0.875rem',
                  background: '#6b7280',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  opacity: uploading ? 0.6 : 1
                }}
              >
                {uploading ? '上传中...' : '更换'}
              </button>
              <button 
                type="button"
                onClick={handleDeleteAvatar}
                disabled={uploading}
                style={{
                  flex: 1,
                  padding: '6px 12px',
                  fontSize: '0.875rem',
                  background: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  opacity: uploading ? 0.6 : 1
                }}
              >
                删除
              </button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '2px dashed #d1d5db',
              borderRadius: '6px',
              padding: '24px',
              textAlign: 'center',
              cursor: uploading ? 'not-allowed' : 'pointer',
              background: '#f9fafb'
            }}
          >
            <div style={{ color: '#374151', marginBottom: '4px' }}>
              {uploading ? '上传中...' : '点击上传头像'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              建议尺寸：200x200，支持 JPG/PNG/WebP
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

      <div className="variable-form-actions">
        <button onClick={handleSave} className="btn-variable-save">
          保存
        </button>
        <button onClick={handleCancel} className="btn-variable-cancel">
          取消
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h3 style={{ margin: 0 }}>角色</h3>
        <button 
          onClick={() => setIsAdding(true)}
          style={{
            padding: '6px 12px',
            background: 'var(--theme-brand-gradient)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
        >
          + 添加角色
        </button>
      </div>
      
      {characters.length === 0 && !isAdding && !editingId && (
        <div className="variable-empty-state" style={{ marginBottom: '16px' }}>
          <p style={{ margin: '8px 0' }}>暂无角色</p>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary, #888)', margin: '4px 0' }}>
            点击"添加角色"按钮创建故事角色。<br/>
            可在节点文本中使用角色对话。
          </p>
        </div>
      )}

      <div>
        {(isAdding || editingId) && renderCharacterForm()}

        {characters.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            {characters.length > 3 && !isAdding && !editingId && (
              <input
                type="text"
                placeholder="搜索角色..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  marginBottom: '12px',
                  fontSize: '0.875rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--theme-brand-primary, #FF6D5A)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
              />
            )}
            {filteredCharacters.map((character) => (
              <div key={character.id} className="variable-item">
                <div className="variable-item-header" style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div className="variable-item-info" style={{ width: '100%' }}>
                    <div style={{ marginBottom: '6px' }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        marginBottom: '4px'
                      }}>
                        <span 
                          className="variable-item-name"
                          style={{ color: character.nameColor }}
                        >
                          {character.name}
                        </span>
                      </div>
                    </div>
                    {character.description && (
                      <div className="variable-item-description" style={{ 
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        marginBottom: '6px'
                      }}>
                        {character.description}
                      </div>
                    )}
                    <div className="variable-item-usage" style={{ 
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      marginBottom: '6px'
                    }}>
                      在文本中使用: <code>@{character.name}：对话内容</code>
                    </div>
                    {allNodesText.length > 0 && (
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginBottom: '8px'
                      }}>
                        使用次数: {getCharacterUsageCount(character.name)} 个节点
                      </div>
                    )}
                  </div>
                  <div className="variable-item-actions" style={{ 
                    display: 'flex', 
                    gap: '8px',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                  }}>
                    <button
                      onClick={() => handleEdit(character)}
                      className="btn-variable-edit"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(character.id)}
                      className="btn-variable-delete"
                      title="删除此角色"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredCharacters.length === 0 && characters.length > 0 && searchTerm && (
              <div style={{
                padding: '16px',
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '0.875rem'
              }}>
                未找到匹配的角色
              </div>
            )}
          </div>
        )}

      </div>
    </>
  );
}

export default CharacterManager;


