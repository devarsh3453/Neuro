import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Attempt from './pages/Attempt';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/"          element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/attempt"   element={<Attempt />} />
            <Route path="/admin"     element={<AdminDashboard />} />
            <Route path="*"          element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
