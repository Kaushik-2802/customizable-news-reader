import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

const Home = () => (
  <div className="home">
    {/* Navbar */}
    <header className="bg-primary text-white shadow-sm">
      <nav className="container navbar navbar-expand-lg">
        <Link className="navbar-brand text-white fw-bold" to="/">Customizable News Reader</Link>
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
              <Link className="nav-link text-white" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/about-us">About</Link>
            </li>
          </ul>
          <Link to="/login" className="btn btn-light text-primary fw-bold">Login/Register</Link>
        </div>
      </nav>
    </header>

    {/* Hero Section */}
    <section className="hero-section text-white py-5">
      <div className="container text-center">
        <h1 className="display-4 fw-bold">Your News, Your Way</h1>
        <p className="lead">Get the latest news tailored to your interests with our customizable platform.</p>
      </div>
    </section>

    {/* Features Section */}
    <div className="container my-5">
      <section>
        <h2 className="text-center text-primary mb-4 fw-bold">Features</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="card feature-card shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-primary fw-bold">Topic Selection</h5>
                <p className="card-text">Choose, reorder, or remove topics like sports, politics, and entertainment to suit your preferences.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card feature-card shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-primary fw-bold">Keyword Filtering</h5>
                <p className="card-text">Set filters to display articles with specific keywords or hide content you're not interested in.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card feature-card shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-primary fw-bold">AI-Powered Personalization</h5>
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
        <h2 className="text-center text-primary mb-4 fw-bold">Advantages</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="card advantage-card shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-primary fw-bold">Time Efficiency</h5>
                <p className="card-text">Quickly browse through relevant news without wasting time on unwanted topics.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card advantage-card shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-primary fw-bold">Better Engagement</h5>
                <p className="card-text">Enjoy a tailored experience that keeps you coming back for more curated content.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card advantage-card shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-primary fw-bold">Enhanced Control</h5>
                <p className="card-text">Take full control of your news feed by customizing it according to your needs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    {/* Footer */}
    <footer className="bg-primary text-white text-center py-3">
      <p className="mb-0">© 2024 Customizable News Reader. All rights reserved.</p>
    </footer>
  </div>
);

export default Home;
