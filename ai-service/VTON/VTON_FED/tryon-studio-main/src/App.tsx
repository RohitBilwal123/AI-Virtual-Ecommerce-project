import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ActivityProvider } from "@/components/ActivityProvider";
import { TryOnProvider } from "@/contexts/TryOnContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

// Pages
import Index from "./pages/Index";
import TryOnWizard from "./pages/TryOnWizard";
import ProductGallery from "./pages/ProductGallery";
import ProductDetail from "./pages/ProductDetail";
import CheckoutNew from "./pages/CheckoutNew";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Gallery from "./pages/Gallery";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <TryOnProvider>
            <CartProvider>
              <ActivityProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/tryon" element={<TryOnWizard />} />
                  <Route path="/products" element={<ProductGallery />} />
                  <Route path="/product/:index" element={<ProductDetail />} />
                  <Route path="/checkout" element={<CheckoutNew />} />
                  <Route path="/cart" element={<CheckoutNew />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/history" element={<Gallery />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ActivityProvider>
            </CartProvider>
          </TryOnProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
