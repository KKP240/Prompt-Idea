import { Link } from 'react-router';

export default function PromptCard({ prompt }) {
  const variables = prompt.variables?.slice(0, 3).join(', ');

  return (
    <Link to={`prompt/${prompt.id}`} className="block group">
      <article className="bg-white p-5 rounded-2xl border border-gray-300 shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-xl group-hover:border-blue-500">
        <h3 className="text-lg font-semibold mb-1 line-clamp-1">{prompt.title}</h3>
        <p className="inline-block text-sm text-blue-500 rounded-full px-2 py-1 border border-blue-500 mb-3">
          {prompt.category}
        </p>
        {variables && (
          <div className="text-xs text-gray-400 mt-4">{variables}</div>
        )}
      </article>
    </Link>
  );
}
