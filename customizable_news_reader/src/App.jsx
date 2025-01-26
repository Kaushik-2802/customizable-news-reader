import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import NewsCarousel from './components/NewsCarousel';
import Navbar from './components/NavBar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/NewsShorts" element={<><Navbar /><NewsCarousel /></>} />
      </Routes>
    </Router>
  );
}

export default App;
