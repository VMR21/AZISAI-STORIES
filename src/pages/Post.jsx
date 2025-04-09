import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const ref = doc(db, "posts", id);
      const snap = await getDoc(ref);
      if (snap.exists()) setPost(snap.data());
    };
    fetch();
  }, [id]);

  if (!post) return <div className="text-center text-white p-8">読み込み中...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-pink-900 text-white p-6">
      <div className="max-w-3xl mx-auto glass p-6 rounded-xl shadow-xl">
        {post.image && <img src={post.image} className="w-full rounded-xl mb-4" />}
        <h1 className="text-3xl font-bold text-pink-300 mb-2">{post.title}</h1>
        <p className="text-sm text-purple-300 mb-4">{post.date}</p>
        <p className="whitespace-pre-wrap">{post.content}</p>
      </div>
    </div>
  );
}
