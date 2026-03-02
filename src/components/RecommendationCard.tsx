import React from 'react';
import { DesignRecommendation } from '../types';
import { Scissors, TrendingUp, Ruler, Layout, Download, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface RecommendationCardProps {
  recommendation: DesignRecommendation;
  onSave?: (rec: DesignRecommendation) => void;
  isSaved?: boolean;
}

const RecommendationImage = ({ url, title }: { url: string; title: string }) => {
  const [isImageLoading, setIsImageLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  return (
    <div className="w-full h-full relative">
      <img
        src={hasError ? 'https://picsum.photos/id/1015/800/1050' : url}
        alt={title}
        className="w-full h-full object-contain p-4 bg-white"
        onLoad={() => setIsImageLoading(false)}
        onError={() => {
          setHasError(true);
          setIsImageLoading(false);
          console.error("Image failed:", url);
        }}
        style={{ opacity: isImageLoading ? 0 : 1, transition: 'opacity 0.3s ease-in-out' }}
      />
      {isImageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onSave,
  isSaved
}) => {
  const [showDraft, setShowDraft] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-2 border-black p-6 space-y-6 flex flex-col h-full"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-serif text-2xl font-bold leading-tight">{recommendation.title}</h3>
        <div className="flex gap-2">
          {onSave && (
            <button
              onClick={() => onSave(recommendation)}
              className={isSaved ? "text-red-500" : "text-gray-400 hover:text-red-500"}
            >
              <Heart className={isSaved ? "fill-current" : ""} size={20} />
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed italic">
        {recommendation.description}
      </p>

      <div className="aspect-[3/4] bg-gray-50 border border-black/10 flex items-center justify-center relative overflow-hidden group">
        {/* Dynamic Label */}
        <div className="absolute top-3 left-3 text-[10px] font-mono text-gray-400 uppercase tracking-widest z-10">
          {showDraft ? '2D DRAFT LAYOUT' : 'AI ILLUSTRATION'}
        </div>

        {/* REAL ILLUSTRATION (used in BOTH views) */}
        {recommendation.imageUrl ? (
          <RecommendationImage
            key={recommendation.imageUrl}
            url={recommendation.imageUrl}
            title={recommendation.title}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-300">
            <Scissors size={48} />
            <span className="text-xs font-mono">Image not available</span>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setShowDraft(!showDraft)}
          className="absolute bottom-3 right-3 bg-black text-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-tighter hover:bg-gray-800 transition-colors z-20"
        >
          {showDraft ? 'VIEW ILLUSTRATION' : 'VIEW 2D DRAFT'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs font-mono">
        {recommendation.neckDesign && (
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-400 uppercase font-bold">
              <Scissors size={12} /> Neck
            </div>
            <div className="font-sans font-bold">{recommendation.neckDesign}</div>
          </div>
        )}
        {recommendation.sleevePattern && (
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-400 uppercase font-bold">
              <Ruler size={12} /> Sleeves
            </div>
            <div className="font-sans font-bold">{recommendation.sleevePattern}</div>
          </div>
        )}
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-gray-400 uppercase font-bold">
            <Layout size={12} /> Cut
          </div>
          <div className="font-sans font-bold">{recommendation.garmentCut}</div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-gray-400 uppercase font-bold">
            <TrendingUp size={12} /> Style
          </div>
          <div className="font-sans font-bold">{recommendation.layoutStyle}</div>
        </div>
      </div>

      <div className="pt-4 border-t border-black/5">
        <div className="text-[10px] font-bold uppercase text-emerald-600 mb-1">Trending Insight</div>
        <p className="text-xs text-gray-500">{recommendation.trendingNotes}</p>
      </div>

      <button className="mt-auto brutal-btn flex items-center justify-center gap-2 text-sm">
        <Download size={16} /> DOWNLOAD DRAFT
      </button>
    </motion.div>
  );
};