import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
    });
    return unsub;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-pink-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-600 text-transparent bg-clip-text">
            AZISAI ✨ ストーリー
          </h1>
          <div className="space-x-4">
            <Link to="/new" className="bg-pink-500 px-4 py-2 rounded hover:scale-105 transition">➕ 投稿</Link>
            <Link to="/login" className="bg-purple-600 px-4 py-2 rounded hover:scale-105 transition">🔐 ログイン</Link>
          </div>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-pink-200">まだ投稿がありません。</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {posts.map(post => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className="glass p-4 border border-pink-400 rounded-xl shadow-lg hover:scale-105 transition"
              >
                {post.image && (
                  <img src={post.image} className="h-40 w-full object-cover rounded-lg mb-3" />
                )}
                <h2 className="text-xl font-bold text-pink-300">{post.title}</h2>
                <p className="text-sm text-purple-200">{post.date}</p>
                <p className="text-sm text-white/80 mt-2 line-clamp-3">{post.content}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
