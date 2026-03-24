export default function PromptCard({ prompt, onClick }) {
  return (
    <article
      onClick={onClick}
      className="bg-white p-5 rounded-2xl border border-gray-200 shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:border-blue-500 cursor-pointer"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{prompt.title}</h3>
      <p className="text-sm text-gray-500 mb-3">{prompt.category}</p>
      <div className="text-xs text-gray-400">{prompt.variables?.slice(0,3).join(', ')}</div>
    </article>
  );
}
