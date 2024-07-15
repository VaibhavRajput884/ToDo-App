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
          <Route path="/accounts" element={<Register />} />
          <Route path="/access-token" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
