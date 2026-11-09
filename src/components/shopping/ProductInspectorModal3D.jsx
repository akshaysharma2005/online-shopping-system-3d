import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float } from '@react-three/drei';
import { 
  PhoneModel, 
  LaptopModel, 
  TabletModel, 
  FashionModel, 
  FurnitureModel, 
  GadgetModel, 
  ParticleField 
} from './ThreeModels';
import { sounds } from '../../utils/soundEffects';
import { 
  X, 
  ShoppingCart, 
  Zap, 
  Box, 
  Palette, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Plus,
  Minus,
  Layers,
  Compass
} from 'lucide-react';

const PRODUCT_COLORS = [
  { name: 'Hyper Cyan', value: '#00f5ff', hexBorder: '#00f5ff' },
  { name: 'Electric Violet', value: '#8b5cf6', hexBorder: '#8b5cf6' },
  { name: 'Liquid Titanium', value: '#cbd5e1', hexBorder: '#ffffff' },
  { name: 'Solar Amber', value: '#ffb703', hexBorder: '#ffb703' },
  { name: 'Cyber Neon Pink', value: '#ec4899', hexBorder: '#ec4899' },
];

export default function ProductInspectorModal3D({
  product,
  onClose,
  onAddToCart,
  onBuyNow
}) {
  const [selectedColor, setSelectedColor] = useState(PRODUCT_COLORS[0].value);
  const [wireframe, setWireframe] = useState(false);
  const [exploded, setExploded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const handleAddToCart = () => {
    sounds.playAddToCart();
    onAddToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuyNow = () => {
    sounds.playAddToCart();
    onBuyNow(product, quantity);
  };

  const render3DModel = () => {
    switch (product.modelType) {
      case 'phone':
        return <PhoneModel color={selectedColor} wireframe={wireframe} exploded={exploded} />;
      case 'laptop':
        return <LaptopModel color={selectedColor} wireframe={wireframe} exploded={exploded} />;
      case 'tablet':
        return <TabletModel color={selectedColor} wireframe={wireframe} />;
      case 'fashion':
        return <FashionModel color={selectedColor} wireframe={wireframe} />;
      case 'furniture':
        return <FurnitureModel color={selectedColor} wireframe={wireframe} />;
      default:
        return <GadgetModel color={selectedColor} wireframe={wireframe} />;
    }
  };

  return (
    <div className="hyper-modal-backdrop" onClick={onClose}>
      <div className="hyper-inspector-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="inspector-exit-btn" onClick={onClose} title="Close Vault Inspector">
          <X size={20} />
        </button>

        <div className="inspector-split-layout">
          {/* Left Side: 3D Interactive WebGL Stage */}
          <div className="inspector-3d-pane">
            <div className="pane-top-hud">
              <span className="live-hologram-pill">
                <span className="hologram-glow-dot"></span>
                <span>INTERACTIVE 3D VAULT INSPECTOR</span>
              </span>

              <div className="pane-tools">
                {(product.modelType === 'phone' || product.modelType === 'laptop') && (
                  <button
                    className={`tool-pill ${exploded ? 'active' : ''}`}
                    onClick={() => {
                      sounds.play3DInspect();
                      setExploded(!exploded);
                    }}
                  >
                    <Layers size={13} />
                    <span>{exploded ? 'Collapse' : 'Explode 3D'}</span>
                  </button>
                )}

                <button
                  className={`tool-pill ${wireframe ? 'active' : ''}`}
                  onClick={() => {
                    sounds.playClick();
                    setWireframe(!wireframe);
                  }}
                >
                  <Box size={13} />
                  <span>{wireframe ? 'PBR Solid' : 'Hologram'}</span>
                </button>
              </div>
            </div>

            {/* Canvas Viewport */}
            <div className="inspector-webgl-stage">
              <Canvas
                camera={{ position: [0, 0, 4.8], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
              >
                <color attach="background" args={['#04060c']} />
                <ambientLight intensity={1.2} color="#00f5ff" />
                <directionalLight position={[5, 6, 4]} intensity={2.6} color="#ffffff" castShadow />
                <directionalLight position={[-5, -2, -3]} intensity={1.8} color="#ec4899" />
                <pointLight position={[0, 3, 2]} intensity={1.5} color="#00f5ff" />

                <ParticleField count={600} color="#00f5ff" />

                <Suspense fallback={null}>
                  <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
                    {render3DModel()}
                  </Float>
                  <ContactShadows
                    position={[0, -1.8, 0]}
                    opacity={0.7}
                    scale={9}
                    blur={2.4}
                    far={4}
                    color="#00f5ff"
                  />
                </Suspense>

                <OrbitControls
                  enablePan={false}
                  enableZoom={true}
                  minDistance={2.4}
                  maxDistance={7}
                  dampingFactor={0.05}
                />
              </Canvas>

              <div className="stage-drag-helper">
                <Compass size={13} />
                <span>Drag to inspect 360° • Zoom with wheel • Click Explode to see internals</span>
              </div>
            </div>

            {/* Color Swatch Strip */}
            <div className="inspector-color-strip">
              <span className="strip-title"><Palette size={13} /> FINISH:</span>
              <div className="swatches-row">
                {PRODUCT_COLORS.map((c) => (
                  <button
                    key={c.name}
                    className={`hyper-color-pill ${selectedColor === c.value ? 'selected' : ''}`}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedColor(c.value);
                    }}
                  >
                    <span className="color-core" style={{ backgroundColor: c.value }}></span>
                    <span className="color-label">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Product Editorial Sheet */}
          <div className="inspector-spec-sheet">
            <div className="sheet-header">
              <div className="sheet-tag-cluster">
                <span className="pill-tag cyan">{product.categoryName}</span>
                <span className="pill-tag">{product.brandName}</span>
                <span className="pill-tag in-stock">
                  <CheckCircle2 size={12} />
                  <span>IN STOCK</span>
                </span>
              </div>
              <span className="sku-label">SKU: 00{product.id}X-PRO</span>
            </div>

            <h2 className="sheet-title">{product.title}</h2>

            <div className="sheet-ratings">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    className={i < Math.floor(product.rating) ? 'star-gold' : 'star-dim'}
                  />
                ))}
              </div>
              <span className="rating-val">{product.rating}</span>
              <span className="review-tally">({product.reviewsCount} verified reviews)</span>
            </div>

            <div className="sheet-price-block">
              <span className="hero-price">${product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="original-strike">${product.originalPrice.toLocaleString()}</span>
                  <span className="discount-pill">-{product.discountPercent}% OFF</span>
                </>
              )}
            </div>

            <p className="sheet-desc">{product.description}</p>

            {/* Spec Table */}
            <div className="sheet-specs-table">
              <div className="spec-item-row">
                <span className="row-key">Product Line</span>
                <span className="row-val">{product.categoryName}</span>
              </div>
              <div className="spec-item-row">
                <span className="row-key">Certified Brand</span>
                <span className="row-val">{product.brandName}</span>
              </div>
              <div className="spec-item-row">
                <span className="row-key">3D Rendering Pipeline</span>
                <span className="row-val">Raytraced PBR & Wireframe</span>
              </div>
              <div className="spec-item-row">
                <span className="row-key">Warranty Protection</span>
                <span className="row-val">2 Years Global Concierge</span>
              </div>
              <div className="spec-item-row">
                <span className="row-key">Keywords</span>
                <span className="row-val">{product.keywords}</span>
              </div>
            </div>

            {/* Quantity & Buy Button Cluster */}
            <div className="sheet-actions-cluster">
              <div className="qty-capsule">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setQuantity((q) => Math.max(1, q - 1));
                  }}
                  disabled={quantity <= 1}
                >
                  <Minus size={13} />
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setQuantity((q) => q + 1);
                  }}
                >
                  <Plus size={13} />
                </button>
              </div>

              <button
                className={`btn-bag-primary ${addedAnimation ? 'added' : ''}`}
                onClick={handleAddToCart}
              >
                <ShoppingCart size={17} />
                <span>{addedAnimation ? 'Added to Bag ✓' : 'Add to Vault Bag'}</span>
              </button>

              <button
                className="btn-instant-buy"
                onClick={handleBuyNow}
              >
                <Zap size={17} />
                <span>Instant Checkout</span>
              </button>
            </div>

            {/* Perks */}
            <div className="sheet-perks-row">
              <div className="perk-pill">
                <Truck size={14} className="text-cyan" />
                <span>Free Express Air Delivery (48h)</span>
              </div>
              <div className="perk-pill">
                <RotateCcw size={14} className="text-pink" />
                <span>30-Day No-Questions Return</span>
              </div>
              <div className="perk-pill">
                <ShieldCheck size={14} className="text-emerald" />
                <span>256-Bit Cryptographic Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
