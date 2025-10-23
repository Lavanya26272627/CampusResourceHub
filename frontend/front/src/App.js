// frontend-react/src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components for Layout/Structure
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer"; 
import './style.css'; 

// Authentication Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Dashboard and Content Pages
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import Internships from "./pages/Internships";

// Creation Forms (Ensure NO curly braces {})
import CreateResource from "./pages/CreateResource"; 
import CreateInternship from "./pages/CreateInternship"; 

// --- Wrapper Components (Keep these for styling) ---
const AuthWrapper = ({ children }) => (
    // ... (Your AuthWrapper code)
    <>
      <div 
        className="auth-background"
        style={{
          backgroundImage: 'url(/images/campus-image.jpg)'
        }}
      ></div>
      <div 
          style={{ 
              position: 'relative', 
              zIndex: 10, 
              minHeight: '100vh', 
              display: 'flex',     
              justifyContent: 'center', 
              alignItems: 'center',     
              padding: '20px' 
          }}
      >
          {children}
      </div>
    </>
);

const MainWrapper = ({ children }) => (
    // ... (Your MainWrapper code)
    <>
      <Navbar /> 
      <main style={{ minHeight: 'calc(100vh - 120px)', padding: '20px' }}>
          {children}
      </main>
      <Footer />
    </>
);

// --- Main Application Component ---
function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route: Redirect to Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Authentication Routes */}
        <Route path="/login" element={<AuthWrapper><Login /></AuthWrapper>} />
        <Route path="/register" element={<AuthWrapper><Register /></AuthWrapper>} />

        {/* --- MAIN APP ROUTES --- */}
        <Route path="/dashboard" element={<MainWrapper><Dashboard /></MainWrapper>} />

        {/* Content Viewing Routes */}
        <Route path="/resources" element={<MainWrapper><Resources /></MainWrapper>} />
        <Route path="/internships" element={<MainWrapper><Internships /></MainWrapper>} />

        {/* CREATION ROUTES */}
        <Route path="/create-resource" element={<MainWrapper><CreateResource /></MainWrapper>} /> 
        <Route path="/create-internship" element={<MainWrapper><CreateInternship /></MainWrapper>} />

        <Route path="/faculty" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </Router>
  );
}

export default App;