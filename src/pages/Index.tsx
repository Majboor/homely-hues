
import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import PricingPlans from "../components/pricing/PricingPlans";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <Hero />
    <Features />
    <PricingPlans />
  </div>
);

export default Index;
