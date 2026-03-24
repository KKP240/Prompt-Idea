import { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router";

export default function AddPrompt() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [template, setTemplate] = useState("");
  const [variables, setVariables] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    await addDoc(collection(db, "prompts"), {
      title,
      category,
      template,
      variables: variables.split(",").map(v => v.trim()),
      popular: false
    });

    navigate("/");
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-4">➕ Add Prompt</h1>

        <label className="block mb-3">
          <span className="text-sm text-gray-600">Title</span>
          <input className="w-full border-gray-200 border px-3 py-2 rounded mt-1" placeholder="Title" onChange={e => setTitle(e.target.value)} />
        </label>

        <label className="block mb-3">
          <span className="text-sm text-gray-600">Category</span>
          <input className="w-full border-gray-200 border px-3 py-2 rounded mt-1" placeholder="Category" onChange={e => setCategory(e.target.value)} />
        </label>
        
        <label className="block mb-3">
          <span className="text-sm text-gray-600">Template</span>
          <textarea className="w-full border-gray-200 border px-3 py-2 rounded mt-1" placeholder="Template" onChange={e => setTemplate(e.target.value)} />
        </label>

        <label className="block mb-4">
          <span className="text-sm text-gray-600">Variables (comma separated)</span>
          <input className="w-full border-gray-200 border px-3 py-2 rounded mt-1" placeholder="topic,length" onChange={e => setVariables(e.target.value)} />
        </label>

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Save Prompt
        </button>
      </div>
    </div>
  );
}