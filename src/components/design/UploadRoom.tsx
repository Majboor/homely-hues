
import { useState, useRef, useEffect } from "react";
import { CustomButton } from "../ui/CustomButton";
import { Upload, X, Image, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { isUserAuthenticated, isUserSubscribed, hasUsedFreeTrial } from "@/services/subscriptionService";

interface UploadRoomProps {
  onImageUploaded: (imageUrl: string, originalFile?: File) => void;
}

const UploadRoom = ({ onImageUploaded }: UploadRoomProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);
  const [freeTrialUsed, setFreeTrialUsed] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const authenticated = await isUserAuthenticated();
        if (authenticated) {
          const [trialUsed, subscribed] = await Promise.all([
            hasUsedFreeTrial(),
            isUserSubscribed()
          ]);
          setFreeTrialUsed(trialUsed);
          setIsSubscribed(subscribed);
        } else {
          setFreeTrialUsed(localStorage.getItem('freeDesignUsed') === 'true');
        }
      } catch (error) {
        console.error("Error checking user subscription status:", error);
      }
    };
    
    checkUserStatus();
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.match('image.*')) {
      toast.error("Please upload an image file");
      return;
    }

    setUploading(true);
    setCheckingAuth(true);

    try {
      const isAuthenticated = await isUserAuthenticated();
      if (!isAuthenticated) {
        toast.info("Please log in to analyze rooms");
        setUploading(false);
        setCheckingAuth(false);
        return;
      }
      
      const [trialUsed, subscriptionStatus] = await Promise.all([
        hasUsedFreeTrial(),
        isUserSubscribed()
      ]);
      
      setFreeTrialUsed(trialUsed);
      setIsSubscribed(subscriptionStatus);
      
      if (trialUsed && !subscriptionStatus) {
        toast.info("You've used your free design. Please upgrade to continue.");
        setUploading(false);
        setCheckingAuth(false);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const imageUrl = e.target.result.toString();
          setImage(imageUrl);
          onImageUploaded(imageUrl, file);
        }
      };
      reader.readAsDataURL(file);
      
      toast.info("Analyzing your room...");
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process the image. Please try again.");
    } finally {
      setUploading(false);
      setCheckingAuth(false);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImage(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleSelectImage = (e: React.MouseEvent) => {
    e.preventDefault();
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div 
        className={`
          border-2 border-dashed rounded-xl transition-all relative overflow-hidden
          ${dragActive ? 'border-primary bg-primary/5' : 'border-border bg-secondary/50'}
          ${image ? 'p-0' : 'p-8'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {freeTrialUsed && !isSubscribed && !image ? (
          <div className="flex flex-col items-center justify-center text-center p-8">
            <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Free Trial Used</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              You've already used your free design. Upgrade to our premium plan to analyze more rooms.
            </p>
            <CustomButton 
              onClick={() => window.location.href = '/#pricing'}
              variant="default"
            >
              View Pricing Plans
            </CustomButton>
          </div>
        ) : image ? (
          <div className="relative group">
            <img 
              src={image} 
              alt="Uploaded Room" 
              className="w-full h-[400px] object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <CustomButton 
                variant="outline" 
                size="sm" 
                className="bg-white text-primary"
                onClick={removeImage}
              >
                <X className="mr-2 h-4 w-4" />
                Remove Image
              </CustomButton>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Image className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Upload your room photo</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Drag and drop your image here, or click to browse. We recommend high-resolution images for the best results.
            </p>
            <CustomButton
              onClick={handleSelectImage}
              disabled={uploading || checkingAuth}
            >
              {uploading || checkingAuth ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {checkingAuth ? "Checking access..." : "Uploading..."}
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Select Image
                </>
              )}
            </CustomButton>
            <input
              ref={inputRef}
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleChange}
              accept="image/*"
              disabled={uploading || checkingAuth}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadRoom;
