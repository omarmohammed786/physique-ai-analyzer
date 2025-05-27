
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GenderSelection from "./pages/GenderSelection";
import UploadFront from "./pages/UploadFront";
import UploadBack from "./pages/UploadBack";
import UploadSide from "./pages/UploadSide";
import Analysis from "./pages/Analysis";
import ImprovementPlan from "./pages/ImprovementPlan";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/gender-selection" element={<GenderSelection />} />
          <Route path="/upload-front" element={<UploadFront />} />
          <Route path="/upload-back" element={<UploadBack />} />
          <Route path="/upload-side" element={<UploadSide />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/improvement-plan" element={<ImprovementPlan />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
