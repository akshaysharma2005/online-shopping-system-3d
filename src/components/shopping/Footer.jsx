import React, { useState } from 'react';
import { 
  Zap, 
  Send, 
  CheckCircle, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Headphones, 
  Sparkles,
  Globe,
  Lock
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export default function Footer({ onCategoryClick }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    sounds.playSuccess();
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="hyper-footer-wrapper">
      {/* Top Value Assurance Ribbon */}
      <div className="footer-perks-ribbon">
        <div className="ribbon-perk-item">
          <div className="perk-icon-circle">
            <Truck size={20} className="text-cyan" />
          </div>
          <div>
            <h5>Express Global Jet Delivery</h5>
            <p>Complimentary 48-hour air courier on orders over $1,500</p>
          </div>
        </div>

        <div className="ribbon-perk-item">
          <div className="perk-icon-circle">
            <ShieldCheck size={20} className="text-pink" />
          </div>
          <div>
            <h5>2-Year Global Factory Warranty</h5>
            <p>Direct manufacturer replacement with zero deductible</p>
          </div>
        </div>

        <div className="ribbon-perk-item">
          <div className="perk-icon-circle">
            <RotateCcw size={20} className="text-emerald" />
          </div>
          <div>
            <h5>30-Day Hassle-Free Returns</h5>
            <p>Immediate digital refund upon return initiation</p>
          </div>
        </div>

        <div className="ribbon-perk-item">
          <div className="perk-icon-circle">
            <Headphones size={20} className="text-amber" />
          </div>
          <div>
            <h5>24/7 VIP Spatial Concierge</h5>
            <p>Live audio/video assistance from certified hardware specialists</p>
          </div>
        </div>
      </div>

      <div className="footer-main-grid">
        {/* Brand identity column */}
        <div className="footer-brand-column">
          <div className="footer-brand-header">
            <div className="footer-prism-icon">
              <Zap size={22} className="text-cyan" />
            </div>
            <span className="footer-brand-title">AURA<span className="text-cyan">.</span>3D</span>
          </div>
          <p className="footer-brand-lead">
            The spatial hardware ecosystem. Redefining online commerce with interactive WebGL 3D inspection, raytraced materials, and decentralized security.
          </p>
          <div className="footer-tech-stack-strip">
            <span className="tech-chip">WebGL 2.0</span>
            <span className="tech-chip">Three.js 0.182</span>
            <span className="tech-chip">React 19</span>
            <span className="tech-chip">R3F Spatial</span>
          </div>
        </div>

        {/* Hardware categories */}
        <div className="footer-nav-col">
          <h4 className="col-headline">Hardware Drops</h4>
          <ul className="footer-nav-list">
            <li><button onClick={() => onCategoryClick(1)}>Smartphones & Laptops</button></li>
            <li><button onClick={() => onCategoryClick(2)}>Ladies Luxury Wears</button></li>
            <li><button onClick={() => onCategoryClick(3)}>Men's Designer Apparel</button></li>
            <li><button onClick={() => onCategoryClick(5)}>Modern Architectural Furniture</button></li>
            <li><button onClick={() => onCategoryClick(7)}>Acoustic Audio & Gadgets</button></li>
          </ul>
        </div>

        {/* Security & Client Support */}
        <div className="footer-nav-col">
          <h4 className="col-headline">Client Services</h4>
          <ul className="footer-nav-list">
            <li><a href="#tracking">Real-time Order Telemetry</a></li>
            <li><a href="#authenticity">Hardware Authenticity Certificate</a></li>
            <li><a href="#support">Spatial Concierge Live Chat</a></li>
            <li><a href="#returns">Air Courier Returns Protocol</a></li>
            <li><a href="#security">Cryptographic Privacy Policy</a></li>
          </ul>
        </div>

        {/* VIP Drops Newsletter */}
        <div className="footer-newsletter-column">
          <h4 className="col-headline">VIP Drop Frequency</h4>
          <p>Subscribe to receive high-priority notifications before limited-quantity spatial hardware drops go live.</p>

          <form className="newsletter-input-deck" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter encrypted email..."
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="btn-send-newsletter" title="Subscribe to VIP Drops">
              <Send size={15} />
            </button>
          </form>

          {subscribed && (
            <div className="newsletter-confirmed">
              <CheckCircle size={13} className="text-emerald" />
              <span>You're enrolled in the VIP Drop Tier. Check your inbox!</span>
            </div>
          )}
        </div>
      </div>

      {/* Copyright & Disclaimer Bar */}
      <div className="footer-bottom-bar">
        <p>© 2026 AURA 3D SPATIAL HARDWARE PLATFORM. ALL RIGHTS RESERVED.</p>
        <div className="footer-meta-credits">
          <span className="meta-badge"><Lock size={12} className="text-cyan" /> 256-BIT SSL ENCRYPTED</span>
          <span className="meta-badge"><Globe size={12} className="text-emerald" /> GLOBAL 48H AIR COURIER</span>
        </div>
      </div>
    </footer>
  );
}
