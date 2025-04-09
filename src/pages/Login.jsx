import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("azisai@gmail.com");
  const [password, setPassword] = useState("azisai07219");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem("loggedIn", "true");
        navigate("/new");
      }
    });
    return () => unsub();
  }, [navigate]);

  const handleLogin = async () => {
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("ログインに失敗しました。メールアドレスとパスワードを確認してください。");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-900 to-pink-900 text-white">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-pink-300">AZISAI 管理者ログイン</h1>

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
          className="w-full bg-gradient-to-r from-pink-500 to-purple-700 py-2 rounded text-white font-bold hover:scale-105 transition"
        >
          ログイン ➤
        </button>
      </div>
    </div>
  );
}
