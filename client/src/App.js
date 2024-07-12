import Home from "./components/home.jsx";
import Login from "./components/login.jsx";
import Register from "./components/register.jsx";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const info = localStorage.getItem("user");

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
