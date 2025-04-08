import { useParams, Link } from "react-router-dom";

const ViewPost = () => {
  const { id } = useParams();
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const post = posts[id];

  if (!post) return <div className="p-6 text-white">Post not found.</div>;

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto text-white">
      <Link to="/" className="text-pink-300 hover:underline">← Back to AZISAI</Link>
      <div className="mt-6">
        {post.image && <img src={post.image} alt="cover" className="mb-4 rounded-lg max-h-96 w-full object-cover" />}
        <h1 className="text-3xl font-bold text-pink-300 mb-2">{post.title}</h1>
        <p className="text-sm text-pink-200 mb-4">{post.date}</p>
        <p className="whitespace-pre-wrap text-lg">{post.content}</p>
      </div>
    </div>
  );
};

export default ViewPost;
