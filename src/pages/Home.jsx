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
  const [musicOn, setMusicOn] = useState(false);

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

  const toggleMusic = () => {
    const audio = document.getElementById("bg-music");
    if (musicOn) {
      audio.pause();
    } else {
      audio.play();
    }
    setMusicOn(!musicOn);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white px-4 pb-24 pt-6 overflow-hidden">

      {/* Motion Waves */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff11_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
        <div className="absolute top-0 left-0 w-full h-60 bg-purple-800 blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-0 left-0 w-full overflow-hidden">
          <svg viewBox="0 0 1440 320" className="w-full h-32">
            <path
              fill="#a855f7"
              fillOpacity="0.2"
              d="M0,192L48,202.7C96,213,192,235,288,234.7C384,235,480,213,576,213.3C672,213,768,235,864,218.7C960,203,1056,149,1152,133.3C1248,117,1344,139,1392,149.3L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Music Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleMusic}
          className="text-xs border border-purple-400 px-3 py-1 rounded bg-black/40 hover:bg-purple-700 transition"
        >
          🎵 音楽 {musicOn ? "オフ" : "オン"}
        </button>
        <audio id="bg-music" loop src="https://www.bensound.com/bensound-music/bensound-sunny.mp3" />
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-500 text-transparent bg-clip-text animate-pulse tracking-wider">
          AZISAI ✨ ストーリー
        </h1>
        <p className="text-pink-200 mt-2">あなたの日常をここに書きましょう。</p>
        <div className="mt-4">
          {user ? (
            <Link
              to="/new"
              className="bg-pink-500 px-4 py-2 rounded hover:scale-105 transition"
            >
              ➕ 投稿
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-purple-700 px-4 py-2 rounded hover:scale-105 transition"
            >
              🔐 ログイン
            </Link>
          )}
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {posts.length === 0 ? (
          <p className="col-span-full text-center text-pink-200">まだ投稿がありません。</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="relative bg-black/40 border border-pink-500 rounded-xl p-4 backdrop-blur-sm shadow-lg hover:shadow-pink-500/30 hover:scale-[1.02] transition-all group"
            >
              <Link to={`/post/${post.id}`}>
                {post.image && (
                  <img
                    src={post.image}
                    className="rounded mb-3 h-40 w-full object-cover"
                    alt="Post"
                  />
                )}
                <h2 className="text-lg font-bold bg-gradient-to-r from-purple-300 to-pink-300 text-transparent bg-clip-text group-hover:underline">
                  {post.title}
                </h2>
                <p className="text-xs text-pink-200 mt-1">{post.date}</p>
              </Link>
              {user && (
                <button
                  onClick={() => handleDelete(post.id, post.image)}
                  className="absolute top-2 right-2 text-xs bg-red-600 px-2 py-1 rounded hover:bg-red-700 transition"
                >
                  🗑
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <footer className="mt-20 text-center border-t border-purple-900 pt-10">
        <div className="flex flex-col items-center gap-3">
          <img
            src="https://files.kick.com/images/user/3299289/profile_image/conversion/0ad1c855-b1e8-4a44-b081-d2697dd34364-fullsize.webp"
            className="w-16 h-16 rounded-full border border-purple-500"
            alt="AZISAI"
          />
          <p className="text-purple-300 font-bold text-lg">AZISAI0721</p>
          <div className="flex gap-4 mt-2 flex-wrap justify-center">
            <a href="https://x.com/RATOR205" target="_blank">
              <img src="https://i.ibb.co/dJjtLCgh/Screenshot-2025-02-13-153630-removebg-preview.png" className="w-8 h-8" />
            </a>
            <a href="https://youtube.com/@azisai-onkazi-kirinuki" target="_blank">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png" className="w-8 h-8" />
            </a>
            <a href="https://kick.com/azisai0721" target="_blank">
              <img src="https://i.ibb.co/Zsw9SH9/images-removebg-preview.png" className="w-10 h-8" />
            </a>
            <a href="https://roobet.com/?ref=azisai07219" target="_blank">
              <img src="https://i.ibb.co/8gKXJsDz/Screenshot-1-150x150-removebg-preview.png" className="w-8 h-8" />
            </a>
            <a href="https://play1w.com/jpn?sub3=AZISAI07219" target="_blank">
              <img src="https://cdn6.aptoide.com/imgs/4/9/f/49fd00da6f40e313a1164a5dce21aff8_icon.jpg?w=128" className="w-8 h-8" />
            </a>
            <a href="https://discord.gg/azisai" target="_blank">
              <img src="https://i.ibb.co/81pqFsY/Screenshot-2025-02-13-153913-removebg-preview.png" className="w-8 h-8" />
            </a>
          </div>
          <p className="text-xs text-purple-500 mt-3">© 2025 AZISAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
