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
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-purple-900 text-white p-6">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
          AZISAI ✨ ストーリー
        </h1>
        <p className="text-purple-300 mt-2 text-sm">
          あなたの日常をここに書きましょう。
        </p>
        <div className="mt-4">
          {user ? (
            <Link
              to="/new"
              className="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded text-white font-semibold transition"
            >
              ➕ 投稿
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white font-semibold transition"
            >
              🔐 ログイン
            </Link>
          )}
        </div>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <p className="text-center text-purple-300">まだ投稿がありません。</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="group bg-black/30 backdrop-blur-md border border-purple-500 p-4 rounded-xl shadow-md transition-transform hover:scale-105 relative"
            >
              <Link to={`/post/${post.id}`}>
                <h2 className="text-lg font-bold text-pink-300 group-hover:text-white mb-2">
                  {post.title}
                </h2>
                <p className="text-xs text-purple-300 mb-2">{post.date}</p>
              </Link>
              {user && (
                <button
                  onClick={() => handleDelete(post.id)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded"
                >
                  🗑 削除
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 mt-24 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/60 to-black pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
          {/* Profile Image */}
          <div className="flex justify-center mb-4">
            <img
              src="https://files.kick.com/images/user/3299289/profile_image/conversion/0ad1c855-b1e8-4a44-b081-d2697dd34364-fullsize.webp"
              alt="AZISAI"
              className="w-16 h-16 rounded-full border-2 border-purple-400 shadow-lg"
            />
          </div>

          {/* Name */}
          <h2 className="text-xl font-bold text-white mb-6 tracking-wider">
            AZISAI0721
          </h2>

          {/* Social Icons */}
          <div className="flex justify-center flex-wrap gap-6 mb-6">
            {[
              [
                "https://x.com/RATOR205",
                "https://i.ibb.co/dJjtLCgh/Screenshot-2025-02-13-153630-removebg-preview.png",
              ],
              [
                "https://youtube.com/@azisai-onkazi-kirinuki",
                "https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png",
              ],
              [
                "https://kick.com/azisai0721",
                "https://i.ibb.co/Zsw9SH9/images-removebg-preview.png",
              ],
              [
                "https://roobet.com/?ref=azisai07219",
                "https://i.ibb.co/8gKXJsDz/Screenshot-1-150x150-removebg-preview.png",
              ],
              [
                "https://play1w.com/jpn?sub3=AZISAI07219",
                "https://cdn6.aptoide.com/imgs/4/9/f/49fd00da6f40e313a1164a5dce21aff8_icon.jpg?w=128",
              ],
              [
                "https://discord.gg/azisai",
                "https://i.ibb.co/81pqFsY/Screenshot-2025-02-13-153913-removebg-preview.png",
              ],
            ].map(([link, img], i) => (
              <a key={i} href={link} target="_blank" rel="noreferrer">
                <img
                  src={img}
                  alt="social"
                  className="h-10 w-10 object-contain hover:scale-110 transition"
                />
              </a>
            ))}
          </div>

          <p className="text-sm text-purple-300">
            &copy; 2025 AZISAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
