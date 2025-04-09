import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

export default function ViewPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  useEffect(() => {
    const docRef = doc(db, "posts", id);
    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        setPost({ id: docSnap.id, ...docSnap.data() });
      } else {
        setPost(null);
      }
    });
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("本当にこの投稿を削除しますか？")) {
      await deleteDoc(doc(db, "posts", id));
      navigate("/");
    }
  };

  if (!post) return <div className="p-6 text-white">投稿が見つかりません</div>;

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto text-white">
      <div className="flex justify-between items-start">
        <Link to="/" className="text-pink-300 hover:underline">← 戻る</Link>
        {isLoggedIn && (
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
          >
            🗑️ 削除する
          </button>
        )}
      </div>
      <div className="mt-6">
        {post.image && (
          <img
            src={post.image}
            alt="投稿画像"
            className="mb-4 rounded-lg max-h-96 w-full object-cover"
          />
        )}
        <h1 className="text-3xl font-bold text-pink-300 mb-2">{post.title}</h1>
        <p className="text-sm text-pink-200 mb-4">{post.date}</p>
        <p className="whitespace-pre-wrap text-lg">{post.content}</p>
      </div>
    </div>
  );
}
