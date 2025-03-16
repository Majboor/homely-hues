
import { useState, useRef } from "react";
import { CustomButton } from "../ui/CustomButton";
import { Upload, X, Image, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface UploadRoomProps {
  onImageUploaded: (imageUrl: string, originalFile?: File) => void;
}

const UploadRoom = ({ onImageUploaded }: UploadRoomProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
    // Check if file is an image
    if (!file.type.match('image.*')) {
      toast.error("Please upload an image file");
      return;
    }

    setUploading(true);

    try {
      // Create a URL for the image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const imageUrl = e.target.result.toString();
          setImage(imageUrl);
          // Make sure we're passing the file to the parent component
          onImageUploaded(imageUrl, file);
        }
      };
      reader.readAsDataURL(file);
      
      // Send image to API for analysis (we'll handle the API response in the DesignSuggestion component)
      toast.info("Analyzing your room...");
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process the image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    // Prevent default behavior to avoid page refresh
    e.preventDefault();
    e.stopPropagation();
    setImage(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
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
        {image ? (
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
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
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
              disabled={uploading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadRoom;
