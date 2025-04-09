module.exports = {
  // ...
  theme: {
    extend: {
      animation: {
        float: 'float 15s linear infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100vh)' },
        },
      },
    },
  },
};
