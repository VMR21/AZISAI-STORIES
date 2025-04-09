import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, deleteObject } from "firebase/storage";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(data);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  const handleDelete = async (id, imageUrl) => {
    if (window.confirm("本当にこの投稿を削除しますか？")) {
      await deleteDoc(doc(db, "posts", id));
      if (imageUrl) {
        const storage = getStorage();
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef).catch(() => {});
      }
    }
  };

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
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col">
      {/* 🌌 Background Layers */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-radial-gradient from-purple-900 via-purple-950 to-black"></div>
        <div className="absolute inset-0 bg-[url('https://v0.dev/noise.png')] opacity-20 mix-blend-soft-light"></div>
        <div id="stars" />
      </div>

      {/* 🔺 Header */}
      <header className="w-full py-6 px-4 text-center bg-purple-900 bg-opacity-50 backdrop-blur-md border-b border-purple-500/10">
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-fuchsia-400 to-purple-500 text-transparent bg-clip-text drop-shadow animate-pulse">
          AZISAI ✨ ストーリー
        </h1>
      </header>

      {/* 🔥 Main Content */}
      <main className="flex-grow relative z-10 px-6 py-12 max-w-6xl mx-auto w-full">
        <div className="flex justify-end mb-8">
          {user ? (
            <Link
              to="/new"
              className="bg-pink-500 px-5 py-2 rounded-lg hover:scale-105 transition"
            >
              ➕ 投稿
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-purple-700 px-5 py-2 rounded-lg hover:scale-105 transition"
            >
              🔐 ログイン
            </Link>
          )}
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-pink-200 text-lg mt-20">まだ投稿がありません。</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="relative rounded-2xl p-6 bg-black/20 backdrop-blur-xl border border-fuchsia-600/30 shadow-[0_0_60px_rgba(236,72,153,0.2)] hover:scale-105 transition duration-300"
              >
                <Link to={`/post/${post.id}`}>
                  <h2 className="text-xl font-bold text-white mb-2 drop-shadow-sm tracking-wide hover:text-pink-400 transition">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-sm text-purple-300 font-mono">{post.date}</p>
                {user && (
                  <button
                    onClick={() => handleDelete(post.id, post.image)}
                    className="mt-4 bg-red-600 text-xs px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    🗑 削除
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 🌊 Wave */}
      <div className="absolute bottom-0 left-0 w-full h-48 overflow-hidden z-0">
        <div className="relative w-[200%] h-full animate-waveMotion">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/wave.svg')] bg-repeat-x opacity-20" />
        </div>
      </div>

 <footer className="relative z-10 mt-24">
  <div className="bg-gradient-to-b from-transparent via-purple-950/40 to-black pt-12 pb-8 px-6 text-center border-t border-purple-700/20">
    <div className="flex justify-center items-center flex-wrap gap-6 mb-6">
      {[
        ["https://x.com/RATOR205", "https://i.ibb.co/dJjtLCgh/Screenshot-2025-02-13-153630-removebg-preview.png"],
        ["https://youtube.com/@azisai-onkazi-kirinuki", "https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png"],
        ["https://kick.com/azisai0721", "https://i.ibb.co/Zsw9SH9/images-removebg-preview.png"],
        ["https://roobet.com/?ref=azisai07219", "https://i.ibb.co/8gKXJsDz/Screenshot-1-150x150-removebg-preview.png"],
        ["https://play1w.com/jpn?sub3=AZISAI07219", "https://cdn6.aptoide.com/imgs/4/9/f/49fd00da6f40e313a1164a5dce21aff8_icon.jpg?w=128"],
        ["https://discord.gg/azisai", "https://i.ibb.co/81pqFsY/Screenshot-2025-02-13-153913-removebg-preview.png"]
      ].map(([link, img], i) => (
        <a href={link} key={i} target="_blank" rel="noreferrer">
          <img src={img} alt="social" className="h-10 w-10 object-contain hover:scale-110 transition" />
        </a>
      ))}
    </div>
    <p className="text-sm text-purple-300">© 2025 AZISAI. All rights reserved.</p>
  </div>
</footer>

    </div>
  );
}
