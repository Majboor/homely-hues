import { useState, useEffect } from "react";
import { CustomButton } from "../ui/CustomButton";
import { ThumbsUp, ThumbsDown, Download, ArrowRight, ArrowLeft, Loader2, Palette, Sofa, Lightbulb, Layout, FileImage, Wand } from "lucide-react";
import { toast } from "sonner";
import { analyzeRoomImage, RoomAnalysis } from "../../services/interiorDesignApi";

interface DesignSuggestionProps {
  roomImage: string;
  originalFile?: File;
}

const DesignSuggestion = ({ roomImage, originalFile }: DesignSuggestionProps) => {
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [roomAnalysis, setRoomAnalysis] = useState<RoomAnalysis | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  
  useEffect(() => {
    const analyzeRoom = async () => {
      try {
        setLoading(true);
        setApiError(null);
        console.log("Analyzing room with image:", roomImage);
        console.log("Original file available:", !!originalFile);
        
        // For demonstration purposes, use mock data if originalFile is not available
        if (!originalFile) {
          // This is just for development/preview purposes
          const mockData = {
            room_details: {
              room_type: "Bedroom",
              current_style: "Modern with a warm and inviting atmosphere",
              furniture: [
                "Bed with teal upholstered headboard",
                "Two nightstands with lamps",
                "Wardrobe/storage unit",
                "Decorative wall art frames",
                "Rug on the floor",
                "Potted plant"
              ],
              color_scheme: [
                "Yellow",
                "Teal",
                "Brown",
                "White"
              ],
              lighting: "Soft ambient lighting from bedside lamps and ceiling lights"
            },
            flashcards: [
              {
                card: 1,
                title: "Current Room Analysis",
                content: {
                  colors: [
                    "Yellow",
                    "Teal",
                    "Brown",
                    "White"
                  ],
                  furniture: [
                    "Bed with teal upholstered headboard",
                    "Two nightstands with lamps",
                    "Wardrobe/storage unit",
                    "Decorative wall art frames",
                    "Rug on the floor",
                    "Potted plant"
                  ],
                  lighting: "Soft ambient lighting from bedside lamps and ceiling lights",
                  room_type: "Bedroom",
                  style: "Modern with a warm and inviting atmosphere"
                }
              },
              {
                card: 2,
                title: "Design Assessment",
                content: "The bedroom exudes a modern style with a warm and inviting atmosphere, thanks to the use of a cohesive color scheme and careful selection of furniture. However, there is potential for enhancing the space with a few adjustments to improve functionality and aesthetics."
              },
              {
                card: 3,
                title: "Suggestion: Layout",
                content: {
                  impact: "This change would enhance the room's functionality and visual appeal, making it feel more inviting.",
                  suggestion: "Rearrange the bed to face the entrance to create a welcoming focal point and optimize the flow of the room."
                }
              }
            ]
          };
          setRoomAnalysis(mockData as RoomAnalysis);
          toast.success("Room analysis complete! (demo mode)");
          setLoading(false);
          return;
        }
        
        const result = await analyzeRoomImage(originalFile);
        console.log("Analysis result:", result);
        setRoomAnalysis(result);
        toast.success("Room analysis complete!");
      } catch (error) {
        console.error("Error analyzing room:", error);
        setApiError("Failed to analyze room. Please try again later.");
        toast.error("Failed to analyze room. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    analyzeRoom();
  }, [roomImage, originalFile]);

  const handlePrevious = () => {
    if (!roomAnalysis) return;
    setCurrentIndex((prev) => (prev === 0 ? roomAnalysis.flashcards.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (!roomAnalysis) return;
    setCurrentIndex((prev) => (prev === roomAnalysis.flashcards.length - 1 ? 0 : prev + 1));
  };

  const handleFeedback = (positive: boolean) => {
    toast.success(positive ? "Thanks for the positive feedback!" : "We'll improve our suggestions");
  };

  const handleDownload = () => {
    toast.success("Design recommendations saved!");
  };

  const getCardIcon = (title: string) => {
    if (title.includes("Color")) return <Palette className="h-5 w-5" />;
    if (title.includes("Furniture")) return <Sofa className="h-5 w-5" />;
    if (title.includes("Lighting")) return <Lightbulb className="h-5 w-5" />;
    if (title.includes("Layout")) return <Layout className="h-5 w-5" />;
    if (title.includes("Decor")) return <FileImage className="h-5 w-5" />;
    return <Wand className="h-5 w-5" />;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm h-[500px] flex flex-col items-center justify-center text-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <h3 className="text-xl font-medium mb-2">Analyzing your room</h3>
        <p className="text-muted-foreground max-w-md">
          Our AI is analyzing your room and creating personalized interior design recommendations.
        </p>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm text-center">
        <div className="p-6 text-center">
          <h3 className="text-xl font-medium mb-4 text-red-500">Analysis Failed</h3>
          <p className="text-muted-foreground mb-4">
            {apiError}
          </p>
          <p className="text-sm text-muted-foreground">
            Please try uploading a different image of your room or try again later.
          </p>
        </div>
      </div>
    );
  }

  if (!roomAnalysis) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm text-center">
        <div className="p-6 text-center">
          <h3 className="text-xl font-medium mb-4">No analysis available</h3>
          <p className="text-muted-foreground mb-4">
            We couldn't analyze this image. Please try uploading a different image of your room.
          </p>
        </div>
      </div>
    );
  }
  
  const currentCard = roomAnalysis.flashcards[currentIndex];
  const { room_details } = roomAnalysis;

  return (
    <div className="bg-white rounded-xl shadow-sm animate-scale-in overflow-hidden">
      {/* Room Details Panel */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl font-medium">{room_details.room_type}</h3>
          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
            {room_details.current_style}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm font-medium mb-2">Furniture</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {room_details.furniture.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Color Scheme</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {room_details.color_scheme.map((color, idx) => {
                const baseColor = color.split(' ')[0].toLowerCase();
                let bgColor = baseColor;
                
                if (baseColor === 'yellow') bgColor = 'bg-yellow-400';
                else if (baseColor === 'teal') bgColor = 'bg-teal-500';
                else if (baseColor === 'brown') bgColor = 'bg-amber-800';
                else if (baseColor === 'white') bgColor = 'bg-white';
                else bgColor = 'bg-gray-300';
                
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div 
                      className={`h-8 w-8 rounded-md border shadow-sm ${bgColor}`}
                    />
                    <span className="text-xs mt-1 whitespace-nowrap">{color}</span>
                  </div>
                );
              })}
            </div>
            
            <p className="text-sm font-medium mb-1">Lighting</p>
            <p className="text-sm text-muted-foreground">{room_details.lighting}</p>
          </div>
        </div>
      </div>
      
      {/* Flashcard Navigation and Content */}
      <div className="relative p-6">
        {/* Card Navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary h-8 w-8 rounded-full flex items-center justify-center">
              {getCardIcon(currentCard.title)}
            </div>
            <h3 className="font-medium">{currentCard.title}</h3>
          </div>
          
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">
              {currentIndex + 1} / {roomAnalysis.flashcards.length}
            </span>
            <button 
              className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center"
              onClick={handlePrevious}
              aria-label="Previous suggestion"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button 
              className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center"
              onClick={handleNext}
              aria-label="Next suggestion"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Card Content */}
        <div className="bg-muted/30 p-4 rounded-lg mb-6">
          {currentCard.card === 1 && (
            <div>
              <p className="text-muted-foreground mb-4">Analysis of your current room:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(currentCard.content).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-sm font-medium capitalize mb-1">{key.replace('_', ' ')}</p>
                    {Array.isArray(value) ? (
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {value.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span>•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">{String(value)}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {currentCard.card === 2 && (
            <p className="text-muted-foreground">{typeof currentCard.content === 'string' ? currentCard.content : JSON.stringify(currentCard.content)}</p>
          )}
          
          {currentCard.card >= 3 && typeof currentCard.content === 'object' && 'suggestion' in currentCard.content && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Suggestion</p>
                <p className="text-muted-foreground">{currentCard.content.suggestion}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Impact</p>
                <p className="text-muted-foreground">{currentCard.content.impact}</p>
              </div>
            </div>
          )}
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
            Save Recommendations
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default DesignSuggestion;
