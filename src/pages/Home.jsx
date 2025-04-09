import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase/firebase";
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, deleteObject } from "firebase/storage";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
    <div className="relative min-h-screen bg-gradient-to-br from-black via-purple-900 to-pink-900 text-white p-6 overflow-hidden">
      {/* 🔮 Animated Blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-pink-400 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-purple-600 rounded-full blur-2xl opacity-25 animate-spin-slow" />
        <div className="absolute bottom-10 left-1/3 w-64 h-64 bg-blue-400 rounded-full blur-3xl opacity-10 animate-bounce" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff11_1px,transparent_1px)] [background-size:16px_16px] opacity-5" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-600 text-transparent bg-clip-text animate-pulse tracking-widest">
            AZISAI ✨ ストーリー
          </h1>
          <div className="space-x-4">
            {user ? (
              <Link to="/new" className="bg-pink-500 px-4 py-2 rounded hover:scale-105 transition">➕ 投稿</Link>
            ) : (
              <Link to="/login" className="bg-purple-600 px-4 py-2 rounded hover:scale-105 transition">🔐 ログイン</Link>
            )}
          </div>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-pink-200">まだ投稿がありません。</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {posts.map(post => (
              <div
                key={post.id}
                className="group glass p-4 border border-pink-400 rounded-xl shadow-lg transition-transform hover:scale-105 hover:shadow-pink-500/30 relative bg-black/30 backdrop-blur-md"
              >
                <Link to={`/post/${post.id}`}>
                  {post.image && (
                    <img src={post.image} className="h-40 w-full object-cover rounded-lg mb-3" />
                  )}
                  <h2 className="text-xl font-extrabold bg-gradient-to-r from-pink-300 via-purple-400 to-pink-300 bg-clip-text text-transparent group-hover:animate-pulse transition">
                    {post.title}
                  </h2>
                  <p className="text-xs text-purple-300 mt-1">{post.date}</p>
                </Link>

                {user && (
                  <button
                    onClick={() => handleDelete(post.id, post.image)}
                    className="absolute bottom-4 right-4 text-xs bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    🗑 削除
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✨ Floating Sparkle Particles */}
      <ul className="absolute top-0 left-0 w-full h-full -z-20 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <li
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-[float_10s_linear_infinite] opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${10 + Math.random() * 20}s`
            }}
          />
        ))}
      </ul>
    </div>
  );
}
