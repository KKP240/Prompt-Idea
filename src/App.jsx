import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddPrompt from "./pages/AddPrompt";
import PromptDetail from "./pages/PromptDetail";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddPrompt />} />
          <Route path="/prompt/:id" element={<PromptDetail />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;