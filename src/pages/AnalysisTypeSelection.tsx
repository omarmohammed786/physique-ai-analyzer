
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AnalysisTypeSelection = () => {
  const [selectedType, setSelectedType] = useState<'upper-body' | 'full-body'>('full-body');
  const navigate = useNavigate();

  const handleContinue = () => {
    localStorage.setItem('physique-analysis-type', selectedType);
    navigate('/analysis');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Choose Analysis Type
          </h1>
          <p className="text-gray-300 mb-6">
            Select what areas you want to focus on for your physique analysis.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div
            onClick={() => setSelectedType('full-body')}
            className={`bg-black/40 backdrop-blur-sm rounded-2xl p-6 border-2 cursor-pointer transition-all duration-300 ${
              selectedType === 'full-body'
                ? 'border-purple-500 bg-purple-500/20'
                : 'border-purple-500/20 hover:border-purple-500/40'
            }`}
          >
            <div className="text-center">
              <span className="text-4xl mb-3 block">🏋️‍♂️</span>
              <h3 className="text-xl font-bold text-white mb-2">Full Body</h3>
              <p className="text-gray-300 text-sm">
                Complete analysis including upper and lower body muscle groups
              </p>
              <div className="mt-3 text-xs text-purple-300">
                Chest • Shoulders • Arms • Back • Abs • Legs • Glutes • Calves + Leanness
              </div>
            </div>
          </div>

          <div
            onClick={() => setSelectedType('upper-body')}
            className={`bg-black/40 backdrop-blur-sm rounded-2xl p-6 border-2 cursor-pointer transition-all duration-300 ${
              selectedType === 'upper-body'
                ? 'border-purple-500 bg-purple-500/20'
                : 'border-purple-500/20 hover:border-purple-500/40'
            }`}
          >
            <div className="text-center">
              <span className="text-4xl mb-3 block">💪</span>
              <h3 className="text-xl font-bold text-white mb-2">Upper Body Only</h3>
              <p className="text-gray-300 text-sm">
                Focus on upper body development and definition
              </p>
              <div className="mt-3 text-xs text-purple-300">
                Chest • Shoulders • Arms • Back • Abs + Leanness
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 text-lg rounded-xl transition-all duration-300"
        >
          Continue to Analysis
        </Button>
      </div>
    </div>
  );
};

export default AnalysisTypeSelection;
