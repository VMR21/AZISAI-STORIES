import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkCredentials } from "../utils/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (checkCredentials(email, password)) {
      localStorage.setItem("loggedIn", "true");
      navigate("/new");
    } else {
      alert("メールまたはパスワードが正しくありません");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <div className="bg-white/10 p-8 rounded-xl w-full max-w-md backdrop-blur">
        <h2 className="text-2xl font-bold mb-4 text-pink-400">ログイン</h2>
        <input
          type="email"
          placeholder="メールアドレス"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 bg-black border border-pink-400 rounded"
        />
        <input
          type="password"
          placeholder="パスワード"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 bg-black border border-pink-400 rounded"
        />
        <button
          onClick={handleLogin}
          className="w-full py-2 bg-pink-600 hover:bg-pink-700 rounded text-white font-bold"
        >
          ログイン
        </button>
      </div>
    </div>
  );
}
