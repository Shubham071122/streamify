import './App.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NoPage from './pages/NoPage';
import LandingPage from "./pages/LandingPage";
import HomePage from './pages/home/HomePage'
import PrivateRoute from './components/PrivateRoute';
import  { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/home"
                element={
                  <PrivateRoute>
                    <HomePage />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<NoPage />} />
            </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
