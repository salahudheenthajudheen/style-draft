import React from 'react';
import { DesignRecommendation } from '../types';

interface RecommendationCardProps {
  recommendation: DesignRecommendation;
  onSave?: (rec: DesignRecommendation) => void;
  isSaved?: boolean;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onSave,
  isSaved
}) => {
  return (
    <div className="design-card slide-up">
      <div className="design-card-img">
        {recommendation.imageUrl ? (
          <img src={recommendation.imageUrl} alt={recommendation.title} />
        ) : (
          <div style={{ color: '#999', padding: '2rem', textAlign: 'center' }}>
            Image not available
          </div>
        )}
      </div>
      <div className="design-card-content">
        <h4>{recommendation.title}</h4>
        <p>{recommendation.description}</p>
        <button
          className={`save-design-btn ${isSaved ? 'saved' : ''}`}
          onClick={() => onSave?.(recommendation)}
        >
          <span className="icon">{isSaved ? '✓' : '🔖'}</span>
          {isSaved ? 'Saved' : 'Save Design'}
        </button>
      </div>
    </div>
  );
};