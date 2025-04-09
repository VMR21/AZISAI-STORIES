theme: {
  extend: {
    animation: {
      pulseGlow: "pulse-glow 4s infinite",
      waveMotion: "wave 15s linear infinite",
    },
    keyframes: {
      "pulse-glow": {
        "0%, 100%": { opacity: "0.6" },
        "50%": { opacity: "1" },
      },
      wave: {
        "0%": { transform: "translateX(0)" },
        "100%": { transform: "translateX(-50%)" },
      },
    },
  },
},
