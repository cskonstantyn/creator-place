import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { PaywallProvider } from "./lib/paywall/PaywallProvider";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import FAQPage from "./pages/FAQPage";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import BrowsePage from "./pages/BrowsePage";
import BrandDealPage from "./pages/BrandDealPage";
import DiscountDealPage from "./pages/DiscountDealPage";
import PostAd from "./pages/PostAd";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import AdvertisePage from "./pages/AdvertisePage";
import PartnershipPage from "./pages/PartnershipPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResourcesPage from "./pages/ResourcesPage";
import NotificationsPage from "./pages/NotificationsPage";
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <PaywallProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/category/:category" element={<BrowsePage />} />
            <Route path="/brand-deal/:id" element={<BrandDealPage />} />
            <Route path="/discount-deal/:id" element={<DiscountDealPage />} />
            <Route path="/post-ad" element={<PostAd />} />
            <Route path="/create" element={<Navigate to="/post-ad" replace />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/advertise" element={<AdvertisePage />} />
            <Route path="/partnerships" element={<PartnershipPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </PaywallProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
