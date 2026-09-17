/**
 * Voice Reactive 3D World - App Manager
 * Handles UI interactions, preset switching, and global audio sensitivity settings.
 */

const App = {
  // Global configuration options
  config: {
    sensitivity: 1.5,
    activePreset: 'organicSphere',
    colorScheme: 'neon', // 'neon', 'fire', 'cyber'
  },

  init() {
    this.bindUI();
    console.log('App initialized and listening for UI events.');
  },

  bindUI() {
    // Example: Bind sensitivity sliders or preset toggles if added to UI
    const sensitivityControl = document.getElementById('sensitivity-range');
    if (sensitivityControl) {
      sensitivityControl.addEventListener('input', (e) => {
        this.config.sensitivity = parseFloat(e.target.value);
      });
    }
  },

  /**
   * Helper to map raw audio byte frequency data to a normalized 0-1 scale
   * with adjustable sensitivity scaling.
   */
  getScaledAudioValue(rawVolume) {
    const normalized = rawVolume / 255;
    return Math.min(1, normalized * this.config.sensitivity);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});