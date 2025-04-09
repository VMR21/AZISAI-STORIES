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

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-purple-950 to-pink-900 text-white p-6 overflow-hidden">

      {/* 🔮 Sexy Animated Background */}
      <div className="absolute inset-0 -z-50 pointer-events-none overflow-hidden">
        <div className="absolute w-full h-full bg-[radial-gradient(white_1px,transparent_1px)] bg-[length:20px_20px] opacity-5 animate-stars" />
        <div className="absolute w-[150%] h-[150%] top-[-25%] left-[-25%] bg-gradient-to-br from-fuchsia-500 via-purple-700 to-indigo-900 opacity-10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-pink-500 rounded-full blur-[120px] opacity-10 animate-spin-slower" />
      </div>

      {/* 🌊 Wave */}
      <div className="absolute bottom-0 left-0 w-full h-48 overflow-hidden z-0">
        <div className="relative w-[200%] h-full animate-waveMotion">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/wave.svg')] bg-repeat-x opacity-20" />
        </div>
      </div>

      {/* 🎵 Music Toggle */}
      <audio id="bg-audio" loop>
        <source src="/bg.mp3" type="audio/mpeg" />
      </audio>
      <button
        onClick={() => {
          const audio = document.getElementById("bg-audio");
          if (audio.paused) audio.play();
          else audio.pause();
        }}
        className="fixed bottom-4 right-4 bg-pink-600 text-xs px-3 py-1 rounded shadow-lg hover:bg-pink-700 z-50"
      >
        🎶 音楽 オン/オフ
      </button>

      {/* Header */}
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-6 text-center sm:text-left">
          <div>
            <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-pink-400 to-purple-500 text-transparent bg-clip-text tracking-tight drop-shadow-2xl animate-pulse">
              AZISAI <span className="text-yellow-300">✨</span> ストーリー
            </h1>
            <p className="text-sm text-white/60 mt-2">あなたの日常をここに書きましょう。</p>
          </div>

          <div className="flex justify-center sm:justify-end gap-4">
            {user ? (
              <Link
                to="/new"
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow-lg hover:scale-105 transition"
              >
                ➕ 投稿
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-semibold shadow-lg hover:scale-105 transition"
              >
                🔐 ログイン
              </Link>
            )}
          </div>
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <p className="text-center text-pink-200 text-lg mt-20">まだ投稿がありません。</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <div
                key={post.id}
                className="relative rounded-2xl p-6 bg-black/20 backdrop-blur-xl border border-fuchsia-600/30 shadow-[0_0_60px_rgba(236,72,153,0.2)] text-center hover:shadow-pink-500/40 hover:scale-105 transition duration-300"
              >
                <div className="absolute top-3 left-4 text-sm text-pink-400 font-bold">
                  #{index + 1}
                </div>

                {post.image && (
                  <img
                    src={post.image}
                    className="mx-auto mb-4 h-20 w-20 object-cover rounded-full border-2 border-pink-400 shadow-md"
                    alt="Post"
                  />
                )}

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
      </div>
    </div>
  );
}
