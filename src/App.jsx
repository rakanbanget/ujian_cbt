import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { NetworkStatus } from './components/NetworkStatus';
import LoginPage from './components/LoginPage';
import ExamSelectionPage from './components/ExamSelectionPage';
import ExamPage from './components/ExamPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NetworkStatus />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/select-exam"
            element={
              <ProtectedRoute>
                <ExamSelectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exam/:examId"
            element={
              <ProtectedRoute>
                <ExamPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
