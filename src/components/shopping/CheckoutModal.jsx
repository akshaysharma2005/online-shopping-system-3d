import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  DollarSign, 
  Package, 
  Sparkles,
  Download,
  Lock,
  Zap
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  totalAmount,
  onOrderCompleted
}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: 'Alex Vance',
    email: 'alex.vance@aura-vault.io',
    address: '742 Evergreen Terrace, Sector 4',
    city: 'Neo Tokyo',
    zipCode: '10001',
    country: 'United States',
    paymentMethod: 'card',
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '888',
  });
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextToPayment = (e) => {
    e.preventDefault();
    sounds.playClick();
    setStep(2);
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    sounds.playSuccess();
    const generatedId = 'AURA-ORD-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(generatedId);
    setStep(3);

    // Multicolored celebration confetti blast!
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#00f5ff', '#8b5cf6', '#ec4899', '#ffb703', '#10b981'],
    });

    onOrderCompleted();
  };

  return (
    <div className="hyper-modal-backdrop" onClick={onClose}>
      <div className="hyper-checkout-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="checkout-top-bar">
          <div className="bar-title-group">
            <div className="lock-icon-wrap">
              <Lock size={18} className="text-cyan" />
            </div>
            <div>
              <h3>AURA // SECURE SPATIAL CHECKOUT</h3>
              <p>256-Bit Cryptographic SSL Gateway</p>
            </div>
          </div>
          <button className="checkout-exit-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Stepper Progress */}
        <div className="checkout-progress-stepper">
          <div className={`step-node ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`}>
            <span className="node-num">{step > 1 ? '✓' : '1'}</span>
            <span className="node-title">Destination</span>
          </div>
          <div className="node-line"></div>
          <div className={`step-node ${step >= 2 ? 'active' : ''} ${step > 2 ? 'done' : ''}`}>
            <span className="node-num">{step > 2 ? '✓' : '2'}</span>
            <span className="node-title">Payment Vault</span>
          </div>
          <div className="node-line"></div>
          <div className={`step-node ${step === 3 ? 'active done' : ''}`}>
            <span className="node-num">{step === 3 ? '✓' : '3'}</span>
            <span className="node-title">Confirmation</span>
          </div>
        </div>

        {/* STEP 1: Shipping Details */}
        {step === 1 && (
          <form className="checkout-form-content" onSubmit={handleNextToPayment}>
            <div className="form-subheading">
              <Truck size={17} className="text-cyan" />
              <h4>Global Air Courier Destination</h4>
            </div>

            <div className="form-two-col-grid">
              <div className="input-group full-span">
                <label>Recipient Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Alex Vance"
                />
              </div>

              <div className="input-group full-span">
                <label>Encrypted Email (For Order Invoice)</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="alex.vance@vault.io"
                />
              </div>

              <div className="input-group full-span">
                <label>Physical Address</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street, Suite, Sector"
                />
              </div>

              <div className="input-group">
                <label>City / Megacity</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>

              <div className="input-group">
                <label>Postal / Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  required
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="checkout-action-row">
              <button type="button" className="hyper-btn-secondary" onClick={onClose}>
                Back to Vault Bag
              </button>
              <button type="submit" className="hyper-btn-primary">
                <span>Proceed to Payment</span>
                <ArrowRight size={17} />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Payment Details */}
        {step === 2 && (
          <form className="checkout-form-content" onSubmit={handlePlaceOrder}>
            <div className="form-subheading">
              <CreditCard size={17} className="text-cyan" />
              <h4>Select Preferred Payment Architecture</h4>
            </div>

            {/* Payment Method Cards */}
            <div className="payment-options-grid">
              <label className={`payment-tab-card ${formData.paymentMethod === 'card' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleInputChange}
                />
                <CreditCard size={20} className="tab-icon" />
                <span>Credit / Debit Card</span>
              </label>

              <label className={`payment-tab-card ${formData.paymentMethod === 'apple' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="apple"
                  checked={formData.paymentMethod === 'apple'}
                  onChange={handleInputChange}
                />
                <Sparkles size={20} className="tab-icon text-cyan" />
                <span>Apple Pay / UPI</span>
              </label>

              <label className={`payment-tab-card ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleInputChange}
                />
                <DollarSign size={20} className="tab-icon text-emerald" />
                <span>Cash on Delivery</span>
              </label>
            </div>

            {/* Simulated Card Fields */}
            {formData.paymentMethod === 'card' && (
              <div className="card-mock-shell">
                <div className="input-group full-span">
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    required
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="card-sub-grid">
                  <div className="input-group">
                    <label>Expires</label>
                    <input
                      type="text"
                      name="cardExp"
                      required
                      value={formData.cardExp}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="input-group">
                    <label>CVC Security</label>
                    <input
                      type="text"
                      name="cardCvc"
                      required
                      value={formData.cardCvc}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Total Mini Summary */}
            <div className="checkout-summary-pill">
              <div className="sum-line">
                <span>Hardware Items ({cartItems.length})</span>
                <span>${totalAmount.toLocaleString()}</span>
              </div>
              <div className="sum-line bold-total">
                <span>Total Authorization</span>
                <span className="total-cyan">${totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="checkout-action-row">
              <button
                type="button"
                className="hyper-btn-secondary"
                onClick={() => {
                  sounds.playClick();
                  setStep(1);
                }}
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <button type="submit" className="hyper-btn-primary">
                <span>Authorize & Place Order (${totalAmount.toLocaleString()})</span>
                <CheckCircle size={17} />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Order Confirmation */}
        {step === 3 && (
          <div className="checkout-success-view">
            <div className="celebration-beacon">
              <CheckCircle size={60} className="text-emerald check-svg" />
            </div>

            <h2>ORDER AUTHENTICATED & CONFIRMED</h2>
            <p className="order-lead-text">
              Your hardware allocation has been secured. A cryptographic delivery tracking certificate has been dispatched to <strong>{formData.email}</strong>.
            </p>

            <div className="order-digital-receipt">
              <div className="receipt-top-row">
                <div>
                  <span className="receipt-ref-label">TRANSACTION REFERENCE</span>
                  <h4 className="receipt-ref-val">{orderId}</h4>
                </div>
                <div className="receipt-badge-wrap">
                  <span className="badge-verified">SECURED ON CHAIN ✓</span>
                </div>
              </div>

              <div className="receipt-separator"></div>

              <div className="receipt-items-column">
                {cartItems.map((item) => (
                  <div key={item.id} className="receipt-line">
                    <span>{item.quantity}x {item.title}</span>
                    <span>${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="receipt-separator"></div>

              <div className="receipt-sum-line">
                <span>Amount Paid</span>
                <span className="text-cyan">${totalAmount.toLocaleString()}</span>
              </div>

              <div className="receipt-delivery-estimate">
                <Package size={16} className="text-cyan" />
                <span>Estimated Air Courier Delivery: 48h to {formData.city}, {formData.country}</span>
              </div>
            </div>

            <div className="success-buttons-wrap">
              <button
                className="hyper-btn-secondary"
                onClick={() => {
                  sounds.playClick();
                  window.print();
                }}
              >
                <Download size={16} />
                <span>Save Digital Receipt</span>
              </button>

              <button
                className="hyper-btn-primary"
                onClick={() => {
                  sounds.playClick();
                  onClose();
                }}
              >
                <span>Return to 3D Showroom</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
