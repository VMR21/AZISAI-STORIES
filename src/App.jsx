import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NewPost from "./pages/NewPost";
import ViewPost from "./pages/ViewPost";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/new" element={<NewPost />} />
        <Route path="/post/:id" element={<ViewPost />} />
      </Routes>
    </Router>
  );
}
