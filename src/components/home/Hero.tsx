
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CustomButton } from "../ui/CustomButton";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-transparent -z-10" />
      <div className="absolute top-20 left-0 right-0 h-64 bg-gradient-to-b from-secondary/30 to-transparent -z-10" />
      
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className={`space-y-6 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Introducing AI Interior Designer
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium leading-tight tracking-tight">
              Transform your space with AI precision
            </h1>
            <p className="text-xl text-muted-foreground max-w-md">
              Upload a photo of your room and get personalized interior design recommendations in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/design">
                <CustomButton size="lg" className="group">
                  Design Your Space
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </CustomButton>
              </Link>
              <CustomButton variant="outline" size="lg">
                See Examples
              </CustomButton>
            </div>
          </div>
          
          {/* Image Section */}
          <div className={`relative ${isLoaded ? 'animate-scale-in' : 'opacity-0'}`} style={{animationDelay: '0.5s'}}>
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay z-10" />
              
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                alt="Interior Design" 
                className="w-full object-cover h-[500px]"
              />
              
              {/* Floating UI Elements */}
              <div className="absolute bottom-6 left-6 right-6 glass-panel rounded-xl p-4 z-20 animate-blur-in">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">Living Room Design</h3>
                    <p className="text-sm text-muted-foreground">Modern Minimalist</p>
                  </div>
                  <CustomButton variant="outline" size="sm">View</CustomButton>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-12 -right-8 glass-panel rounded-xl p-3 shadow-lg animate-float">
              <div className="h-24 w-24 rounded-lg bg-accent/80 flex items-center justify-center">
                <span className="text-3xl font-medium">AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
