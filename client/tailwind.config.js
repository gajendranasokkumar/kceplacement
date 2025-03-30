module.exports = {
  theme: {
    extend: {
      animation: {
        "slide-in": "slide-in 0.5s ease-out",
      },
      keyframes: {
        "slide-in": {
          "0%": { transform: "translateX(100%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
      },
    },
  },
};