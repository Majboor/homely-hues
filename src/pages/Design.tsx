
import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import UploadRoom from "../components/design/UploadRoom";
import DesignSuggestion from "../components/design/DesignSuggestion";
import { CustomButton } from "../components/ui/CustomButton";
import { ArrowRight, Wand2 } from "lucide-react";

const Design = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUploaded = (imageUrl: string) => {
    setUploadedImage(imageUrl);
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-medium mb-4">Design Your Space</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload a photo of your room and our AI will generate personalized interior design suggestions.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 animate-scale-in">
            <h2 className="text-xl font-medium mb-4">Upload Your Room</h2>
            <UploadRoom onImageUploaded={handleImageUploaded} />
          </div>
          
          {uploadedImage ? (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium">Design Suggestions</h2>
                <CustomButton variant="outline" size="sm">
                  <Wand2 className="mr-2 h-4 w-4" />
                  Regenerate
                </CustomButton>
              </div>
              
              <DesignSuggestion roomImage={uploadedImage} />
              
              <div className="mt-8 text-center">
                <p className="text-muted-foreground mb-4">
                  Want to see more design options and detailed recommendations?
                </p>
                <CustomButton>
                  Advanced Design Options
                  <ArrowRight className="ml-2 h-4 w-4" />
                </CustomButton>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-xl p-8 text-center space-y-4 animate-fade-in">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Wand2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium">Your design journey starts with an image</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Upload a photo of your room above to see AI-generated design suggestions tailored to your space.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Design;
