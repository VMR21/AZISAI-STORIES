import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  increment,
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const navigate = useNavigate();

  // Get post + increment views
  useEffect(() => {
    const fetchPost = async () => {
      const ref = doc(db, "posts", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setPost(snap.data());
        await updateDoc(ref, { views: increment(1) });
      } else {
        navigate("/");
      }
    };
    fetchPost();
  }, [id, navigate]);

  // Get auth
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  // Get comments
  useEffect(() => {
    const q = query(
      collection(db, "posts", id, "comments"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const all = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setComments(all);
    });
    return unsub;
  }, [id]);

  const handleLike = async () => {
    if (liked) return;
    await updateDoc(doc(db, "posts", id), { likes: increment(1) });
    setLiked(true);
  };

  const handleDelete = async () => {
    if (window.confirm("この投稿を削除しますか？")) {
      await deleteDoc(doc(db, "posts", id));
      navigate("/");
    }
  };

  const handleComment = async () => {
    if (!name.trim() || !text.trim()) return;
    await addDoc(collection(db, "posts", id, "comments"), {
      name,
      text,
      createdAt: serverTimestamp(),
    });
    setText("");
  };

  if (!post) return null;

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-black via-purple-950 to-pink-900 text-white">
      <div className="max-w-3xl mx-auto bg-black/20 backdrop-blur-xl p-8 rounded-xl shadow-lg border border-pink-500/20">

        {post.image && (
          <img
            src={post.image}
            className="w-full h-64 object-cover rounded-lg mb-6"
            alt="Post"
          />
        )}

        <h1 className="text-4xl font-bold text-pink-300 mb-2">{post.title}</h1>
        <p className="text-sm text-purple-300 mb-6">{post.date}</p>
        <p className="whitespace-pre-wrap mb-6 text-lg leading-relaxed text-white/90">{post.content}</p>

        {/* ❤️ Like & 👁 Views */}
        <div className="flex gap-6 items-center text-pink-300 text-sm mb-4">
          <button onClick={handleLike} className="hover:text-red-500 transition">
            ❤️ {post.likes || 0}
          </button>
          <span>👁 {post.views || 1}</span>
        </div>

        {/* 🔗 Share */}
        <div className="flex gap-4 text-sm mb-8">
          <a
            href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${encodeURIComponent(post.title)}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 hover:text-blue-500 underline"
          >
            🔗 Twitterで共有
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("リンクをコピーしました！");
            }}
            className="text-purple-300 underline hover:text-purple-400"
          >
            📋 リンクをコピー
          </button>
        </div>

        {/* 🔐 Delete */}
        {user && (
          <button
            onClick={handleDelete}
            className="mb-8 text-sm bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
          >
            🗑 投稿を削除
          </button>
        )}

        {/* 💬 Comments */}
        <h2 className="text-2xl text-pink-400 font-bold mt-10 mb-4">💬 コメント</h2>
        <div className="space-y-4 mb-6">
          {comments.length === 0 && <p className="text-sm text-pink-200">コメントがまだありません。</p>}
          {comments.map((c) => (
            <div key={c.id} className="bg-white/5 p-3 rounded-md border border-pink-500/10">
              <p className="font-semibold text-pink-300">{c.name}</p>
              <p className="text-sm text-white/90">{c.text}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="お名前"
            className="w-full bg-black/30 p-2 rounded border border-pink-500/20 text-sm"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="コメントを入力..."
            rows="3"
            className="w-full bg-black/30 p-2 rounded border border-pink-500/20 text-sm"
          />
          <button
            onClick={handleComment}
            className="bg-pink-500 px-4 py-2 rounded hover:bg-pink-600 text-sm transition"
          >
            ➕ コメントを追加
          </button>
        </div>
      </div>
    </div>
  );
}
