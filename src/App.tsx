import React from 'react';
import { DesignForm } from './components/DesignForm';
import { RecommendationCard } from './components/RecommendationCard';
import { UserInputs, DesignRecommendation, SavedDesign } from './types';
import { generateRecommendations } from './services/gemini';
import { Scissors, Sparkles, History, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [recommendations, setRecommendations] = React.useState<DesignRecommendation[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [savedDesigns, setSavedDesigns] = React.useState<SavedDesign[]>([]);
  const [showHistory, setShowHistory] = React.useState(false);
  const [currentInputs, setCurrentInputs] = React.useState<UserInputs | null>(null);

  React.useEffect(() => {
    const saved = localStorage.getItem('style-draft-saved');
    if (saved) setSavedDesigns(JSON.parse(saved));
  }, []);

  const handleDesignSubmit = async (inputs: UserInputs) => {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is not set. Text recommendations will not work.');
    }
    setIsLoading(true);
    setCurrentInputs(inputs);
    try {
      const results = await generateRecommendations(inputs);
      setRecommendations(results);
      // Scroll to results with a slight delay for DOM update
      setTimeout(() => {
        const resultsEl = document.getElementById('results');
        if (resultsEl) {
          window.scrollTo({ top: resultsEl.offsetTop - 80, behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      console.error('Failed to generate designs:', error);
      alert('Something went wrong. Please check your Gemini API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = (rec: DesignRecommendation) => {
    if (!currentInputs) return;

    const isAlreadySaved = savedDesigns.some(d => d.id === rec.id);
    if (isAlreadySaved) {
      const updated = savedDesigns.filter(d => d.id !== rec.id);
      setSavedDesigns(updated);
      localStorage.setItem('style-draft-saved', JSON.stringify(updated));
      return;
    }

    const newSaved: SavedDesign = {
      ...rec,
      inputs: currentInputs,
      createdAt: Date.now(),
    };
    const updated = [newSaved, ...savedDesigns];
    setSavedDesigns(updated);
    localStorage.setItem('style-draft-saved', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b-2 border-black bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-black p-1.5 rounded-sm">
              <Scissors className="text-white" size={20} />
            </div>
            <span className="font-serif text-xl font-black tracking-tighter">STYLE DRAFT</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-gray-600"
            >
              <History size={18} />
              <span className="hidden sm:inline">My Designs</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-black text-white py-20 px-4 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold mb-6 backdrop-blur-sm">
                <Sparkles size={14} className="text-yellow-400" />
                AI-POWERED FASHION DESIGNER
              </div>
              <h1 className="text-6xl md:text-8xl font-serif font-bold leading-[0.9] mb-8">
                Your Personal <br />
                <span className="italic text-gray-400">Digital Tailor</span>
              </h1>
              <p className="text-lg text-gray-400 font-medium max-w-lg">
                Input your fabric details and body type. Our AI generates professional 2D draft layouts and trending style recommendations tailored just for you.
              </p>
            </motion.div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
            <div className="w-full h-full border-l border-white/20 grid grid-cols-4 grid-rows-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="border-r border-b border-white/10" />
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Column */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <div className="mb-8">
                <h2 className="text-3xl font-serif font-bold mb-2">Design Parameters</h2>
                <p className="text-gray-500 text-sm">Tell us about your material and preferences.</p>
              </div>
              <DesignForm onSubmit={handleDesignSubmit} isLoading={isLoading} />
            </div>
          </div>

          {/* Results Column */}
          <div id="results" className="lg:col-span-7 space-y-8">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
                <p className="font-mono text-sm uppercase font-bold animate-pulse">Analyzing trends & drafting layouts...</p>
              </div>
            ) : recommendations.length > 0 ? (
              <div className="space-y-8">
                <div className="flex items-end justify-between border-b-2 border-black pb-4">
                  <div>
                    <h2 className="text-3xl font-serif font-bold">Draft Options</h2>
                    <p className="text-gray-500 text-sm">3 unique concepts based on your inputs.</p>
                  </div>
                  <div className="text-[10px] font-mono text-gray-400 uppercase">
                    Generated for: {currentInputs?.occasion}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  {recommendations.map((rec) => (
                    <RecommendationCard
                      key={rec.id}
                      recommendation={rec}
                      onSave={handleSave}
                      isSaved={savedDesigns.some(d => d.id === rec.id)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center py-20 text-center px-8">
                <div className="bg-gray-100 p-6 rounded-full mb-6">
                  <Scissors size={48} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-serif font-bold mb-2 text-gray-400">No Designs Yet</h3>
                <p className="text-gray-400 text-sm max-w-xs">
                  Fill out the form to generate professional outfit layouts and style suggestions.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-black py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-black p-1.5 rounded-sm">
              <Scissors className="text-white" size={16} />
            </div>
            <span className="font-serif text-lg font-black tracking-tighter uppercase">Style Draft</span>
          </div>
          <div className="text-xs font-mono text-gray-400">
            © 2024 STYLE DRAFT AI. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-6 text-xs font-bold uppercase tracking-widest">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Contact</a>
          </div>
        </div>
      </footer>

      {/* History Sidebar */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[70] border-l-2 border-black flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b-2 border-black flex items-center justify-between">
                <h2 className="text-2xl font-serif font-bold">Saved Designs</h2>
                <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {savedDesigns.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <History size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No saved designs yet.</p>
                  </div>
                ) : (
                  savedDesigns.map((design) => (
                    <div key={design.id} className="border-2 border-black p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif font-bold text-lg">{design.title}</h4>
                        <button
                          onClick={() => handleSave(design)}
                          className="text-red-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="text-[10px] font-mono text-gray-500 flex gap-2">
                        <span>{design.inputs.fabricType}</span>
                        <span>•</span>
                        <span>{design.inputs.occasion}</span>
                      </div>
                      <div className="aspect-video bg-gray-50 border border-black/10 flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full p-2" dangerouslySetInnerHTML={{ __html: design.svgLayout.includes('<svg') ? design.svgLayout : `<svg viewBox="0 0 100 100" class="w-full h-full stroke-black fill-none"><path d="${design.svgLayout}" /></svg>` }} />
                      </div>
                      <button
                        onClick={() => {
                          setRecommendations([design]);
                          setCurrentInputs(design.inputs);
                          setShowHistory(false);
                          window.scrollTo({ top: document.getElementById('results')?.offsetTop, behavior: 'smooth' });
                        }}
                        className="w-full brutal-btn py-2 text-xs"
                      >
                        VIEW DETAILS
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
