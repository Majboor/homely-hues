
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAttemptingRedirect, setIsAttemptingRedirect] = useState(false);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Check if the path might be a blog post slug
    const potentialSlug = location.pathname.substring(1); // Remove leading slash
    if (potentialSlug && !isAttemptingRedirect) {
      // We attempted a redirect to the blog page already but it failed
      // (we're now on the 404 page), so we won't try again
      setIsAttemptingRedirect(true);
    }
  }, [location.pathname, isAttemptingRedirect]);

  const goBack = () => navigate(-1);
  
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
