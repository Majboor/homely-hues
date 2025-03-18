
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { fetchBlogPostBySlug } from "@/services/blogService";
import { useToast } from "@/hooks/use-toast";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkForBlogPost = async () => {
      try {
        // Extract the potential slug from the URL (remove leading slash)
        const potentialSlug = location.pathname.substring(1);
        
        if (potentialSlug) {
          console.log("Checking if slug exists as blog post:", potentialSlug);
          const blogPost = await fetchBlogPostBySlug(potentialSlug);
          
          if (blogPost) {
            console.log("Blog post found, redirecting to:", `/${potentialSlug}`);
            // If a blog post exists with this slug, redirect to the blog page
            navigate(`/${potentialSlug}`, { replace: true });
            return;
          }
        }
      } catch (error) {
        console.error("Error checking for blog post:", error);
        toast({
          title: "Error",
          description: "Failed to check if this page exists as a blog post",
          variant: "destructive",
        });
      } finally {
        setIsChecking(false);
      }
    };

    checkForBlogPost();
  }, [location.pathname, navigate, toast]);

  const goBack = () => navigate(-1);
  
  // Show a loading state while checking for blog posts
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md px-4">
          <h1 className="text-xl font-medium mb-4">Checking page...</h1>
          <p className="text-gray-600 mb-4">We're checking if this content exists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          We couldn't find the page you're looking for
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={goBack} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          
          <Button onClick={() => navigate('/')} className="gap-2">
            <Home className="h-4 w-4" />
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
