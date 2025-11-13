import React from 'react';
import '../layout/QuantumHome.css';

const QuantumHome = () => {
  return (
    <div className="quantum-home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Quantum Financial System</h1>
          <p>Best Way To Bank And Secure Your Finances With The QFS</p>
          <p>Quantum Financial System is a decentralized digital banking system, specially designed in partnership with Nesara/Gesara to bring a whole new system to the banking world with strongly backed digital assets and to ensure your finances are safe.</p>
          <div className="hero-buttons">
            <button>Login</button>
            <button>Join Us</button>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="video-section">
        <h2>About QFS</h2>
        <video controls className="intro-video">
          <source src="your-video-source.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>

      {/* Images Section */}
      <section className="images-section">
        <h2>Gallery</h2>
        <div className="images-grid">
          <img src="image1.jpg" alt="Gallery Image 1" />
          <img src="image2.jpg" alt="Gallery Image 2" />
          <img src="image3.jpg" alt="Gallery Image 3" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Our Services</h2>
        <div className="features-grid">
          <div className="feature">
            <h3>Wallet Security</h3>
            <p>Our system is developed to stop any form of cyber attacks that could result to loss of assets.</p>
          </div>
          <div className="feature">
            <h3>Stolen & Asset Recovery</h3>
            <p>Intercept and recover stolen digital assets with help from International Police.</p>
          </div>
          <div className="feature">
            <h3>Sync Your Wallet</h3>
            <p>Designed to fortify your assets with anti-theft and hack security system.</p>
          </div>
          <div className="feature">
            <h3>Humanitarian Project</h3>
            <p>Get access to funds once your Humanitarian Project is approved.</p>
          </div>
          <div className="feature">
            <h3>Assets & Conversion</h3>
            <p>A universal network developed to facilitate the transfer of asset-backed funds.</p>
          </div>
          <div className="feature">
            <h3>Decentralization</h3>
            <p>Break free from current financial system as it is built to collapse.</p>
          </div>
        </div>
      </section>

      {/* Why Choose QFS Section */}
      <section className="why-choose">
        <h2>Why Choose QFS</h2>
        <div className="choose-grid">
          <div>
            <h3>Protection</h3>
            <p>Get your assets secured on our ledger 3 security system.</p>
          </div>
          <div>
            <h3>Innovation</h3>
            <p>QFS is equipped with Web 3 Technology to mitigate any form of centralization.</p>
          </div>
          <div>
            <h3>Decentralization</h3>
            <p>Break free from current financial system as it is built to collapse.</p>
          </div>
          <div>
            <h3>Secured System</h3>
            <p>QFS is encrypted with 256bits and our servers are fortified against any form of attack.</p>
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="how-we-work">
        <h2>How We Work</h2>
        <div className="steps">
          <div>
            <h3>Step 01</h3>
            <h4>Sign Up</h4>
            <p>Sign up for onboarding on QFS, then verify your identity.</p>
          </div>
          <div>
            <h3>Step 02</h3>
            <h4>Wait for Approval</h4>
            <p>Once KYC submission is approved, proceed to sync your wallet with KYC. You can also apply for Humanitarian Project.</p>
          </div>
          <div>
            <h3>Step 03</h3>
            <h4>Get your new QFS card</h4>
            <p>Bid for the new QFS cards that allow you to shop worldwide.</p>
          </div>
        </div>
        <button className="get-started">Get Started</button>
      </section>

      {/* Footer Section */}
      <footer>
        <p>JOIN THE BIGGEST FINANCIAL REVOLUTIONARY SYSTEM DESIGNED TO OVERTAKE THE WORLD'S BANKING SYSTEM BY ELIMINATING CONTROL OF MONEY BY CABALS.</p>
        <div className="contact">
          <p>Email: support@quantumsecuredvault.com</p>
        </div>
        <p>© 2024 Quantum Secured Vault</p>
      </footer>
    </div>
  );
};

export default QuantumHome;

