
import { 
  Layout, 
  ArrowUpRight, 
  Sparkles, 
  PaintBucket, 
  ShoppingBag, 
  RotateCcw, 
  Layers 
} from "lucide-react";

const features = [
  {
    icon: <Layout className="h-6 w-6" />,
    title: "Instant Layout Suggestions",
    description: "Get AI-powered furniture arrangement recommendations based on your room's dimensions.",
  },
  {
    icon: <PaintBucket className="h-6 w-6" />,
    title: "Color Scheme Generation",
    description: "Discover harmonious color palettes that complement your existing décor and preferences.",
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Style Matching",
    description: "Our AI identifies your style preferences and suggests designs that match your aesthetic.",
  },
  {
    icon: <ShoppingBag className="h-6 w-6" />,
    title: "Product Recommendations",
    description: "Find furniture and décor pieces that fit your design and budget requirements.",
  },
  {
    icon: <RotateCcw className="h-6 w-6" />,
    title: "Unlimited Revisions",
    description: "Refine your design with as many iterations as you need until it's perfect.",
  },
  {
    icon: <Layers className="h-6 w-6" />,
    title: "3D Visualization",
    description: "See how your new design will look in three dimensions before making any changes.",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-medium tracking-tight mb-4">
            Redesign with intelligence
          </h2>
          <p className="text-muted-foreground text-lg">
            Our AI-powered platform offers all the tools you need to transform your space with precision and style.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-sm hover-scale"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground mb-4">{feature.description}</p>
              <a 
                href="#" 
                className="inline-flex items-center text-sm font-medium text-primary underline-animation"
              >
                Learn more <ArrowUpRight className="ml-1 h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
