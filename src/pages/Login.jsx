import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState(""); // ❌ Removed default value
  const [password, setPassword] = useState(""); // ❌ Removed default value
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/new");
    } catch {
      setError("ログインに失敗しました。メールアドレスとパスワードを確認してください。");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-pink-900 text-white flex items-center justify-center">
      <div className="glass p-8 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-pink-300">AZISAI 管理者ログイン</h1>
        {error && <p className="text-red-400 mb-3">{error}</p>}

        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-black/30 border border-pink-500"
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 rounded bg-black/30 border border-pink-500"
        />
        <button
          onClick={handleLogin}
          className="w-full py-2 bg-pink-600 rounded hover:scale-105 font-bold"
        >
          ログイン ➤
        </button>
      </div>
    </div>
  );
}
