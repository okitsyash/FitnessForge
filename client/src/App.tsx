import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { getQueryFn } from "@/lib/queryClient";
import Sidebar from "@/components/sidebar";
import Dashboard from "@/pages/dashboard";
import Workout from "@/pages/workout";
import Nutrition from "@/pages/nutrition";
import AICoach from "@/pages/ai-coach";
import Progress from "@/pages/progress";
import Leaderboard from "@/pages/leaderboard";
import Friends from "@/pages/friends";
import Profile from "@/pages/profile";
import Landing from "@/pages/landing";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }),
    },
  },
});

function App() {
  const { toast } = useToast();

  useEffect(() => {
    // Show welcome toast when app loads
    toast({
      title: "Welcome to FitnessForge!",
      description: "Your personal fitness journey starts here.",
    });
  }, [toast]);

  if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
    throw new Error("Missing Clerk Publishable Key");
  }

  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <SignedIn>
                    <Navigate to="/dashboard" replace />
                  </SignedIn>
                  <SignedOut>
                    <Landing />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/*"
              element={
                <>
                  <SignedIn>
                    <div className="flex h-screen bg-gray-50">
                      <Sidebar />
                      <main className="flex-1 overflow-y-auto">
                        <Routes>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/workout" element={<Workout />} />
                          <Route path="/nutrition" element={<Nutrition />} />
                          <Route path="/ai-coach" element={<AICoach />} />
                          <Route path="/progress" element={<Progress />} />
                          <Route path="/leaderboard" element={<Leaderboard />} />
                          <Route path="/friends" element={<Friends />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                      </main>
                    </div>
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
