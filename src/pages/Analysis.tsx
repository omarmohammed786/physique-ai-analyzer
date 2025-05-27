
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { analyzePhysique } from "@/utils/physiqueAnalysis";

interface AnalysisResults {
  ratings: {
    chest: number;
    shoulders: number;
    biceps: number;
    triceps: number;
    back: number;
    abs: number;
    lean: number;
    glutes?: number;
    quads?: number;
    hamstrings?: number;
    calves?: number;
  };
  overallScore: number;
  strengths: string[];
  improvements: string[];
  workoutPlan?: Array<{
    exercise: string;
    sets: string;
    focus: string;
  }>;
}

const Analysis = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [frontImageUrl, setFrontImageUrl] = useState<string>("");
  const [analysisType, setAnalysisType] = useState<'upper-body' | 'full-body'>('full-body');
  const navigate = useNavigate();

  useEffect(() => {
    const analyzePhysiqueWithAI = async () => {
      try {
        const gender = localStorage.getItem('physique-gender');
        const frontImage = localStorage.getItem('physique-front-image');
        const backImage = localStorage.getItem('physique-back-image');
        const storedAnalysisType = localStorage.getItem('physique-analysis-type') as 'upper-body' | 'full-body' || 'full-body';

        if (!gender || !frontImage || !backImage) {
          toast.error("Missing required data. Please start over.");
          navigate('/gender-selection');
          return;
        }

        setFrontImageUrl(frontImage);
        setAnalysisType(storedAnalysisType);

        console.log(`Starting ${storedAnalysisType} AI analysis...`);
        const analysisResults = await analyzePhysique(frontImage, backImage, gender, storedAnalysisType);
        
        // Store the workout plan for the improvement plan page
        if (analysisResults.workoutPlan) {
          localStorage.setItem('physique-workout-plan', JSON.stringify(analysisResults.workoutPlan));
        }
        
        // Store strengths and improvements for the improvement plan page
        localStorage.setItem('physique-strengths', JSON.stringify(analysisResults.strengths));
        localStorage.setItem('physique-improvements', JSON.stringify(analysisResults.improvements));

        setResults(analysisResults);
        console.log('Analysis completed successfully');
      } catch (error) {
        console.error('Analysis error:', error);
        toast.error("Analysis failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    analyzePhysiqueWithAI();
  }, [navigate]);

  const MuscleRating = ({ name, score }: { name: string; score: number }) => (
    <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
      <span className="text-white font-medium">{name}</span>
      <div className="flex items-center space-x-3">
        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000"
            style={{ width: `${score}%` }}
          />
        </div>
        <span className="text-white font-bold text-lg w-8">{score}</span>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Analyzing Your Physique</h2>
          <p className="text-gray-300">AI is processing your photos...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Analysis Failed</h2>
          <Button onClick={() => navigate('/gender-selection')}>
            Start Over
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Your Results</h1>
          <p className="text-purple-300 text-sm mb-4">
            {analysisType === 'upper-body' ? 'Upper Body Analysis' : 'Full Body Analysis'}
          </p>
          
          {frontImageUrl && (
            <div className="w-24 h-24 mx-auto mb-4">
              <img 
                src={frontImageUrl} 
                alt="Your photo" 
                className="w-full h-full object-cover rounded-full border-4 border-purple-500"
              />
            </div>
          )}
          
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 mb-6">
            <div className="text-4xl font-bold text-white mb-2">{results.overallScore}/100</div>
            <div className="text-lg text-purple-300">Overall Physique Score</div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-1 gap-3">
            <MuscleRating name="Chest" score={results.ratings.chest} />
            <MuscleRating name="Shoulders" score={results.ratings.shoulders} />
            <MuscleRating name="Biceps" score={results.ratings.biceps} />
            <MuscleRating name="Triceps" score={results.ratings.triceps} />
            <MuscleRating name="Back" score={results.ratings.back} />
            <MuscleRating name="Abs" score={results.ratings.abs} />
            <MuscleRating name="Leanness" score={results.ratings.lean} />
            
            {analysisType === 'full-body' && (
              <>
                {results.ratings.glutes && <MuscleRating name="Glutes" score={results.ratings.glutes} />}
                {results.ratings.quads && <MuscleRating name="Quads" score={results.ratings.quads} />}
                {results.ratings.hamstrings && <MuscleRating name="Hamstrings" score={results.ratings.hamstrings} />}
                {results.ratings.calves && <MuscleRating name="Calves" score={results.ratings.calves} />}
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => navigate('/improvement-plan')}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 text-lg rounded-xl transition-all duration-300"
          >
            View Improvement Plan
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="border-purple-500 text-purple-300 hover:bg-purple-500/20"
            >
              Save Results
            </Button>
            <Button
              variant="outline"
              className="border-blue-500 text-blue-300 hover:bg-blue-500/20"
            >
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
