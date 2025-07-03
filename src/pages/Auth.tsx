
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/analysis`
          }
        });
        
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Account created! Check your email to verify your account.");
          navigate('/analysis');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Signed in successfully!");
          navigate('/analysis');
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isSignUp ? "Create Account" : "Sign In"}
          </h1>
          <p className="text-gray-300">
            {isSignUp 
              ? "Create your account to get your physique analysis"
              : "Sign in to view your analysis results"
            }
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-white mb-2 block">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="bg-black/30 border-purple-500/30 text-white placeholder:text-gray-400"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-white mb-2 block">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              minLength={6}
              className="bg-black/30 border-purple-500/30 text-white placeholder:text-gray-400"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 text-lg rounded-xl transition-all duration-300"
          >
            {isLoading ? "Loading..." : (isSignUp ? "Create Account" : "Sign In")}
          </Button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-purple-300 hover:text-purple-200 transition-colors"
          >
            {isSignUp 
              ? "Already have an account? Sign in" 
              : "Don't have an account? Sign up"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
