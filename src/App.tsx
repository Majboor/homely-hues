
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Design from "./pages/Design";
import Auth from "./pages/Auth";
import PaymentCallback from "./pages/PaymentCallback";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import BlogPost from "./pages/BlogPost"; // Add the blog post page

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/design" element={<Design />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/payment-callback" element={<PaymentCallback />} />
          <Route path="/account" element={<Account />} />
          <Route path="/:slug" element={<BlogPost />} /> {/* Catch-all route for blog posts */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
