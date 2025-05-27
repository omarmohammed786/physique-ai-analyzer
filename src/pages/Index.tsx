
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            PhysiqueMAX
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            AI-Powered Physique Analysis
          </p>
          <p className="text-gray-400">
            Get detailed muscle ratings and personalized improvement tips
          </p>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/20">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">💪</span>
            </div>
          </div>
          
          <ul className="text-left space-y-3 mb-8 text-gray-300">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
              Detailed muscle group ratings
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              AI-powered analysis
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
              Personalized improvement tips
            </li>
          </ul>
          
          <Button 
            onClick={() => navigate('/gender-selection')}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 text-lg rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Start Analysis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
