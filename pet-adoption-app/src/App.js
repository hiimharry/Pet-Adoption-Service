import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';  // Ensure path is correct
import NavBar from './components/navbar';
import Register from './screens/register';
import Login from './screens/login';
import AdoptableAnimals from './screens/adoptableAnimals';
import AddAnimal from './screens/animalRegistration';
import AnimalDetail from './screens/individualAnimal';
import UserInterests from './screens/InterestedList';
import ApplicationForm from './screens/adoptionApplication';
import SuccessPage from './screens/SuccessPage';
import UserApplications from './screens/UserApplications';
import UserProfile from './screens/Account';
import AdminApplications from './screens/AdminApplications';
import { Typography } from '@mui/material';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/animals" element={<PrivateRoute><AdoptableAnimals /></PrivateRoute>} />
          <Route path="/addanimals" element={<PrivateRoute><AddAnimal /></PrivateRoute>} />
          <Route path="/animals/:animalId" element={<PrivateRoute><AnimalDetail /></PrivateRoute>} />
          <Route path="/interests" element={<PrivateRoute><UserInterests /></PrivateRoute>} />
          <Route path="/apply/:animalId" element={<PrivateRoute><ApplicationForm /></PrivateRoute>} />
          <Route path="/success" element={<PrivateRoute><SuccessPage /></PrivateRoute>} />
          <Route path="/applications" element={<PrivateRoute><UserApplications /></PrivateRoute>} />
          <Route path="/account" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminApplications /></AdminRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} /> {/* Redirect unknown paths */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function HomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
      return <Typography>Loading...</Typography>; // Display while loading
  }

  return user ? <Navigate to="/animals" replace /> : <Navigate to="/login" replace />;
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Typography>Loading...</Typography>; // Or any other loading indicator
  }

  return user ? children : <Navigate to="/login" replace state={{ from: location }} />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Typography>Loading...</Typography>; // Display loading indicator
  }

  return user && user.admin ? children : <Navigate to="/animals" replace state={{ from: location }} />;
}


export default App;
