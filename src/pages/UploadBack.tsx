
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const UploadBack = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const navigate = useNavigate();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem('physique-back-image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    if (selectedImage) {
      navigate('/upload-side');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Upload Back-Facing Photo
          </h1>
          <p className="text-gray-300 mb-4">
            Show your back muscles. Keep your full body visible.
          </p>
        </div>

        <div className="bg-black/40 backdrop-blur-sm rounded-3xl p-6 border border-purple-500/20 mb-6">
          {!previewUrl ? (
            <div className="space-y-6">
              <div className="w-32 h-48 mx-auto bg-gradient-to-b from-purple-500/20 to-blue-500/20 rounded-2xl border-2 border-dashed border-purple-400 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-4xl mb-2 block">🔙</span>
                  <p className="text-sm text-gray-400">Back pose</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-400">
                <p>• Face away from camera</p>
                <p>• Flex back muscles if possible</p>
                <p>• Full body must be visible</p>
                <p>• Avoid shadows on back</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <img 
                src={previewUrl} 
                alt="Back pose preview" 
                className="w-32 h-48 mx-auto object-cover rounded-2xl border-2 border-purple-500"
              />
              <p className="text-green-400 text-sm">✓ Back photo uploaded</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <label className="block">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <div className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105">
              {selectedImage ? 'Change Photo' : 'Select Photo'}
            </div>
          </label>

          <Button
            onClick={handleContinue}
            disabled={!selectedImage}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 text-lg rounded-xl transition-all duration-300"
          >
            Continue to Side Photo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadBack;
