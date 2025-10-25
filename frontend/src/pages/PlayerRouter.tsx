/**
 * 播放器路由组件
 * 职责：根据故事的displayMode选择对应的播放器
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Player from './Player.tsx';
import VisualNovelPlayer from './VisualNovelPlayer.tsx';
import Loading from '../components/ui/Loading.tsx';
import api from '../services/api.ts';
import { guestStorage } from '../services/GuestStorage.ts';
import notification from '../utils/notification.ts';
import type { Story } from '../../../shared/types/index.ts';

function PlayerRouter(): JSX.Element {
  const { id, username, gameId } = useParams<{ id?: string; username?: string; gameId?: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadStory();
  }, [id, username, gameId]);

  async function loadStory(): Promise<void> {
    try {
      let loadedStory: Story;
      let imageOwner: string; // 图片所有者（用于构建图片URL）
      
      if (username && gameId) {
        // 发布作品：图片在作品作者目录
        loadedStory = await api.publish.getPublished(username, gameId);
        imageOwner = username;
      } else if (id) {
        const currentUsername = localStorage.getItem('username');
        
        if (currentUsername) {
          // 草稿：图片在当前登录用户目录
          loadedStory = await api.drafts.getById(id);
          imageOwner = currentUsername;
        } else {
          // 游客模式：没有图片
          const guestStory = guestStorage.getById(id);
          if (!guestStory) {
            throw new Error('游客故事不存在');
          }
          loadedStory = guestStory;
          imageOwner = '';
        }
      } else {
        throw new Error('无效的游戏参数');
      }
      
      // 将imageOwner附加到story对象（用于播放器构建图片URL）
      (loadedStory as any)._imageOwner = imageOwner;
      
      setStory(loadedStory);
      setLoading(false);
    } catch (error) {
      console.error('加载故事失败:', error);
      notification.error('加载故事失败');
      setTimeout(() => navigate('/app'), 2000);
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading fullScreen message="加载故事中..." />;
  }

  if (!story) {
    return <Loading fullScreen message="故事不存在" />;
  }

  const displayMode = story.meta.displayMode || 'terminal';
  
  if (displayMode === 'visual-novel') {
    return <VisualNovelPlayer story={story} />;
  }
  
  return <Player />;
}

export default PlayerRouter;

