
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { CustomButton } from "../ui/CustomButton";
import { Menu, X, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { isUserSubscribed } from "@/services/subscriptionService";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      
      if (session) {
        const subscribed = await isUserSubscribed();
        setIsPremium(subscribed);
      }
    };
    
    checkAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async () => {
      checkAuth();
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Design", path: "/design" },
    { name: "About", path: "/about" },
  ];

  const scrollToPricing = () => {
    // If we're not on the home page, navigate to it first
    if (location.pathname !== '/') {
      window.location.href = '/#pricing';
    } else {
      // Scroll to the pricing section
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
    
    // Close mobile menu if open
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-white/80 backdrop-blur-md shadow-sm"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link 
          to="/" 
          className="text-xl font-medium flex items-center gap-2"
        >
          <span className="h-8 w-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
            ID
          </span>
          <span>InteriorDesign</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`underline-animation ${
                  location.pathname === link.path
                    ? "font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <button
              onClick={scrollToPricing}
              className="underline-animation text-muted-foreground"
            >
              Pricing
            </button>
          </div>
          
          {isPremium && isLoggedIn && (
            <div className="flex items-center gap-2 text-amber-500 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <Crown size={16} className="fill-amber-500" />
              <span className="text-sm font-medium">Premium</span>
            </div>
          )}
          
          <CustomButton size="sm" onClick={scrollToPricing}>
            {isPremium ? "Account" : "Get Started"}
          </CustomButton>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          {isPremium && isLoggedIn && (
            <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
              <Crown size={14} className="fill-amber-500" />
              <span className="text-xs font-medium">Premium</span>
            </div>
          )}
          
          <button
            className="p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-md py-4 animate-fade-in">
          <div className="container mx-auto px-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`py-2 px-4 rounded-md ${
                  location.pathname === link.path
                    ? "bg-secondary font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <button
              onClick={scrollToPricing}
              className="py-2 px-4 rounded-md text-muted-foreground text-left"
            >
              Pricing
            </button>
            <div className="pt-2">
              <CustomButton className="w-full" onClick={scrollToPricing}>
                {isPremium ? "Account" : "Get Started"}
              </CustomButton>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
