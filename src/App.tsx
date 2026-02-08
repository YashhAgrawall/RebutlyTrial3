import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Play from "./pages/Play";
import Room from "./pages/Room";
import LiveDebateRoom from "./pages/LiveDebateRoom";
import RoomResults from "./pages/RoomResults";
import Invite from "./pages/Invite";
import AdminMatchmaking from "./pages/AdminMatchmaking";
import Demo from "./pages/Demo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/play" element={<Play />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/room/:id" element={<Room />} />
            <Route path="/room/:id/live" element={<LiveDebateRoom />} />
            <Route path="/room/:id/results" element={<RoomResults />} />
            <Route path="/invite/:code" element={<Invite />} />
            <Route path="/admin/matchmaking" element={<AdminMatchmaking />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
