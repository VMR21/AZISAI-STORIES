import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function NewPost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("loggedIn") !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    let imageUrl = "";
    if (imageFile) {
      const storage = getStorage();
      const storageRef = ref(storage, `images/${Date.now()}-${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }
    const newPost = {
      title,
      content,
      image: imageUrl,
      date: new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
    };
    try {
      await addDoc(collection(db, "posts"), newPost);
      navigate("/");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("投稿に失敗しました。");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-fuchsia-900 to-purple-950 p-6 text-white flex flex-col lg:flex-row gap-6">
      {/* Post Editor */}
      <div className="lg:w-1/2 space-y-4">
        <h1 className="text-3xl font-bold text-pink-300 mb-6 animate-pulse">🎨 新しい投稿</h1>

        <input
          type="text"
          placeholder="タイトルを入力"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-black/40 border border-pink-500 p-3 rounded text-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
        />

        <textarea
          placeholder="ここにストーリーを書いてください..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="8"
          className="w-full bg-black/40 border border-pink-500 p-3 rounded h-40 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
        ></textarea>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4 text-sm text-pink-200"
        />

        {preview && (
          <img
            src={preview}
            alt="プレビュー"
            className="rounded w-full max-h-60 object-cover border border-pink-500 shadow-lg hover:scale-105 transition"
          />
        )}

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg rounded hover:scale-105 transition"
        >
          🚀 投稿する
        </button>
      </div>

      {/* Live Preview */}
      <div className="lg:w-1/2 bg-white/10 rounded-xl p-6 shadow-lg backdrop-blur-md animate-fadeIn">
        <h2 className="text-xl text-pink-400 font-bold mb-2">✨ ライブプレビュー</h2>
        {preview && (
          <img
            src={preview}
            alt="プレビュー"
            className="mb-4 w-full max-h-60 object-cover rounded"
          />
        )}
        <h3 className="text-2xl font-semibold text-pink-300">{title || "タイトルがここに表示されます"}</h3>
        <p className="text-sm mt-2 whitespace-pre-wrap text-white/90">
          {content || "ここにストーリーが表示されます"}
        </p>
      </div>
    </div>
  );
}
