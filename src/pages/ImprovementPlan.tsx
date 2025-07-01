
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle } from "lucide-react";

const ImprovementPlan = () => {
  const [strengths, setStrengths] = useState<string[]>([]);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [workoutPlan, setWorkoutPlan] = useState<Array<{
    exercise: string;
    sets: string;
    focus: string;
  }>>([]);
  const [analysisType, setAnalysisType] = useState<'upper-body' | 'full-body'>('full-body');

  const navigate = useNavigate();

  useEffect(() => {
    // Load analysis type from localStorage
    const storedAnalysisType = localStorage.getItem('physique-analysis-type') as 'upper-body' | 'full-body' || 'full-body';
    setAnalysisType(storedAnalysisType);

    // Load data from localStorage (stored by Analysis page)
    const storedStrengths = localStorage.getItem('physique-strengths');
    const storedImprovements = localStorage.getItem('physique-improvements');
    const storedWorkoutPlan = localStorage.getItem('physique-workout-plan');

    if (storedStrengths) {
      setStrengths(JSON.parse(storedStrengths));
    }
    if (storedImprovements) {
      setImprovements(JSON.parse(storedImprovements));
    }
    if (storedWorkoutPlan) {
      setWorkoutPlan(JSON.parse(storedWorkoutPlan));
    }

    // Fallback to default data if nothing stored
    if (!storedStrengths || !storedImprovements || !storedWorkoutPlan) {
      // Set strengths based on analysis type
      if (storedAnalysisType === 'upper-body') {
        setStrengths([
          "Well-developed shoulders and upper body",
          "Good upper body symmetry and proportions",
          "Strong back development"
        ]);
        setImprovements([
          "Increase core definition and abs visibility",
          "Build more chest thickness and width",
          "Improve triceps separation and definition"
        ]);
        setWorkoutPlan([
          { exercise: "Planks", sets: "3 x 60s", focus: "Abs" },
          { exercise: "Incline Barbell Press", sets: "4 x 8-12", focus: "Chest" },
          { exercise: "Close-Grip Push-ups", sets: "3 x 12-15", focus: "Triceps" },
          { exercise: "Hanging Leg Raises", sets: "3 x 12-15", focus: "Abs" },
          { exercise: "Dumbbell Flyes", sets: "3 x 12-15", focus: "Chest" },
          { exercise: "Russian Twists", sets: "3 x 30", focus: "Abs" }
        ]);
      } else {
        setStrengths([
          "Well-developed shoulders and upper body",
          "Good symmetry and proportions", 
          "Strong back development"
        ]);
        setImprovements([
          "Focus on lower leg development and calf size",
          "Increase core definition and abs visibility",
          "Work on hamstring thickness and separation"
        ]);
        setWorkoutPlan([
          { exercise: "Calf Raises", sets: "4 x 15-20", focus: "Calves" },
          { exercise: "Planks", sets: "3 x 60s", focus: "Abs" },
          { exercise: "Romanian Deadlifts", sets: "4 x 8-12", focus: "Hamstrings" },
          { exercise: "Hanging Leg Raises", sets: "3 x 12-15", focus: "Abs" },
          { exercise: "Walking Lunges", sets: "3 x 20 each", focus: "Legs" },
          { exercise: "Russian Twists", sets: "3 x 30", focus: "Abs" }
        ]);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Improvement Plan</h1>
          <p className="text-gray-300">Your personalized roadmap to better physique</p>
          <p className="text-purple-300 text-sm mt-2">
            {analysisType === 'upper-body' ? 'Upper Body Focus' : 'Full Body Focus'}
          </p>
        </div>

        {/* Strengths Section */}
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20 mb-6">
          <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center">
            <Check className="w-5 h-5 mr-2" />
            Your Strengths
          </h2>
          <div className="space-y-3">
            {strengths.map((strength, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300">{strength}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Improvements Section */}
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/20 mb-6">
          <h2 className="text-xl font-bold text-orange-400 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Areas to Improve
          </h2>
          <div className="space-y-3">
            {improvements.map((improvement, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300">{improvement}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Workout Plan */}
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 mb-8">
          <h2 className="text-xl font-bold text-purple-400 mb-4">
            💪 Custom Workout Plan
          </h2>
          <div className="space-y-4">
            {workoutPlan.map((exercise, index) => (
              <div key={index} className="bg-black/30 rounded-xl p-4 border border-purple-500/10">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-white">{exercise.exercise}</h3>
                  <span className="text-sm text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full">
                    {exercise.focus}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{exercise.sets}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 text-lg rounded-xl transition-all duration-300"
          >
            Start New Analysis
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="border-purple-500 text-purple-300 hover:bg-purple-500/20"
            >
              Save Plan
            </Button>
            <Button
              variant="outline"
              className="border-blue-500 text-blue-300 hover:bg-blue-500/20"
            >
              Share Plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImprovementPlan;
