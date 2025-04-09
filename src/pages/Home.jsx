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
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-600 text-transparent bg-clip-text glow-text animate-fadeInDown typewriter">
            AZISAI 🌸 ストーリー
          </h1>
          <p className="mt-4 text-pink-200 animate-fadeIn delay-100">
            思い出と日記をここに刻もう。
          </p>
          <Link
            to="/new"
            className="mt-6 inline-block bg-gradient-to-r from-pink-500 to-purple-700 px-6 py-2 rounded-lg text-white font-bold shadow-xl hover:scale-105 transition"
          >
            ➕ 投稿する
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-pink-300 text-xl">まだ投稿がありません。</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {posts.map(post => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className="glass p-4 hover:scale-[1.03] transition duration-300"
              >
                {post.image && (
                  <img
                    src={post.image}
                    alt=""
                    className="rounded-xl object-cover h-40 w-full mb-3 hover:brightness-110 transition"
                  />
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
