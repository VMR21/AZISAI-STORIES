import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkCredentials } from "../utils/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = () => {
    if (checkCredentials(email, password)) {
      localStorage.setItem("loggedIn", "true");
      navigate("/new");
    } else {
      alert("Wrong credentials!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <div className="bg-white/10 p-8 rounded-xl w-full max-w-md backdrop-blur">
        <h2 className="text-2xl font-bold mb-4 text-pink-400">Login to AZISAI</h2>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 bg-black border border-pink-400 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 bg-black border border-pink-400 rounded"
        />
        <button
          onClick={login}
          className="w-full py-2 bg-pink-600 hover:bg-pink-700 rounded text-white font-bold"
        >
          Enter
        </button>
      </div>
    </div>
  );
};

export default Login;
