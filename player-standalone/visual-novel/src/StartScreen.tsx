import type { Story } from '@frontend/types/index';

interface StartScreenProps {
  story: Story;
  hasSaveData: boolean;
  onStartGame: () => void;
  onContinueGame: () => void;
}

function StartScreen({ story, hasSaveData, onStartGame, onContinueGame }: StartScreenProps): JSX.Element {
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const description = truncateText(story.meta.description || '', 200);

  return (
    <div className="start-screen">
      <div className="start-screen-content">
        <h1 className="start-screen-title">{story.meta.title}</h1>
        <div className="start-screen-author">{story.meta.author}</div>
        
        {description && (
          <div className="start-screen-description">{description}</div>
        )}
        
        <div className="start-screen-buttons">
          <button onClick={onStartGame}>开始游戏</button>
          {hasSaveData && (
            <button onClick={onContinueGame}>继续游戏</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default StartScreen;

