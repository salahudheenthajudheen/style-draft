import React from 'react';
import { UserInputs, OutfitType } from '../types';
import { cn } from '../utils';

interface DesignFormProps {
  onSubmit: (inputs: UserInputs) => void;
  isLoading: boolean;
}

export const DesignForm: React.FC<DesignFormProps> = ({ onSubmit, isLoading }) => {
  const [inputs, setInputs] = React.useState<UserInputs>({
    fabricType: '',
    color: '',
    materialLength: '',
    bodyType: '',
    height: '',
    occasion: '',
    outfitType: 'complete',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputs);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Outfit Type</label>
          <div className="flex gap-2">
            {(['top', 'bottom', 'complete'] as OutfitType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setInputs(prev => ({ ...prev, outfitType: type }))}
                className={cn(
                  "flex-1 py-2 text-sm font-bold border-2 border-black transition-all capitalize",
                  inputs.outfitType === type ? "bg-black text-white" : "bg-white text-black hover:bg-gray-50"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Fabric Type</label>
          <input
            required
            name="fabricType"
            value={inputs.fabricType}
            onChange={handleChange}
            placeholder="e.g. Cotton, Silk, Linen"
            className="w-full p-2 border-2 border-black focus:outline-none focus:ring-0"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Color</label>
          <input
            required
            name="color"
            value={inputs.color}
            onChange={handleChange}
            placeholder="e.g. Emerald Green, Pastel Pink"
            className="w-full p-2 border-2 border-black focus:outline-none focus:ring-0"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Material Length</label>
          <input
            required
            name="materialLength"
            value={inputs.materialLength}
            onChange={handleChange}
            placeholder="e.g. 2.5 meters"
            className="w-full p-2 border-2 border-black focus:outline-none focus:ring-0"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Body Type</label>
          <select
            required
            name="bodyType"
            value={inputs.bodyType}
            onChange={handleChange}
            className="w-full p-2 border-2 border-black focus:outline-none focus:ring-0 bg-white"
          >
            <option value="">Select Body Type</option>
            <option value="Hourglass">Hourglass</option>
            <option value="Pear">Pear</option>
            <option value="Apple">Apple</option>
            <option value="Rectangle">Rectangle</option>
            <option value="Inverted Triangle">Inverted Triangle</option>
            <option value="Athletic">Athletic</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Height</label>
          <input
            required
            name="height"
            value={inputs.height}
            onChange={handleChange}
            placeholder="e.g. 5'6 or 168cm"
            className="w-full p-2 border-2 border-black focus:outline-none focus:ring-0"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Occasion</label>
          <input
            required
            name="occasion"
            value={inputs.occasion}
            onChange={handleChange}
            placeholder="e.g. Wedding, Formal Meeting, Casual Brunch"
            className="w-full p-2 border-2 border-black focus:outline-none focus:ring-0"
          />
        </div>
      </div>

      <button
        disabled={isLoading}
        type="submit"
        className="w-full brutal-btn bg-black text-white py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'GENERATING DESIGNS...' : 'DESIGN MY OUTFIT'}
      </button>
    </form>
  );
};
