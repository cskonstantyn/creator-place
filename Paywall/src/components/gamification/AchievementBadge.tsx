import React, { useState, useEffect } from 'react';
import { Achievement } from '@/types';

interface AchievementBadgeProps {
  achievement: Achievement;
  unlocked?: boolean;
  onUnlock?: () => void;
  showDetails?: boolean;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  unlocked = false,
  onUnlock,
  showDetails = false,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [confettiElements, setConfettiElements] = useState<JSX.Element[]>([]);
  
  // Show unlock animation when the achievement is unlocked
  useEffect(() => {
    if (unlocked && onUnlock) {
      setIsAnimating(true);
      generateConfetti();
      onUnlock();
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setConfettiElements([]);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [unlocked, onUnlock]);
  
  // Generate confetti elements for the animation
  const generateConfetti = () => {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    const elements: JSX.Element[] = [];
    
    for (let i = 0; i < 30; i++) {
      const left = `${Math.random() * 100}%`;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const delay = `${Math.random() * 0.5}s`;
      
      elements.push(
        <div
          key={i}
          className="confetti"
          style={{
            left,
            backgroundColor: color,
            animationDelay: delay,
          }}
        />
      );
    }
    
    setConfettiElements(elements);
  };
  
  return (
    <div
      className={`
        achievement-badge relative rounded-lg overflow-hidden shadow-md 
        transition-all duration-300 hover:shadow-lg
        ${unlocked ? 'bg-white border-2 border-green-500' : 'bg-gray-100 border-2 border-gray-300'}
        ${isAnimating ? 'achievement-unlocked' : ''}
      `}
    >
      {isAnimating && confettiElements}
      
      <div className="p-4 flex items-center">
        <div className="flex-shrink-0 mr-4">
          {achievement.image ? (
            <img
              src={achievement.image}
              alt={achievement.name}
              className={`w-16 h-16 rounded-full ${!unlocked && 'grayscale opacity-50'}`}
            />
          ) : (
            <div
              className={`
                w-16 h-16 rounded-full flex items-center justify-center text-2xl
                ${unlocked ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}
              `}
            >
              🏆
            </div>
          )}
        </div>
        
        <div className="flex-grow">
          <h3 className={`font-bold text-lg ${unlocked ? 'text-green-600' : 'text-gray-400'}`}>
            {achievement.name}
          </h3>
          
          {showDetails && (
            <>
              <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
              
              <div className="flex items-center">
                <div className="text-xs text-white font-medium py-1 px-2 rounded-full bg-blue-500 mr-2">
                  +{achievement.points} points
                </div>
                
                {unlocked ? (
                  <span className="text-xs text-green-600 font-medium py-1 px-2 rounded-full bg-green-100">
                    Unlocked
                  </span>
                ) : (
                  <span className="text-xs text-gray-600 font-medium py-1 px-2 rounded-full bg-gray-200">
                    Locked
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementBadge; 