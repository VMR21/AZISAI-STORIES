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
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-pink-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-600 text-transparent bg-clip-text animate-pulse">
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
              <div
                key={post.id}
                className="group glass p-4 border border-pink-400 rounded-xl shadow-lg transition-transform hover:scale-105 hover:shadow-pink-500/30 relative"
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
    </div>
  );
}
