import { Toaster as Sonner } from "../src/components/ui/sonner";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Assistant from "./pages/Assistant";
import Vitals from "./pages/Vitals";
import Report from "./pages/Report";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import Sketch from "./pages/Sketch";
import BodyLangAI from "./pages/BodyLangAI";
import { HealthProvider } from "./context/health-context";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "./components/ThemeProvider";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="carelink-theme">
        <HealthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen w-full">
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route path="/vitals" element={<Vitals />} />
              <Route path="/report" element={<Report />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/sketch" element={<Sketch />} />
              <Route path="/support" element={<Support />} />
              <Route path="/body" element={<BodyLangAI />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
        </HealthProvider>
      
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;