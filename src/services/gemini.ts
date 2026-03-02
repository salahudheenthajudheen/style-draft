import { GoogleGenAI, Type } from "@google/genai";
import { UserInputs, DesignRecommendation } from "../types";

const getApiKey = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.warn('GEMINI_API_KEY is not set. AI features will not work.');
  }
  return key || '';
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export async function generateRecommendations(inputs: UserInputs): Promise<DesignRecommendation[]> {
  const prompt = `As a professional fashion designer, suggest 3 unique 2D draft layout options for a ${inputs.outfitType} based on the following details:
  - Fabric: ${inputs.fabricType}
  - Color: ${inputs.color}
  - Material Length: ${inputs.materialLength}
  - Body Type: ${inputs.bodyType}
  - Height: ${inputs.height}
  - Occasion: ${inputs.occasion}

  For each recommendation, provide:
  1. A catchy title.
  2. A detailed description.
  3. Neck design (if applicable).
  4. Sleeve pattern (if applicable).
  5. Garment cut.
  6. Layout style.
  7. Why it's trending for this occasion.
  8. A simplified SVG path representation for a 2D draft layout.

  Return the response as a JSON array of objects.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            neckDesign: { type: Type.STRING },
            sleevePattern: { type: Type.STRING },
            garmentCut: { type: Type.STRING },
            layoutStyle: { type: Type.STRING },
            trendingNotes: { type: Type.STRING },
            svgLayout: { type: Type.STRING },
          },
          required: ["title", "description", "garmentCut", "layoutStyle", "trendingNotes", "svgLayout"],
        },
      },
    },
  });

  const recommendations = JSON.parse(response.text || "[]");

  // ==================== ULTRA STRONG PROMPT FOR PERFECT TECHNICAL FASHION DRAWINGS ====================
  // We also PRE-FETCH the images so they're in the browser cache before the UI shows them.
  const recommendationsWithImages = await Promise.all(
    recommendations.map(async (rec: any, index: number) => {
      try {
        const imagePrompt = `Clean 2D technical fashion flat drawing of a ${inputs.outfitType} specifically for a ${inputs.bodyType} body type. Style: Professional tailor blueprint on a featureless white mannequin croquis. Details: ${rec.title}, focus on the ${rec.garmentCut} and ${rec.layoutStyle}. Material: SOLID ${inputs.color.toUpperCase()} ${inputs.fabricType.toUpperCase()}. Features: The garment is entirely ${inputs.color.toUpperCase()}, precise black outlines, minimal shading, visible seam allowances, and grainline indicators. Constraints: Pure white background, no photo realism, no human features, no scenery, no landscape, no complex lighting, no artistic sketches, strictly informative and technical.`;

        const pollinationsKey = import.meta.env.VITE_POLLINATIONS_API_KEY || '';
        const encodedPrompt = encodeURIComponent(imagePrompt);

        // Increased seed variance for better diversity and to avoid model fatigue on same prompt
        const seedValue = Math.floor(Math.random() * 1000000) + (index * 1000);
        const imageUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?width=800&height=1050&model=flux&seed=${seedValue}&enhance=true&nologo=true&safe=true${pollinationsKey ? `&key=${pollinationsKey}` : ''}`;

        return {
          ...rec,
          id: `rec-${Date.now()}-${index}`,
          imageUrl,
        };
      } catch (error) {
        console.error("Image generation failed:", error);
        return {
          ...rec,
          id: `rec-${Date.now()}-${index}`,
          imageUrl: 'https://picsum.photos/id/1015/800/1050',
        };
      }
    })
  );

  return recommendationsWithImages;
}