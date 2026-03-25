import { Link } from 'react-router';

import { Copy, Heart } from 'lucide-react';

export default function PromptCard({ prompt }) {
  const variables = (prompt.variables || [])
    .map((v) => (typeof v === 'string' ? v : v.name))
    .filter(Boolean)
    .slice(0, 3)
    .join(', ');

  return (
    <Link to={`prompt/${prompt.id}`} className="block group">
      <article className="bg-white p-5 rounded-2xl border border-gray-300 shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-xl group-hover:border-blue-500">
        <h3 className="text-xl font-semibold mb-2 line-clamp-1">
          {prompt.title}
        </h3>
        <p className="inline-block text-sm font-medium text-blue-500 rounded-full px-2 py-1 border-2 border-blue-500 mb-3">
          {prompt.category}
        </p>
        {variables && (
          <div className="text-sm text-gray-400 mt-4">{variables}</div>
        )}
        <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Heart className="size-4 fill-blue-500 stroke-0" />
              {prompt.metrics?.likes ?? 0}
            </div>
            <div className="flex items-center gap-1.5">
              <Copy className="size-4" />
              {prompt.metrics?.uses ?? 0}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
