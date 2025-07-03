
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const GenderSelection = () => {
  const [selectedGender, setSelectedGender] = useState<string>("");
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedGender) {
      localStorage.setItem('physique-gender', selectedGender);
      navigate('/upload-front');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Select Your Gender
          </h1>
          <p className="text-gray-300">
            This helps us provide more accurate analysis
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <button
            onClick={() => setSelectedGender('male')}
            className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 ${
              selectedGender === 'male'
                ? 'border-purple-500 bg-purple-500/20 text-white'
                : 'border-gray-600 bg-black/20 text-gray-300 hover:border-purple-400'
            }`}
          >
            <div className="flex items-center justify-center space-x-4">
              <span className="text-3xl">👨</span>
              <span className="text-xl font-semibold">Male</span>
            </div>
          </button>

          <button
            onClick={() => setSelectedGender('female')}
            className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 ${
              selectedGender === 'female'
                ? 'border-purple-500 bg-purple-500/20 text-white'
                : 'border-gray-600 bg-black/20 text-gray-300 hover:border-purple-400'
            }`}
          >
            <div className="flex items-center justify-center space-x-4">
              <span className="text-3xl">👩</span>
              <span className="text-xl font-semibold">Female</span>
            </div>
          </button>
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selectedGender}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 text-lg rounded-xl transition-all duration-300"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default GenderSelection;
