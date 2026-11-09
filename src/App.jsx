import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/shopping/Navbar';
import Hero3D from './components/shopping/Hero3D';
import ProductCatalog from './components/shopping/ProductCatalog';
import ProductInspectorModal3D from './components/shopping/ProductInspectorModal3D';
import CartDrawer from './components/shopping/CartDrawer';
import CheckoutModal from './components/shopping/CheckoutModal';
import WishlistDrawer from './components/shopping/WishlistDrawer';
import GraphicsSettingsModal from './components/shopping/GraphicsSettingsModal';
import Footer from './components/shopping/Footer';
import productsData from './data/products.json';
import { sounds } from './utils/soundEffects';

import './styles/shopping.scss';

export default function App() {
  // Navigation & Search State
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals & Drawers State
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [graphicsModalOpen, setGraphicsModalOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [inspectProductId, setInspectProductId] = useState(null);

  // Graphics Settings
  const [graphicsSettings, setGraphicsSettings] = useState({
    preset: 'ultra',
    particles: 2000,
    bloom: true,
    shadows: true,
    wireframe: false,
    soundEnabled: true,
  });

  // Cart State (stored in localStorage)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cybershop_cart');
      return saved ? JSON.parse(saved) : [
        {
          id: 1,
          title: 'Samsung galaxy s7 edge',
          price: 5000,
          quantity: 1,
          image: 'product07.png',
          categoryName: 'Electronics',
          brandName: 'Samsung',
        },
        {
          id: 4,
          title: 'iPhone 6s',
          price: 32000,
          quantity: 1,
          image: 'http___pluspng.com_img-png_iphone-6s-png-iphone-6s-gold-64gb-1000.png',
          categoryName: 'Electronics',
          brandName: 'Apple',
        }
      ];
    } catch {
      return [];
    }
  });

  // Wishlist State (stored in localStorage)
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const saved = localStorage.getItem('cybershop_wishlist');
      return saved ? JSON.parse(saved) : [3, 7, 10];
    } catch {
      return [3, 7, 10];
    }
  });

  // References for smooth scrolling
  const heroRef = useRef(null);
  const catalogRef = useRef(null);
  const dealsRef = useRef(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cybershop_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Could not save cart:', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('cybershop_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.warn('Could not save wishlist:', e);
    }
  }, [wishlistIds]);

  // Cart Handlers
  const handleAddToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          quantity,
          image: product.image,
          categoryName: product.categoryName,
          brandName: product.brandName,
        },
      ];
    });
  };

  const handleUpdateCartQty = (id, newQty) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Wishlist Handlers
  const handleToggleWishlist = (id) => {
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 3D Inspector Handlers
  const inspectedProduct = productsData.products.find(
    (p) => p.id === inspectProductId
  );

  const handleOpenInspect = (id) => {
    setInspectProductId(id);
  };

  const handleCloseInspect = () => {
    setInspectProductId(null);
  };

  const handleBuyNow = (product, quantity) => {
    handleAddToCart(product, quantity);
    setInspectProductId(null);
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  // Checkout Handlers
  const handleProceedToCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleOrderCompleted = () => {
    setCartItems([]);
  };

  // Nav scroll handler
  const handleNavClick = (section) => {
    sounds.playClick();
    if (section === 'hero' && heroRef.current) {
      heroRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'catalog' && catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'deals' && dealsRef.current) {
      dealsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="cyberstore-app">
      {/* Sticky Navigation Bar */}
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenGraphicsModal={() => setGraphicsModalOpen(true)}
        soundEnabled={graphicsSettings.soundEnabled}
        onToggleSound={() =>
          setGraphicsSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))
        }
        onNavClick={handleNavClick}
      />

      {/* Hero 3D Section */}
      <div ref={heroRef}>
        <Hero3D
          onExploreCatalog={() => handleNavClick('catalog')}
          onOpenProductInspect={handleOpenInspect}
        />
      </div>

      {/* Product Catalog & Hot Deals */}
      <ProductCatalog
        productsData={productsData}
        searchTerm={searchTerm}
        onOpenInspect={handleOpenInspect}
        onAddToCart={handleAddToCart}
        wishlistIds={wishlistIds}
        onToggleWishlist={handleToggleWishlist}
        catalogRef={catalogRef}
        dealsRef={dealsRef}
      />

      {/* 3D Product Inspector Modal */}
      {inspectedProduct && (
        <ProductInspectorModal3D
          product={inspectedProduct}
          onClose={handleCloseInspect}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlistIds={wishlistIds}
        products={productsData.products}
        onAddToCart={handleAddToCart}
        onRemoveFromWishlist={handleToggleWishlist}
        onOpenInspect={handleOpenInspect}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={cartItems}
        totalAmount={cartItems.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        )}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Graphics & Performance Settings Modal */}
      <GraphicsSettingsModal
        isOpen={graphicsModalOpen}
        onClose={() => setGraphicsModalOpen(false)}
        settings={graphicsSettings}
        onUpdateSettings={(newSettings) =>
          setGraphicsSettings((prev) => ({ ...prev, ...newSettings }))
        }
      />

      {/* Site Footer */}
      <Footer
        onCategoryClick={(cid) => {
          handleNavClick('catalog');
        }}
      />
    </div>
  );
}
