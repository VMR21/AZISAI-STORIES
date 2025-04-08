import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NewPost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("loggedIn") !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  const handleImageUpload = (e) => {
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmit = () => {
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    const newPost = {
      title,
      content,
      image,
      date: new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
    };
    posts.unshift(newPost);
    localStorage.setItem("posts", JSON.stringify(posts));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-fuchsia-900 to-purple-950 p-6 text-white flex flex-col lg:flex-row gap-6">
      <div className="lg:w-1/2 space-y-4">
        <h1 className="text-3xl font-bold text-pink-300">🖋️ Write a Post</h1>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-black/40 border border-pink-500 p-3 rounded"
        />
        <textarea
          placeholder="Your story here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="8"
          className="w-full bg-black/40 border border-pink-500 p-3 rounded"
        ></textarea>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-gradient-to-r from-pink-500 to-purple-600 py-3 text-lg font-bold rounded hover:scale-105 transition"
        >
          🚀 Post to AZISAI
        </button>
      </div>
      <div className="lg:w-1/2 bg-white/10 rounded-xl p-6 shadow-lg backdrop-blur-md">
        <h2 className="text-xl text-pink-400 font-bold mb-2">✨ Live Preview</h2>
        {image && (
          <img
            src={image}
            alt="preview"
            className="mb-4 w-full max-h-60 object-cover rounded"
          />
        )}
        <h3 className="text-2xl font-semibold">{title || "タイトル"}</h3>
        <p className="text-sm mt-2 whitespace-pre-wrap">{content || "ここにストーリーが表示されます。"}</p>
      </div>
    </div>
  );
};

export default NewPost;
