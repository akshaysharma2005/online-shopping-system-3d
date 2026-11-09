import React, { useState } from 'react';
import { Eye, ShoppingCart, Heart, Star, Sparkles, Check, Zap } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export default function ProductCard({
  product,
  onOpenInspect,
  onAddToCart,
  isWishlisted,
  onToggleWishlist
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    sounds.playAddToCart();
    onAddToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    sounds.playClick();
    onToggleWishlist(product.id);
  };

  const handleInspect = () => {
    sounds.play3DInspect();
    onOpenInspect(product.id);
  };

  const imageSrc = `/product_images/${encodeURIComponent(product.image)}`;
  const fallbackSrc = `/img/${encodeURIComponent(product.image)}`;

  return (
    <div className="hyper-card" onClick={handleInspect}>
      {/* Outer Glow Border Effect */}
      <div className="hyper-card-border-glow"></div>

      {/* Card Header & Badges */}
      <div className="card-floating-badges">
        {product.discountPercent > 0 && (
          <span className="pill-discount">
            -{product.discountPercent}% OFF
          </span>
        )}
        {product.featured && (
          <span className="pill-featured">
            <Sparkles size={11} /> VAULT DROP
          </span>
        )}
        <button
          className={`card-wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={handleToggleWishlist}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={16} fill={isWishlisted ? '#f43f5e' : 'none'} color={isWishlisted ? '#f43f5e' : '#94a3b8'} />
        </button>
      </div>

      {/* Product Image Stage with Reflective Pod */}
      <div className="card-stage-wrap">
        <div className="stage-backlight"></div>

        {!imageLoaded && !imageError && (
          <div className="stage-skeleton">
            <div className="skeleton-wave"></div>
          </div>
        )}

        <img
          src={imageError ? fallbackSrc : imageSrc}
          alt={product.title}
          className={`stage-product-img ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            if (!imageError) {
              setImageError(true);
            } else {
              e.currentTarget.src = '/img/product01.png';
              setImageLoaded(true);
            }
          }}
          loading="lazy"
        />

        {/* Hover Quick 3D Pill */}
        <div className="card-hover-action">
          <span className="inspect-pill-btn">
            <Eye size={14} className="text-cyan" />
            <span>Inspect In 3D Space</span>
          </span>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="card-details-section">
        <div className="card-brand-row">
          <span className="category-micro">{product.categoryName}</span>
          <span className="brand-micro">[{product.brandName}]</span>
        </div>

        <h3 className="card-product-title" title={product.title}>
          {product.title}
        </h3>

        {/* Ratings & Score */}
        <div className="card-rating-line">
          <div className="star-stack">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.floor(product.rating) ? 'star-gold' : 'star-dim'}
              />
            ))}
          </div>
          <span className="rating-number">{product.rating}</span>
          <span className="reviews-sub">({product.reviewsCount})</span>
        </div>

        {/* Price & Buy Action Dock */}
        <div className="card-bottom-row">
          <div className="price-cluster">
            <span className="price-tag">${product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="price-strike">${product.originalPrice.toLocaleString()}</span>
            )}
          </div>

          <button
            className={`btn-bag-add ${added ? 'added' : ''}`}
            onClick={handleAddToCart}
            title="Add to Vault Bag"
          >
            {added ? (
              <>
                <Check size={14} />
                <span>Bagged</span>
              </>
            ) : (
              <>
                <ShoppingCart size={14} />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
