// Animation utilities and keyframe definitions
export const ANIMATIONS = {
  fadeIn: "fade-in 0.3s ease",
  slideInLeft: "slide-in-left 0.3s ease",
  headerShrink: "header-shrink 0.3s ease",
  spin: "spinner 1s linear infinite",
};

// CSS for custom animations (inject into globals.css if needed)
export const ANIMATION_KEYFRAMES = `
  @keyframes fade-in {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  @keyframes slide-in-left {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(0); }
  }

  @keyframes header-shrink {
    0% { height: 79px; }
    100% { height: 70px; }
  }

  @keyframes spinner {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
