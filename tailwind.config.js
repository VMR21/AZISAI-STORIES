extend: {
  animation: {
    waveMotion: "wave 10s linear infinite",
    stars: "stars 100s linear infinite",
  },
  keyframes: {
    wave: {
      "0%": { transform: "translateX(0)" },
      "100%": { transform: "translateX(-50%)" },
    },
    stars: {
      "0%": { backgroundPosition: "0 0" },
      "100%": { backgroundPosition: "1000px 1000px" },
    },
  },
},
