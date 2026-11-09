import React from 'react';
import { X, Heart, ShoppingCart, Trash2, ArrowRight, Zap } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistIds,
  products,
  onAddToCart,
  onRemoveFromWishlist,
  onOpenInspect
}) {
  if (!isOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="hyper-drawer-backdrop" onClick={onClose}>
      <div className="hyper-drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header-strip">
          <div className="drawer-brand-cluster">
            <div className="drawer-icon-wrap heart-icon-wrap">
              <Heart size={20} className="text-pink" fill="#f43f5e" />
            </div>
            <div>
              <h3>Wishlist Vault</h3>
              <p>Saved Spatial Hardware</p>
            </div>
            <span className="drawer-count-badge">{wishlistedProducts.length}</span>
          </div>
          <button className="drawer-close-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body-scroll">
          {wishlistedProducts.length === 0 ? (
            <div className="empty-vault-view">
              <div className="empty-icon-ring">
                <Heart size={40} className="text-pink" />
              </div>
              <h4>Your Wishlist Vault is Empty</h4>
              <p>Bookmark hardware items by tapping the heart icon on any card.</p>
              <button
                className="hyper-btn-primary mt-3"
                onClick={() => {
                  sounds.playClick();
                  onClose();
                }}
              >
                Explore Hardware Vault
              </button>
            </div>
          ) : (
            <div className="drawer-items-column">
              {wishlistedProducts.map((product) => (
                <div key={product.id} className="drawer-item-card">
                  <div
                    className="item-thumbnail cursor-pointer"
                    onClick={() => {
                      sounds.play3DInspect();
                      onOpenInspect(product.id);
                    }}
                  >
                    <img
                      src={`/product_images/${encodeURIComponent(product.image)}`}
                      alt={product.title}
                      onError={(e) => {
                        e.currentTarget.src = `/img/${encodeURIComponent(product.image)}`;
                      }}
                    />
                  </div>

                  <div className="item-info-col">
                    <h5
                      className="item-name cursor-pointer"
                      onClick={() => {
                        sounds.play3DInspect();
                        onOpenInspect(product.id);
                      }}
                    >
                      {product.title}
                    </h5>
                    <span className="item-brand-category">{product.brandName} • {product.categoryName}</span>
                    <span className="item-price-tag">${product.price.toLocaleString()}</span>

                    <div className="item-controls-row mt-2">
                      <button
                        className="btn-move-to-bag"
                        onClick={() => {
                          sounds.playAddToCart();
                          onAddToCart(product, 1);
                        }}
                      >
                        <ShoppingCart size={13} />
                        <span>Move to Bag</span>
                      </button>

                      <button
                        className="btn-trash-item"
                        onClick={() => {
                          sounds.playRemove();
                          onRemoveFromWishlist(product.id);
                        }}
                        title="Remove From Wishlist"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {wishlistedProducts.length > 0 && (
          <div className="drawer-footer-panel">
            <button
              className="hyper-checkout-btn full-width"
              onClick={() => {
                sounds.playClick();
                wishlistedProducts.forEach((p) => onAddToCart(p, 1));
              }}
            >
              <span>Add All to Vault Bag</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
