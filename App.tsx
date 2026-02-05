import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCases from './pages/admin/AdminCases';
import AdminNotices from './pages/admin/AdminNotices';
import AdminLeads from './pages/admin/AdminLeads';
import AdminSettings from './pages/admin/AdminSettings';

// Fix: Made children optional to resolve the TS error on line 28 where children are incorrectly reported as missing by the compiler
const PrivateRoute = ({ children }: { children?: React.ReactNode }) => {
  const isAuthed = sessionStorage.getItem('adminAuthed') === 'true';
  return isAuthed ? <>{children}</> : <Navigate to="/admin/login" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/*" 
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="cases" element={<AdminCases />} />
          <Route path="notices" element={<AdminNotices />} />
          <Route path="leads" element={<AdminLeads />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
