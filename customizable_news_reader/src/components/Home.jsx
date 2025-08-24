import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

const Home = () => (
  <div className="home">
    {/* Navbar */}
    <header className="navbar-beige shadow-sm">
      <nav className="container navbar navbar-expand-lg">
        <Link className="navbar-brand fw-bold text-brown" to="/">Customizable News Reader</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link text-brown" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-brown" to="/about-us">About</Link>
            </li>
          </ul>
          <Link to="/login" className="btn btn-outline-brown">Login/Register</Link>
        </div>
      </nav>
    </header>

    {/* Hero Section */}
    <section className="hero-section py-5">
      <div className="container text-center">
        <h1 className="display-4 fw-light text-brown">Your News, Your Way</h1>
        <p className="lead fw-light text-brown">Get the latest news tailored to your interests with our customizable platform.</p>
        <Link to="/register" className="btn btn-brown mt-3">Get Started</Link>
      </div>
    </section>

    {/* Features Section */}
    <div className="container my-5">
      <section>
        <h2 className="text-center text-brown mb-4 fw-light">Features</h2>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card feature-card white-card" style={{ backgroundColor: '#ffffff !important' }}>
              <div className="card-body">
                <h5 className="card-title text-brown">Topic Selection</h5>
                <p className="card-text">Choose, reorder, or remove topics like sports, politics, and entertainment to suit your preferences.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card feature-card white-card" style={{ backgroundColor: '#ffffff !important' }}>
              <div className="card-body">
                <h5 className="card-title text-brown">Keyword Filtering</h5>
                <p className="card-text">Set filters to display articles with specific keywords or hide content you're not interested in.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card feature-card white-card" style={{ backgroundColor: '#ffffff !important' }}>
              <div className="card-body">
                <h5 className="card-title text-brown">AI-Powered Personalization</h5>
                <p className="card-text">Use advanced AI algorithms to get news recommendations tailored to your reading habits.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    {/* Advantages Section */}
    <div className="container my-5">
      <section>
        <h2 className="text-center text-brown mb-4 fw-light">Advantages</h2>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card advantage-card white-card" style={{ backgroundColor: '#ffffff !important' }}>
              <div className="card-body">
                <h5 className="card-title text-brown">Time Efficiency</h5>
                <p className="card-text">Quickly browse through relevant news without wasting time on unwanted topics.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card advantage-card white-card" style={{ backgroundColor: '#ffffff !important' }}>
              <div className="card-body">
                <h5 className="card-title text-brown">Better Engagement</h5>
                <p className="card-text">Enjoy a tailored experience that keeps you coming back for more curated content.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card advantage-card white-card" style={{ backgroundColor: '#ffffff !important' }}>
              <div className="card-body">
                <h5 className="card-title text-brown">Enhanced Control</h5>
                <p className="card-text">Take full control of your news feed by customizing it according to your needs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    {/* Footer */}
    <footer className="footer-beige text-center py-4">
      <p className="mb-0 text-brown">© 2025 Customizable News Reader. All rights reserved.</p>
    </footer>
  </div>
);

export default Home;