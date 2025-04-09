import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");

  const handleAddPost = () => {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    navigate(isLoggedIn ? "/new" : "/login");
  };

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-pink-300">AZISAIの記事</h1>
        <button
          onClick={handleAddPost}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
        >
          ➕ 投稿する
        </button>
      </div>
      {posts.length === 0 && (
        <p className="text-center text-gray-400">まだ投稿がありません。</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <Link
            key={index}
            to={`/post/${index}`}
            className="bg-white/10 border border-pink-400 backdrop-blur p-4 rounded-xl hover:scale-105 transition"
          >
            {post.image && (
              <img
                src={post.image}
                alt="カバー画像"
                className="mb-2 rounded object-cover h-40 w-full"
              />
            )}
            <h2 className="font-bold text-xl mb-1">{post.title}</h2>
            <p className="text-sm text-pink-200">{post.date}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
