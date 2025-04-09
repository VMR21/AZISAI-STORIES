import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function NewPost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        alert("ログインが必要です");
        navigate("/login");
      }
    });
  }, [navigate]);

  const handleSubmit = async () => {
    const newPost = {
      title,
      content,
      image: "",
      date: new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
    };

    try {
      await addDoc(collection(db, "posts"), newPost);
      alert("✅ 投稿完了！");
      navigate("/");
    } catch {
      alert("❌ 投稿に失敗しました。");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-fuchsia-900 to-purple-950 text-white p-6 flex justify-center items-start">
      {/* CRAZY ANIMATED BG LIGHTS */}
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
        <div className="absolute bg-pink-500 opacity-20 w-[300px] h-[300px] rounded-full blur-3xl animate-pulse left-10 top-10" />
        <div className="absolute bg-purple-500 opacity-20 w-[400px] h-[400px] rounded-full blur-2xl animate-spin-slow right-0 top-20" />
        <div className="absolute bg-blue-500 opacity-10 w-[200px] h-[200px] rounded-full blur-xl animate-bounce bottom-10 left-[40%]" />
      </div>

      {/* FORM CONTAINER */}
      <div className="z-10 w-full max-w-3xl glass p-8 backdrop-blur-xl border border-fuchsia-500/30 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-pink-400 to-blue-500 text-transparent bg-clip-text animate-pulse">
          🚀 AZISAI投稿エディター
        </h1>

        <input
          type="text"
          placeholder="✨ タイトルを入力してください"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-black/50 text-white/90 p-4 rounded-lg border border-pink-500 focus:ring-2 focus:ring-pink-400 text-xl mb-6"
        />

        <textarea
          placeholder="🌈 ストーリーを書く時間です！"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="10"
          className="w-full bg-black/50 text-white/90 p-4 rounded-lg border border-purple-500 focus:ring-2 focus:ring-purple-400 text-lg"
        ></textarea>

        <button
          onClick={handleSubmit}
          className="mt-8 w-full bg-gradient-to-r from-pink-600 via-purple-600 to-fuchsia-500 hover:scale-105 transition shadow-xl text-lg py-3 font-bold rounded-lg"
        >
          💾 投稿を保存する
        </button>
      </div>
    </div>
  );
}
