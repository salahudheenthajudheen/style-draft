export type OutfitType = 'top' | 'bottom' | 'complete';

export interface UserInputs {
  fabricType: string;
  color: string;
  materialLength: string;
  bodyType: string;
  height: string;
  occasion: string;
  outfitType: OutfitType;
}

export interface DesignRecommendation {
  id: string;
  title: string;
  description: string;
  neckDesign?: string;
  sleevePattern?: string;
  garmentCut: string;
  layoutStyle: string;
  trendingNotes: string;
  svgLayout: string;
  imageUrl?: string;
}

export interface SavedDesign extends DesignRecommendation {
  inputs: UserInputs;
  createdAt: number;
}
