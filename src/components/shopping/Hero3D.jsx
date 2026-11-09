import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float } from '@react-three/drei';
import { PhoneModel, LaptopModel, GadgetModel, ParticleField } from './ThreeModels';
import { sounds } from '../../utils/soundEffects';
import { 
  Sparkles, 
  RotateCw, 
  Layers, 
  Palette, 
  Sun, 
  Zap, 
  Eye, 
  Check,
  Cpu,
  Compass,
  Maximize2
} from 'lucide-react';

const COLOR_PRESETS = [
  { name: 'Hyper Cyan', value: '#00f5ff', border: '#00f5ff' },
  { name: 'Electric Violet', value: '#8b5cf6', border: '#8b5cf6' },
  { name: 'Liquid Chrome', value: '#e2e8f0', border: '#ffffff' },
  { name: 'Solar Amber', value: '#ffb703', border: '#ffb703' },
  { name: 'Obsidian Void', value: '#090d16', border: '#334155' },
];

const LIGHTING_MODES = {
  cyber: {
    name: 'Cyberpunk Raytrace',
    ambient: '#090d1a',
    mainLight: '#00f5ff',
    rimLight: '#ec4899',
    particle: '#00f5ff'
  },
  neon: {
    name: 'Electric Aurora',
    ambient: '#0a0d18',
    mainLight: '#8b5cf6',
    rimLight: '#00f5a0',
    particle: '#a855f7'
  },
  solar: {
    name: 'Solar Sunset',
    ambient: '#180e05',
    mainLight: '#ffb703',
    rimLight: '#f43f5e',
    particle: '#fde047'
  },
  studio: {
    name: 'Pure Titanium',
    ambient: '#111827',
    mainLight: '#ffffff',
    rimLight: '#64748b',
    particle: '#94a3b8'
  }
};

export default function Hero3D({ onExploreCatalog, onOpenProductInspect }) {
  const [activeModel, setActiveModel] = useState('phone'); // 'phone' | 'laptop' | 'gadget'
  const [activeColor, setActiveColor] = useState(COLOR_PRESETS[0].value);
  const [wireframe, setWireframe] = useState(false);
  const [exploded, setExploded] = useState(false);
  const [lightingMode, setLightingMode] = useState('cyber');
  const [activeHotspot, setActiveHotspot] = useState(null);

  const currentLight = LIGHTING_MODES[lightingMode];

  const handleModelChange = (model) => {
    sounds.playClick();
    setActiveModel(model);
    setActiveHotspot(null);
  };

  const handleColorChange = (c) => {
    sounds.playClick();
    setActiveColor(c);
  };

  const toggleWireframe = () => {
    sounds.playClick();
    setWireframe(!wireframe);
  };

  const toggleExploded = () => {
    sounds.play3DInspect();
    setExploded(!exploded);
  };

  const cycleLighting = () => {
    sounds.playClick();
    const keys = Object.keys(LIGHTING_MODES);
    const nextIdx = (keys.indexOf(lightingMode) + 1) % keys.length;
    setLightingMode(keys[nextIdx]);
  };

  return (
    <section className="hyper-hero-wrapper">
      {/* Background Volumetric Lights & Glow Orbs */}
      <div className="ambient-glow glow-cyan"></div>
      <div className="ambient-glow glow-purple"></div>
      <div className="ambient-glow glow-pink"></div>

      <div className="hero-container">
        {/* Left Side: Editorial Typography & Spatial Specs */}
        <div className="hero-editorial-col">
          <div className="super-badge">
            <span className="badge-pulse-ring"></span>
            <span className="badge-core">
              <Sparkles size={13} className="sparkle-svg" />
              <span>SPATIAL WEBGL 3.0 // 2026 EDITION</span>
            </span>
          </div>

          <h1 className="hero-headline">
            THE FUTURE OF <br />
            <span className="liquid-chromatic-text">HARDWARE</span>
            <span className="stroke-text"> SHOPPING</span>
          </h1>

          <p className="hero-lead">
            Step beyond flat screens. Inspect microscopic chassis chamfers, dismantle internal architecture in exploded 3D, and configure liquid chrome materials with real-time raytraced reflections.
          </p>

          {/* Quick Hardware Spec Grid */}
          <div className="hero-spec-strip">
            <div className="spec-item">
              <span className="spec-val">165Hz</span>
              <span className="spec-sub">ProMotion OLED</span>
            </div>
            <div className="spec-sep"></div>
            <div className="spec-item">
              <span className="spec-val">Grade 5</span>
              <span className="spec-sub">Aerospace Titanium</span>
            </div>
            <div className="spec-sep"></div>
            <div className="spec-item">
              <span className="spec-val">108MP</span>
              <span className="spec-sub">Prism Telephoto</span>
            </div>
            <div className="spec-sep"></div>
            <div className="spec-item">
              <span className="spec-val">60 FPS</span>
              <span className="spec-sub">GPU Hardware Acceleration</span>
            </div>
          </div>

          {/* Action Dock */}
          <div className="hero-action-dock">
            <button
              className="hyper-btn-primary"
              onClick={() => {
                sounds.playClick();
                onExploreCatalog();
              }}
            >
              <span className="btn-glow-layer"></span>
              <span className="btn-content">
                <Zap size={18} />
                <span>Explore 71+ Catalog Drops</span>
              </span>
            </button>

            <button
              className="hyper-btn-glass"
              onClick={() => {
                sounds.play3DInspect();
                onOpenProductInspect(1);
              }}
            >
              <Eye size={18} />
              <span>Launch 3D Hologram Vault</span>
            </button>
          </div>

          {/* Trust Strip */}
          <div className="hero-trust-strip">
            <div className="trust-pill">
              <Check size={14} className="text-emerald" />
              <span>Verified Authentic Hardware</span>
            </div>
            <div className="trust-pill">
              <Check size={14} className="text-cyan" />
              <span>Instant Spatial Checkout</span>
            </div>
          </div>
        </div>

        {/* Right Side: High-End 3D WebGL Showroom Stage */}
        <div className="hero-stage-col">
          <div className="hyper-stage-viewport">
            {/* Top HUD Bar */}
            <div className="stage-top-hud">
              <div className="hud-status-pill">
                <span className="status-blink"></span>
                <span>WEBGL 2.0 SHADER ONLINE</span>
              </div>

              {/* Model Select Buttons */}
              <div className="model-selector-group">
                <button
                  className={`model-pill ${activeModel === 'phone' ? 'active' : ''}`}
                  onClick={() => handleModelChange('phone')}
                >
                  TITANIUM PHONE
                </button>
                <button
                  className={`model-pill ${activeModel === 'laptop' ? 'active' : ''}`}
                  onClick={() => handleModelChange('laptop')}
                >
                  MACBOOK STUDIO
                </button>
                <button
                  className={`model-pill ${activeModel === 'gadget' ? 'active' : ''}`}
                  onClick={() => handleModelChange('gadget')}
                >
                  QUANTUM CORE
                </button>
              </div>
            </div>

            {/* 3D WebGL Canvas */}
            <div className="webgl-canvas-box">
              <Canvas
                camera={{ position: [0, 0, 5.0], fov: 45 }}
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
              >
                <color attach="background" args={['#03050a']} />
                <ambientLight intensity={1.2} color={currentLight.ambient} />
                
                {/* Dynamic Key Light */}
                <directionalLight
                  position={[5, 7, 5]}
                  intensity={2.8}
                  color={currentLight.mainLight}
                  castShadow
                />
                {/* Secondary Accent Light */}
                <directionalLight
                  position={[-5, -2, -4]}
                  intensity={2.0}
                  color={currentLight.rimLight}
                />
                <pointLight position={[0, 4, 2]} intensity={1.5} color="#ffffff" />

                {/* Floating Chromatic Dust Particles */}
                <ParticleField count={1200} color={currentLight.particle} />

                <Suspense fallback={null}>
                  <Float speed={1.6} rotationIntensity={0.15} floatIntensity={0.4}>
                    {activeModel === 'phone' && (
                      <PhoneModel
                        color={activeColor}
                        wireframe={wireframe}
                        exploded={exploded}
                        activeHotspot={activeHotspot}
                        onSelectHotspot={setActiveHotspot}
                      />
                    )}
                    {activeModel === 'laptop' && (
                      <LaptopModel
                        color={activeColor}
                        wireframe={wireframe}
                        activeHotspot={activeHotspot}
                        onSelectHotspot={setActiveHotspot}
                      />
                    )}
                    {activeModel === 'gadget' && (
                      <GadgetModel
                        color={activeColor}
                        wireframe={wireframe}
                      />
                    )}
                  </Float>

                  <ContactShadows
                    position={[0, -1.9, 0]}
                    opacity={0.8}
                    scale={12}
                    blur={2.8}
                    far={4.5}
                    color={currentLight.mainLight}
                  />
                </Suspense>

                <OrbitControls
                  enablePan={false}
                  enableZoom={true}
                  minDistance={2.8}
                  maxDistance={8}
                  dampingFactor={0.05}
                />
              </Canvas>

              {/* In-Canvas 3D Hint */}
              <div className="canvas-interaction-guide">
                <Compass size={14} className="spin-icon" />
                <span>360° SPATIAL DRAG • SCROLL ZOOM</span>
              </div>
            </div>

            {/* Bottom Customizer Deck */}
            <div className="stage-bottom-deck">
              {/* Color Swatches */}
              <div className="deck-swatches">
                <span className="deck-label"><Palette size={13} /> FINISH:</span>
                <div className="swatches-track">
                  {COLOR_PRESETS.map((c) => (
                    <button
                      key={c.name}
                      className={`hyper-swatch ${activeColor === c.value ? 'selected' : ''}`}
                      style={{ backgroundColor: c.value, borderColor: c.border }}
                      onClick={() => handleColorChange(c.value)}
                      title={c.name}
                    >
                      {activeColor === c.value && <span className="swatch-dot"></span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Exploded View, Wireframe, Lighting */}
              <div className="deck-tools">
                {activeModel === 'phone' && (
                  <button
                    className={`deck-tool-btn ${exploded ? 'active' : ''}`}
                    onClick={toggleExploded}
                    title="Dismantle parts in 3D"
                  >
                    <Layers size={14} />
                    <span>{exploded ? 'Collapse 3D' : 'Explode View'}</span>
                  </button>
                )}

                <button
                  className={`deck-tool-btn ${wireframe ? 'active' : ''}`}
                  onClick={toggleWireframe}
                  title="Toggle Wireframe Hologram"
                >
                  <Cpu size={14} />
                  <span>{wireframe ? 'PBR Solid' : 'Hologram'}</span>
                </button>

                <button
                  className="deck-tool-btn"
                  onClick={cycleLighting}
                  title="Switch Lighting Atmosphere"
                >
                  <Sun size={14} />
                  <span>{currentLight.name}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
