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

  const handleDelete = async (id) => {
    if (window.confirm("本当に削除しますか？")) {
      await deleteDoc(doc(db, "posts", id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-purple-900 text-white">
      {/* 🌊 Animated Wave */}
      <div className="relative">
        <div className="text-center pt-16 pb-6 z-10 relative">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 text-transparent bg-clip-text animate-pulse">
            AZISAI ✨ ストーリー
          </h1>
          <p className="mt-2 text-purple-300 text-sm">あなたの日常をここに書きましょう。</p>
          <div className="mt-4">
            {user ? (
              <Link
                to="/new"
                className="inline-block px-5 py-2 rounded-md bg-pink-500 hover:bg-pink-600 transition text-white font-semibold shadow-md"
              >
                ➕ 投稿
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-block px-5 py-2 rounded-md bg-purple-600 hover:bg-purple-700 transition text-white font-semibold shadow-md"
              >
                🔐 ログイン
              </Link>
            )}
          </div>
        </div>

        <svg
          className="absolute bottom-0 w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 200"
        >
          <path
            fill="#7c3aed"
            fillOpacity="0.2"
            d="M0,192L48,202.7C96,213,192,235,288,234.7C384,235,480,213,576,213.3C672,213,768,235,864,218.7C960,203,1056,149,1152,133.3C1248,117,1344,139,1392,149.3L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>

      {/* 📜 Posts */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        {posts.length === 0 ? (
          <p className="text-center text-purple-300">まだ投稿がありません。</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-black/30 backdrop-blur-xl border border-purple-700 p-5 rounded-xl shadow-lg transition-transform hover:scale-105 relative"
              >
                <Link to={`/post/${post.id}`}>
                  <h2 className="text-lg font-bold text-pink-300 hover:text-white transition mb-1">
                    {post.title}
                  </h2>
                  <p className="text-xs text-purple-400 mb-2">{post.date}</p>
                </Link>
                {user && (
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded"
                  >
                    🗑 削除
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 👣 Footer */}
<footer className="relative z-10 mt-20">
  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/30 to-black pointer-events-none"></div>

  <div className="relative bg-gradient-to-b from-purple-950/60 to-black/90 backdrop-blur-xl border-t border-purple-500/10">
    <div className="max-w-6xl mx-auto px-4 py-12 text-center">
      {/* Profile pic + name */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg shadow-purple-500/30 mb-4">
          <img
            src="https://files.kick.com/images/user/3299289/profile_image/conversion/0ad1c855-b1e8-4a44-b081-d2697dd34364-fullsize.webp"
            alt="AZISAI"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-bold text-purple-100 tracking-wider">AZISAI0721</h2>
      </div>


      {/* Bottom Text */}
      <p className="text-purple-300 text-sm">
        &copy; 2025 AZISAI. All rights reserved.
      </p>
    </div>
  </div>
</footer>



    </div>
  );
}
