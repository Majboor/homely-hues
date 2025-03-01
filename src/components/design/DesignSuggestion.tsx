
import { useState } from "react";
import { CustomButton } from "../ui/CustomButton";
import { ThumbsUp, ThumbsDown, Download, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DesignSuggestionProps {
  roomImage: string;
}

const DesignSuggestion = ({ roomImage }: DesignSuggestionProps) => {
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // In a real app, these would come from the AI
  const designSuggestions = [
    {
      id: 1,
      title: "Modern Minimalist",
      description: "Clean lines and a neutral palette create a calm, uncluttered space with carefully selected statement pieces.",
      image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92",
      colorPalette: ["#F8F9FA", "#E9ECEF", "#DEE2E6", "#ADB5BD", "#212529"]
    },
    {
      id: 2,
      title: "Scandinavian Comfort",
      description: "Natural materials and light colors create a warm, welcoming environment with functional simplicity.",
      image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92",
      colorPalette: ["#FFFFFF", "#F5F5F5", "#E5E5E5", "#BCAAA4", "#3E2723"]
    },
    {
      id: 3,
      title: "Industrial Chic",
      description: "Raw textures and exposed elements combined with sleek furnishings for an urban, sophisticated look.",
      image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92",
      colorPalette: ["#F5F5F5", "#E0E0E0", "#9E9E9E", "#616161", "#212121"]
    },
  ];

  // Simulate loading with useEffect
  useState(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  });

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? designSuggestions.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === designSuggestions.length - 1 ? 0 : prev + 1));
  };

  const handleFeedback = (positive: boolean) => {
    toast.success(positive ? "Thanks for the positive feedback!" : "We'll improve our suggestions");
  };

  const handleDownload = () => {
    toast.success("Design downloaded successfully");
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm h-[500px] flex flex-col items-center justify-center text-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <h3 className="text-xl font-medium mb-2">Generating design suggestions</h3>
        <p className="text-muted-foreground max-w-md">
          Our AI is analyzing your room and creating personalized interior design recommendations.
        </p>
      </div>
    );
  }

  const currentDesign = designSuggestions[currentIndex];

  return (
    <div className="bg-white rounded-xl shadow-sm animate-scale-in overflow-hidden">
      <div className="relative">
        <img 
          src={currentDesign.image} 
          alt={currentDesign.title} 
          className="w-full h-[300px] object-cover"
        />
        
        {/* Navigation Buttons */}
        <div className="absolute inset-y-0 left-2 flex items-center">
          <button 
            className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white transition-colors"
            onClick={handlePrevious}
            aria-label="Previous design"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        </div>
        <div className="absolute inset-y-0 right-2 flex items-center">
          <button 
            className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white transition-colors"
            onClick={handleNext}
            aria-label="Next design"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        
        {/* Navigation Indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {designSuggestions.map((_, idx) => (
            <button
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? "w-8 bg-white" : "w-2 bg-white/60"
              }`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to design ${idx + 1}`}
            />
          ))}
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-medium mb-2">{currentDesign.title}</h3>
          <p className="text-muted-foreground">{currentDesign.description}</p>
        </div>
        
        {/* Color Palette */}
        <div className="mb-6">
          <p className="text-sm font-medium mb-2">Suggested Color Palette</p>
          <div className="flex gap-2">
            {currentDesign.colorPalette.map((color, idx) => (
              <div 
                key={idx} 
                className="h-8 w-8 rounded-md border"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <CustomButton 
              variant="outline" 
              size="sm" 
              onClick={() => handleFeedback(true)}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              Like
            </CustomButton>
            <CustomButton 
              variant="outline" 
              size="sm" 
              onClick={() => handleFeedback(false)}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              Dislike
            </CustomButton>
          </div>
          <CustomButton onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Save Design
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default DesignSuggestion;
