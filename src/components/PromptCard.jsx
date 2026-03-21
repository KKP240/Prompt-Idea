import React from "react";

export default function PromptCard({ prompt, onClick }) {
  return (
    <article
      onClick={onClick}
      className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{prompt.title}</h3>
      <p className="text-sm text-gray-500 mb-3">{prompt.category}</p>
      <div className="text-xs text-gray-400">{prompt.variables?.slice(0,3).join(', ')}</div>
    </article>
  );
}
