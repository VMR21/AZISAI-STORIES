import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function NewPost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        alert("ログインが必要です");
        navigate("/login");
      }
    });
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
      try {
        const storage = getStorage();
        const metadata = { contentType: imageFile.type };
        const imageRef = ref(storage, `images/${Date.now()}-${imageFile.name}`);
        const uploadTask = uploadBytesResumable(imageRef, imageFile, metadata);

        await new Promise((resolve, reject) => {
          uploadTask.on("state_changed", null, reject, async () => {
            imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve();
          });
        });
      } catch (err) {
        alert("⚠️ 画像のアップロードに失敗しました。");
      }
    }

    const newPost = {
      title,
      content,
      image: imageUrl,
      date: new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
    };

    try {
      await addDoc(collection(db, "posts"), newPost);
      navigate("/");
    } catch {
      alert("投稿に失敗しました。");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-pink-900 text-white p-6 flex flex-col lg:flex-row gap-6">
      <div className="lg:w-1/2 space-y-4">
        <h1 className="text-3xl font-bold text-pink-400">🎨 新しい投稿</h1>

        <input
          type="text"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-black/40 border border-pink-500 p-3 rounded"
        />

        <textarea
          placeholder="ストーリー"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="6"
          className="w-full bg-black/40 border border-pink-500 p-3 rounded"
        ></textarea>

        <input type="file" accept="image/*" onChange={handleImageChange} className="text-pink-300" />

        {preview && <img src={preview} className="max-h-60 object-cover rounded border border-pink-500" />}

        <button
          onClick={handleSubmit}
          className="w-full bg-pink-600 py-3 rounded font-bold hover:scale-105 transition"
        >
          🚀 投稿
        </button>
      </div>
    </div>
  );
}
