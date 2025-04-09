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
      
      {/* 🌊 Motion Wave Background */}
      <div className="absolute bottom-0 left-0 w-full h-48 overflow-hidden z-0">
        <div className="relative w-[200%] h-full animate-waveMotion">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/wave.svg')] bg-repeat-x opacity-30" />
        </div>
      </div>

      {/* ✨ Header */}
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-600 text-transparent bg-clip-text animate-pulse tracking-widest drop-shadow-lg">
            AZISAI ✨ ストーリー
          </h1>
          <div className="space-x-4">
            {user ? (
              <Link
                to="/new"
                className="bg-pink-500 px-4 py-2 rounded hover:scale-105 transition shadow-md"
              >
                ➕ 投稿
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-purple-600 px-4 py-2 rounded hover:scale-105 transition shadow-md"
              >
                🔐 ログイン
              </Link>
            )}
          </div>
        </div>

        {/* 🧊 Post Cards */}
        {posts.length === 0 ? (
          <p className="text-center text-pink-200">まだ投稿がありません。</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <div
                key={post.id}
                className="relative rounded-2xl p-6 bg-gradient-to-br from-purple-800 via-purple-900 to-purple-950 border border-fuchsia-600/30 shadow-[0_0_60px_rgba(236,72,153,0.3)] text-center hover:shadow-pink-500/40 hover:scale-105 transition duration-300"
              >
                {/* Rank */}
                <div className="absolute top-3 left-4 text-sm text-pink-400 font-bold">
                  #{index + 1}
                </div>

                {/* Optional image */}
                {post.image && (
                  <img
                    src={post.image}
                    className="mx-auto mb-4 h-20 w-20 object-cover rounded-full border-2 border-pink-400 shadow-md"
                    alt="Post"
                  />
                )}

                {/* Title */}
                <h2 className="text-xl font-bold text-white mb-2 drop-shadow-sm tracking-wide">
                  {post.title}
                </h2>

                {/* Date */}
                <p className="text-sm text-purple-300 font-mono">{post.date}</p>

                {/* Delete */}
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
