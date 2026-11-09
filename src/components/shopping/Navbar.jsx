import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  Sliders, 
  Volume2, 
  VolumeX, 
  Menu, 
  X, 
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export default function Navbar({
  searchTerm,
  onSearchChange,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenGraphicsModal,
  soundEnabled,
  onToggleSound,
  onNavClick
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="hyper-nav-wrapper">
      <div className="hyper-nav-inner">
        {/* Brand Logo with 3D Holographic Prism */}
        <div className="hyper-brand" onClick={() => onNavClick('hero')}>
          <div className="brand-hologram-prism">
            <div className="prism-inner">
              <Zap size={20} className="prism-icon" />
            </div>
            <div className="prism-glow"></div>
          </div>
          <div className="brand-titles">
            <span className="brand-name">AURA<span className="brand-glow-dot">.</span>3D</span>
            <span className="brand-tagline">SPATIAL HARDWARE VAULT</span>
          </div>
        </div>

        {/* Global Live Search Bar */}
        <div className="hyper-search-container">
          <Search size={16} className="search-svg" />
          <input
            type="text"
            placeholder="Search phones, laptops, apparel, furnitures..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => onSearchChange('')}>
              <X size={13} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="hyper-nav-links">
          <button className="nav-item" onClick={() => onNavClick('hero')}>
            <span>3D Stage</span>
          </button>
          <button className="nav-item" onClick={() => onNavClick('catalog')}>
            <span>Hardware Catalog</span>
          </button>
          <button className="nav-item hot-drop" onClick={() => onNavClick('deals')}>
            <Sparkles size={13} />
            <span>Drop Deals</span>
          </button>
        </nav>

        {/* Control Cluster */}
        <div className="hyper-controls">
          {/* Audio Feedback Toggle */}
          <button
            className="control-icon-btn"
            onClick={() => {
              sounds.playClick();
              onToggleSound();
            }}
            title={soundEnabled ? 'Mute Spatial Audio' : 'Unmute Spatial Audio'}
          >
            {soundEnabled ? <Volume2 size={18} className="text-cyan" /> : <VolumeX size={18} />}
          </button>

          {/* 3D Graphics Settings */}
          <button
            className="control-icon-btn graphics-pill-btn"
            onClick={() => {
              sounds.playClick();
              onOpenGraphicsModal();
            }}
            title="3D Graphics & Shader Engine Settings"
          >
            <Sliders size={17} />
            <span className="btn-txt">3D Engine</span>
          </button>

          {/* Wishlist */}
          <button
            className="control-icon-btn wishlist-btn"
            onClick={() => {
              sounds.playClick();
              onOpenWishlist();
            }}
            title="Wishlist"
          >
            <Heart size={18} />
            {wishlistCount > 0 && <span className="neon-badge heart-badge">{wishlistCount}</span>}
          </button>

          {/* Shopping Cart Button */}
          <button
            className="hyper-cart-btn"
            onClick={() => {
              sounds.playClick();
              onOpenCart();
            }}
            title="Open Cart"
          >
            <ShoppingCart size={18} />
            <span className="cart-txt">Vault Bag</span>
            {cartCount > 0 && <span className="cart-pill-count">{cartCount}</span>}
          </button>

          {/* Mobile Menu */}
          <button
            className="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="hyper-mobile-drawer">
          <div className="mobile-search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className="mobile-nav-links">
            <button onClick={() => { onNavClick('hero'); setMobileMenuOpen(false); }}>3D Stage</button>
            <button onClick={() => { onNavClick('catalog'); setMobileMenuOpen(false); }}>Hardware Catalog</button>
            <button onClick={() => { onNavClick('deals'); setMobileMenuOpen(false); }}>Drop Deals</button>
            <button onClick={() => { onOpenGraphicsModal(); setMobileMenuOpen(false); }}>3D Engine Settings</button>
          </div>
        </div>
      )}
    </header>
  );
}
