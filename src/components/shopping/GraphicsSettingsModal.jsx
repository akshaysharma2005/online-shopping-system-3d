import React from 'react';
import { 
  X, 
  Sliders, 
  Sparkles, 
  Sun, 
  Volume2, 
  VolumeX, 
  Cpu, 
  Check,
  Shield,
  Zap
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export default function GraphicsSettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings
}) {
  if (!isOpen) return null;

  const handlePresetSelect = (preset) => {
    sounds.playClick();
    if (preset === 'ultra') {
      onUpdateSettings({
        preset: 'ultra',
        particles: 2500,
        bloom: true,
        shadows: true,
        wireframe: false,
      });
    } else if (preset === 'high') {
      onUpdateSettings({
        preset: 'high',
        particles: 1200,
        bloom: true,
        shadows: true,
        wireframe: false,
      });
    } else {
      onUpdateSettings({
        preset: 'eco',
        particles: 400,
        bloom: false,
        shadows: false,
        wireframe: false,
      });
    }
  };

  return (
    <div className="hyper-modal-backdrop" onClick={onClose}>
      <div className="hyper-graphics-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header-row">
          <div className="dialog-title-group">
            <div className="icon-badge">
              <Sliders size={20} className="text-cyan" />
            </div>
            <div>
              <h3>3D SHADER & HARDWARE ENGINE</h3>
              <p>WebGL 2.0 Real-time Raytracing & Postprocessing Pipeline</p>
            </div>
          </div>
          <button className="dialog-close-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="dialog-body-stack">
          {/* Preset Cards */}
          <div className="config-block">
            <span className="config-tag">GPU RENDERING PRESETS:</span>
            <div className="presets-three-grid">
              <button
                className={`preset-card-box ${settings.preset === 'ultra' ? 'active' : ''}`}
                onClick={() => handlePresetSelect('ultra')}
              >
                <span className="preset-pill ultra">MAXIMUM FIDELITY</span>
                <h4>Ultra Cinematic</h4>
                <p>2,500+ volumetric particles, contact soft shadows, chromatic dispersion, and high DPR.</p>
                {settings.preset === 'ultra' && <Check size={16} className="preset-active-check" />}
              </button>

              <button
                className={`preset-card-box ${settings.preset === 'high' ? 'active' : ''}`}
                onClick={() => handlePresetSelect('high')}
              >
                <span className="preset-pill high">RECOMMENDED</span>
                <h4>High Performance</h4>
                <p>1,200 particles, PBR materials, smooth 60 FPS across modern laptops and mobile screens.</p>
                {settings.preset === 'high' && <Check size={16} className="preset-active-check" />}
              </button>

              <button
                className={`preset-card-box ${settings.preset === 'eco' ? 'active' : ''}`}
                onClick={() => handlePresetSelect('eco')}
              >
                <span className="preset-pill eco">BATTERY SAVER</span>
                <h4>Eco Efficiency</h4>
                <p>Minimal GPU workload for low thermal footprint and extended battery preservation.</p>
                {settings.preset === 'eco' && <Check size={16} className="preset-active-check" />}
              </button>
            </div>
          </div>

          {/* Individual Switches */}
          <div className="toggles-column">
            <div className="toggle-item-row">
              <div className="toggle-label-wrap">
                <Sun size={18} className="text-amber" />
                <div>
                  <h5>Dynamic Contact Shadows</h5>
                  <p>Cast soft realistic ambient occlusion underneath 3D devices</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.shadows}
                onChange={(e) => {
                  sounds.playClick();
                  onUpdateSettings({ shadows: e.target.checked });
                }}
              />
            </div>

            <div className="toggle-item-row">
              <div className="toggle-label-wrap">
                {settings.soundEnabled ? <Volume2 size={18} className="text-cyan" /> : <VolumeX size={18} />}
                <div>
                  <h5>Spatial Web Audio Feedback</h5>
                  <p>Play acoustic synthesizer chimes for clicks, 3D rotations, and orders</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => {
                  sounds.toggleMute();
                  onUpdateSettings({ soundEnabled: e.target.checked });
                }}
              />
            </div>
          </div>

          {/* Diagnostic Stats */}
          <div className="hardware-spec-terminal">
            <div className="terminal-header">
              <Cpu size={14} className="text-cyan" />
              <span>GPU HARDWARE ACCELERATION TELEMETRY</span>
            </div>
            <div className="terminal-grid">
              <div className="term-cell">
                <span className="term-key">WebGL Architecture</span>
                <span className="term-val text-cyan">WebGL 2.0 / Three.js 0.182</span>
              </div>
              <div className="term-cell">
                <span className="term-key">Viewport Canvas</span>
                <span className="term-val">{window.innerWidth} x {window.innerHeight} px</span>
              </div>
              <div className="term-cell">
                <span className="term-key">CPU Concurrency</span>
                <span className="term-val text-emerald">{navigator.hardwareConcurrency || 8} Threads Active</span>
              </div>
              <div className="term-cell">
                <span className="term-key">Memory Bandwidth</span>
                <span className="term-val">{navigator.deviceMemory ? `${navigator.deviceMemory} GB VRAM Tier` : 'Ultra Bandwidth'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dialog-footer-row">
          <button className="hyper-btn-primary full-width" onClick={onClose}>
            Save & Apply 3D Pipeline
          </button>
        </div>
      </div>
    </div>
  );
}
