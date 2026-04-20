import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './context/LanguageContext';
import LandingPage from './pages/LandingPage';
import MultiStepForm from './pages/MultiStepForm';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gnanam-cream text-gray-800">
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#363636',
              boxShadow: '0 10px 40px -10px rgba(0,0,0,0.3)',
              borderRadius: '12px',
              padding: '16px 24px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
              style: {
                borderLeft: '4px solid #22c55e',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
              style: {
                borderLeft: '4px solid #ef4444',
              },
            },
          }}
        />
        <LanguageProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/submit" element={<MultiStepForm />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </LanguageProvider>
      </div>
    </Router>
  );
}

export default App;
