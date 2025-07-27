import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Landing } from "./pages/Landing";
import { CompanyLanding } from "./pages/CompanyLanding";
import { SeekerSignupForm } from "./components/forms/SeekerSignupForm";
import { SeekerLoginForm } from "./components/forms/SeekerLoginForm";
import { CompanySignupForm } from "./components/forms/CompanySignupForm";
import { CompanyLoginForm } from "./components/forms/CompanyLoginForm";
import { SeekerDashboard } from "./pages/seeker/SeekerDashboard";
import { CompanyDashboard } from "./pages/company/CompanyDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing Pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/company" element={<CompanyLanding />} />
          
          {/* Job Seeker Routes */}
          <Route path="/seeker/signup" element={<SeekerSignupForm />} />
          <Route path="/seeker/login" element={<SeekerLoginForm />} />
          <Route 
            path="/seeker/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['JobSeeker']}>
                <SeekerDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Company Routes */}
          <Route path="/company/signup" element={<CompanySignupForm />} />
          <Route path="/company/login" element={<CompanyLoginForm />} />
          <Route 
            path="/company/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Company']}>
                <CompanyDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
