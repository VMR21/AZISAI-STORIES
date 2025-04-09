import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  // OPTIONAL: Disable right-click + F12
  useEffect(() => {
    const disable = (e) => {
      if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && ["I", "J"].includes(e.key)) || (e.ctrlKey && e.key === "U")) {
        e.preventDefault();
        alert("Dev tools are disabled.");
      }
    };
    document.addEventListener("contextmenu", (e) => e.preventDefault());
    document.addEventListener("keydown", disable);
    return () => document.removeEventListener("keydown", disable);
  }, []);

  // 🌌 Add stars on load
  useEffect(() => {
    const stars = document.getElementById("stars");
    if (stars && stars.childNodes.length === 0) {
      for (let i = 0; i < 60; i++) {
        const star = document.createElement("div");
        star.className = "absolute rounded-full animate-pulse-glow";
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.width = `${Math.random() * 4 + 1}px`;
        star.style.height = `${Math.random() * 4 + 1}px`;
        star.style.backgroundColor = `rgba(147, 51, 234, ${Math.random() * 0.3 + 0.2})`;
        stars.appendChild(star);
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-sans relative overflow-x-hidden">
      {/* 🌌 Radial Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-radial-gradient from-purple-900 via-purple-950 to-black"></div>
        <div className="absolute inset-0 bg-[url('https://v0.dev/noise.png')] opacity-20 mix-blend-soft-light"></div>
        <div id="stars" />
      </div>

      {/* 🎵 Audio BG (optional) */}
      <audio id="bg-audio" loop>
        <source src="/bg.mp3" type="audio/mpeg" />
      </audio>

      {/* 🔺 Header */}
      <Header />

      {/* 🧠 Main Content */}
      <main className="relative flex-grow z-10 px-4 md:px-8 py-8 max-w-7xl mx-auto">
        {children}
      </main>

      {/* 🌊 Wave Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-48 overflow-hidden z-0">
        <div className="relative w-[200%] h-full animate-waveMotion">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/wave.svg')] bg-repeat-x opacity-20" />
        </div>
      </div>

      {/* 🔻 Footer */}
      <Footer />
    </div>
  );
}
