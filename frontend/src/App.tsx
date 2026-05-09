import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/layouts/DashboardLayout";

// Pages
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import CADashboard from "@/pages/ca/CADashboard";
import CAClients from "@/pages/ca/CAClients";
import CADocuments from "@/pages/ca/CADocuments";
import StaffDashboard from "@/pages/staff/StaffDashboard";
import ClientDashboard from "@/pages/client/ClientDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Master Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['master_admin']}><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="firms" element={<AdminDashboard />} />
              <Route path="plans" element={<AdminDashboard />} />
              <Route path="users" element={<AdminDashboard />} />
              <Route path="settings" element={<AdminDashboard />} />
            </Route>

            {/* CA Routes */}
            <Route path="/ca" element={<ProtectedRoute allowedRoles={['ca']}><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<CADashboard />} />
              <Route path="clients" element={<CAClients />} />
              <Route path="sub-users" element={<CADashboard />} />
              <Route path="documents" element={<CADocuments />} />
              <Route path="subscription" element={<CADashboard />} />
              <Route path="audit-logs" element={<CADashboard />} />
              <Route path="settings" element={<CADashboard />} />
            </Route>

            {/* Staff Routes */}
            <Route path="/staff" element={<ProtectedRoute allowedRoles={['sub_user']}><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<StaffDashboard />} />
              <Route path="clients" element={<StaffDashboard />} />
              <Route path="documents" element={<StaffDashboard />} />
              <Route path="tasks" element={<StaffDashboard />} />
              <Route path="settings" element={<StaffDashboard />} />
            </Route>

            {/* Client Routes */}
            <Route path="/client" element={<ProtectedRoute allowedRoles={['client']}><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<ClientDashboard />} />
              <Route path="documents" element={<ClientDashboard />} />
              <Route path="profile" element={<ClientDashboard />} />
              <Route path="settings" element={<ClientDashboard />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
