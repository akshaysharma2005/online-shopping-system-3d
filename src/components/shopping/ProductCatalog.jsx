import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from './ProductCard';
import { 
  Filter, 
  Smartphone, 
  Laptop, 
  Shirt, 
  Armchair, 
  Tv, 
  Sparkles, 
  Flame, 
  Clock, 
  SlidersHorizontal,
  ChevronDown,
  Layers,
  Radio
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

const CATEGORY_ICONS = {
  1: <Laptop size={15} />,
  2: <Shirt size={15} />,
  3: <Shirt size={15} />,
  4: <Shirt size={15} />,
  5: <Armchair size={15} />,
  6: <Tv size={15} />,
  7: <Smartphone size={15} />,
};

export default function ProductCatalog({
  productsData,
  searchTerm,
  onOpenInspect,
  onAddToCart,
  wishlistIds,
  onToggleWishlist,
  catalogRef,
  dealsRef
}) {
  const { categories, brands, products } = productsData;

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(55000);

  // Countdown timer for Hot Deals banner
  const [timeLeft, setTimeLeft] = useState({ hours: 11, minutes: 48, seconds: 22 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (searchTerm) {
          const q = searchTerm.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchBrand = p.brandName.toLowerCase().includes(q);
          const matchCat = p.categoryName.toLowerCase().includes(q);
          const matchKey = p.keywords.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchBrand && !matchCat && !matchKey) {
            return false;
          }
        }
        if (selectedCategory !== 'all' && p.categoryId !== Number(selectedCategory)) {
          return false;
        }
        if (selectedBrand !== 'all' && p.brandId !== Number(selectedBrand)) {
          return false;
        }
        if (p.price > maxPrice) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, searchTerm, selectedCategory, selectedBrand, sortBy, maxPrice]);

  const handleCategoryChange = (cid) => {
    sounds.playClick();
    setSelectedCategory(cid);
  };

  const handleBrandChange = (bid) => {
    sounds.playClick();
    setSelectedBrand(bid);
  };

  return (
    <div className="hyper-catalog-wrapper" ref={catalogRef}>
      {/* Hot Deals & Cyber Drop Announcement Banner */}
      <section className="flash-drop-banner" ref={dealsRef}>
        <div className="banner-glow-gradient"></div>
        <div className="banner-content-grid">
          <div className="banner-text-col">
            <div className="drop-status-badge">
              <span className="drop-live-dot"></span>
              <Flame size={14} className="text-pink" />
              <span>SPATIAL FLASH DROP // 50% DISCOUNT ACTIVE</span>
            </div>

            <h2 className="drop-title">
              PRISMATIC HARDWARE <span className="highlight-text">MEGA SALE</span>
            </h2>

            <p className="drop-subtitle">
              Exclusive pricing on flagship Apple iPhones, Samsung Galaxy OLED series, and HP Pavilion laptops with direct 3D WebGL inspection.
            </p>
          </div>

          <div className="banner-timer-col">
            <span className="timer-headline"><Clock size={15} /> DROP CLOSES IN:</span>
            <div className="timer-blocks">
              <div className="time-block">
                <span className="time-val">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="time-unit">HOURS</span>
              </div>
              <span className="time-sep">:</span>
              <div className="time-block">
                <span className="time-val">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="time-unit">MINS</span>
              </div>
              <span className="time-sep">:</span>
              <div className="time-block">
                <span className="time-val">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="time-unit">SECS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Futuristic Category Capsules Bar */}
      <div className="category-capsules-track">
        <button
          className={`capsule-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('all')}
        >
          <Layers size={15} />
          <span>All Hardware Vault</span>
          <span className="capsule-count">{products.length}</span>
        </button>

        {categories.map((c) => {
          const count = products.filter((p) => p.categoryId === c.id).length;
          return (
            <button
              key={c.id}
              className={`capsule-btn ${selectedCategory === String(c.id) ? 'active' : ''}`}
              onClick={() => handleCategoryChange(String(c.id))}
            >
              {CATEGORY_ICONS[c.id] || <Sparkles size={15} />}
              <span>{c.name}</span>
              <span className="capsule-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Toolbar Deck */}
      <div className="filter-deck-panel">
        {/* Brand Selector Strip */}
        <div className="brand-selector-strip">
          <span className="deck-tag">BRAND:</span>
          <div className="brand-pill-container">
            <button
              className={`brand-chip ${selectedBrand === 'all' ? 'active' : ''}`}
              onClick={() => handleBrandChange('all')}
            >
              ALL
            </button>
            {brands.map((b) => (
              <button
                key={b.id}
                className={`brand-chip ${selectedBrand === String(b.id) ? 'active' : ''}`}
                onClick={() => handleBrandChange(String(b.id))}
              >
                {b.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Price Slider & Sort Controls */}
        <div className="deck-right-controls">
          <div className="price-slider-wrap">
            <span className="deck-tag">BUDGET: ${maxPrice.toLocaleString()}</span>
            <input
              type="range"
              min="1000"
              max="55000"
              step="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>

          <div className="sort-selector-wrap">
            <span className="deck-tag">SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                sounds.playClick();
                setSortBy(e.target.value);
              }}
            >
              <option value="featured">Featured Drops</option>
              <option value="rating">Top Rated (5.0★)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="catalog-meta-bar">
        <span className="meta-results-count">
          SHOWING <strong>{filteredProducts.length}</strong> HARDWARE ITEMS
          {searchTerm && <span> MATCHING "<em>{searchTerm}</em>"</span>}
        </span>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="hyper-empty-state">
          <Sparkles size={48} className="text-cyan mb-3" />
          <h3>No matching hardware found</h3>
          <p>Try broadening your search keywords or resetting your price filter.</p>
          <button
            className="hyper-btn-primary mt-4"
            onClick={() => {
              sounds.playClick();
              setSelectedCategory('all');
              setSelectedBrand('all');
              setMaxPrice(55000);
            }}
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="hyper-products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenInspect={onOpenInspect}
              onAddToCart={onAddToCart}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}
