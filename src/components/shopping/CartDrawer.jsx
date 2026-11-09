import React, { useState } from 'react';
import { 
  X, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  CheckCircle2, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onProceedToCheckout
}) {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 25;
  const taxes = Math.round(subtotal * 0.08);
  const total = Math.max(0, subtotal - discountAmount + shipping + taxes);

  const applyPromo = (e) => {
    e.preventDefault();
    sounds.playClick();
    const code = promoCode.trim().toUpperCase();
    if (code === 'NEO2026' || code === 'SAVE20' || code === 'CYBER') {
      setDiscountPercent(20);
      setPromoSuccess('20% Spatial VIP Discount activated!');
      setPromoError('');
    } else if (code === 'VIP50') {
      setDiscountPercent(50);
      setPromoSuccess('50% Super VIP Discount activated!');
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try "NEO2026" or "VIP50"');
      setPromoSuccess('');
    }
  };

  return (
    <div className="hyper-drawer-backdrop" onClick={onClose}>
      <div className="hyper-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header-strip">
          <div className="drawer-brand-cluster">
            <div className="drawer-icon-wrap">
              <ShoppingCart size={20} className="text-cyan" />
            </div>
            <div>
              <h3>Vault Bag</h3>
              <p>Your Selected Spatial Hardware</p>
            </div>
            <span className="drawer-count-badge">{cartItems.reduce((a, b) => a + b.quantity, 0)}</span>
          </div>
          <button className="drawer-close-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body-scroll">
          {cartItems.length === 0 ? (
            <div className="empty-vault-view">
              <div className="empty-icon-ring">
                <ShoppingCart size={40} className="text-muted" />
              </div>
              <h4>Your Vault Bag is Empty</h4>
              <p>Discover high-performance hardware in our 3D spatial catalog.</p>
              <button
                className="hyper-btn-primary mt-3"
                onClick={() => {
                  sounds.playClick();
                  onClose();
                }}
              >
                Start Exploring
              </button>
            </div>
          ) : (
            <div className="drawer-items-column">
              {cartItems.map((item) => (
                <div key={item.id} className="drawer-item-card">
                  <div className="item-thumbnail">
                    <img
                      src={`/product_images/${encodeURIComponent(item.image)}`}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.src = `/img/${encodeURIComponent(item.image)}`;
                      }}
                    />
                  </div>

                  <div className="item-info-col">
                    <h5 className="item-name">{item.title}</h5>
                    <span className="item-brand-category">{item.brandName} • {item.categoryName}</span>
                    <span className="item-price-tag">${item.price.toLocaleString()}</span>

                    <div className="item-controls-row">
                      <div className="mini-qty-box">
                        <button
                          onClick={() => {
                            sounds.playClick();
                            onUpdateQty(item.id, Math.max(1, item.quantity - 1));
                          }}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={12} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => {
                            sounds.playClick();
                            onUpdateQty(item.id, item.quantity + 1);
                          }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        className="btn-trash-item"
                        onClick={() => {
                          sounds.playRemove();
                          onRemoveItem(item.id);
                        }}
                        title="Remove Hardware"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="item-total-col">
                    <span>${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="drawer-footer-panel">
            {/* Promo Code Input */}
            <form className="drawer-promo-box" onSubmit={applyPromo}>
              <div className="promo-input-wrap">
                <Tag size={15} className="promo-icon text-cyan" />
                <input
                  type="text"
                  placeholder="Code (e.g. NEO2026 or VIP50)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button type="submit">Apply</button>
              </div>
              {promoSuccess && <span className="promo-status success"><CheckCircle2 size={11} /> {promoSuccess}</span>}
              {promoError && <span className="promo-status error">{promoError}</span>}
            </form>

            {/* Price Breakdown */}
            <div className="drawer-cost-breakdown">
              <div className="breakdown-row">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="breakdown-row text-emerald font-bold">
                  <span>VIP Discount ({discountPercent}%)</span>
                  <span>-${discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="breakdown-row">
                <span>Express Courier Shipping</span>
                <span className="text-cyan">{shipping === 0 ? 'FREE (OVER $1,500)' : `$${shipping}`}</span>
              </div>
              <div className="breakdown-row">
                <span>Estimated Tax (8%)</span>
                <span>${taxes.toLocaleString()}</span>
              </div>
              <div className="breakdown-row total-highlight">
                <span>Total Due</span>
                <span className="total-cyan">${total.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              className="hyper-checkout-btn"
              onClick={() => {
                sounds.playClick();
                onProceedToCheckout(total, discountAmount);
              }}
            >
              <span>Instant Spatial Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div className="drawer-security-note">
              <ShieldCheck size={14} className="text-emerald" />
              <span>256-Bit Quantum Resistant SSL Protected</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
