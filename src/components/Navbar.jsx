import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white border-b shadow-sm px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-indigo-600">
        PromptCraft
      </h1>

      <div className="space-x-4">
        <Link to="/" className="text-gray-600 hover:text-black">
          Home
        </Link>
        <Link to="/add" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          + Add Prompt
        </Link>
      </div>
    </nav>
  );
}