import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Chat from './pages/Chat';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import AuthProvider from "./context/AuthContext";
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ProfileUpdate from './pages/ProfileUpdate';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route 
            exact path="/" 
            element={<PrivateRoute />} 
          >
            <Route exact path="/" element={<Chat />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/profile-update" element={<ProfileUpdate />} />
          </Route>
          <Route 
            exact path="/register" 
            element={<Register />} 
          />
          <Route 
            exact path="/login" 
            element={<Login />} 
          />
          <Route 
            exact path="/forgot-password" 
            element={<ForgotPassword />} 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

