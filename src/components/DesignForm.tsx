import React from 'react';
import { UserInputs } from '../types';

interface DesignFormProps {
  onSubmit: (inputs: UserInputs) => void;
  isLoading: boolean;
}

export const DesignForm: React.FC<DesignFormProps> = ({ onSubmit, isLoading }) => {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const garmentType = (formData.get('garmentType') as string) || 'complete';
    const fabric = (formData.get('fabric') as string) || 'cotton';
    const color = (formData.get('color') as string) || '#8a2be2';
    const occasion = (formData.get('occasion') as string) || 'casual';
    const bodyType = (formData.get('bodyType') as string) || 'hourglass';
    const heightStr = formData.get('height') as string;
    const materialLengthStr = formData.get('materialLength') as string;

    const heightCm = parseFloat(heightStr);
    if (!heightStr || isNaN(heightCm) || heightCm <= 50 || heightCm >= 300) {
      alert('Please enter a valid Height in cm (e.g. 165).');
      return;
    }

    // Calculate required material
    const reqTop = parseFloat((heightCm * 0.010).toFixed(1));
    const reqBottom = parseFloat((heightCm * 0.012).toFixed(1));
    let requiredMaterial = 0;
    if (garmentType === 'top') requiredMaterial = reqTop;
    else if (garmentType === 'bottom') requiredMaterial = reqBottom;
    else requiredMaterial = parseFloat((reqTop + reqBottom).toFixed(1));

    const materialLengthM = parseFloat(materialLengthStr);
    const isMaterialProvided = !isNaN(materialLengthM) && materialLengthM > 0;

    if (isMaterialProvided && materialLengthM < requiredMaterial * 0.8) {
      alert(`Warning: For your height of ${heightCm}cm, a ${garmentType} typically requires at least ${requiredMaterial} meters. Your ${materialLengthM}m might constrain designs.`);
    }

    const inputs: UserInputs = {
      outfitType: garmentType as UserInputs['outfitType'],
      fabricType: fabric,
      color: color,
      occasion: occasion,
      bodyType: bodyType,
      height: heightStr,
      materialLength: isMaterialProvided ? materialLengthStr : `${requiredMaterial}`,
    };

    onSubmit(inputs);
  };

  return (
    <aside className="glass-panel form-panel slide-right">
      <h2>Design Parameters</h2>
      <p className="subtitle">Input details for AI magic.</p>

      <form className="design-form" onSubmit={handleSubmit}>

        <div className="form-section">
          <h3>Basic Requirements</h3>
          <div className="input-group">
            <label htmlFor="garmentType">Garment Type</label>
            <select id="garmentType" name="garmentType" required>
              <option value="complete">Complete Outfit</option>
              <option value="top">Top Only</option>
              <option value="bottom">Bottom Only</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Material &amp; Occasion</h3>
          <div className="input-row">
            <div className="input-group">
              <label htmlFor="fabric">Fabric</label>
              <select id="fabric" name="fabric">
                <option value="cotton">Cotton</option>
                <option value="silk">Silk</option>
                <option value="linen">Linen</option>
                <option value="crepe">Crepe</option>
                <option value="satin">Satin</option>
                <option value="denim">Denim</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="color">Primary Color</label>
              <input type="color" id="color" name="color" defaultValue="#8a2be2" />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="materialLength">Material Length (meters)</label>
            <input
              type="number"
              id="materialLength"
              name="materialLength"
              step="0.1"
              min="0"
              placeholder="Optional (auto-calculated)"
            />
          </div>

          <div className="input-group">
            <label htmlFor="occasion">Occasion</label>
            <select id="occasion" name="occasion" required>
              <option value="casual">Casual / Work</option>
              <option value="party">Party / Evening</option>
              <option value="wedding">Wedding / Festive</option>
              <option value="formal">Business Formal</option>
              <option value="beach">Vacation / Resort</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Body Profile</h3>
          <div className="input-row">
            <div className="input-group">
              <label htmlFor="bodyType">Body Type</label>
              <select id="bodyType" name="bodyType">
                <option value="hourglass">Hourglass</option>
                <option value="pear">Pear</option>
                <option value="apple">Apple</option>
                <option value="rectangle">Rectangle</option>
                <option value="inverted">Inverted Triangle</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="height">Height (cm)</label>
              <input type="number" id="height" name="height" placeholder="e.g. 165" />
            </div>
          </div>
        </div>

        <button type="submit" className="primary-btn glow-effect mt-4" disabled={isLoading}>
          <span>{isLoading ? 'Generating Designs...' : 'Generate Designs'}</span>
          {!isLoading && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          )}
        </button>
      </form>
    </aside>
  );
};
