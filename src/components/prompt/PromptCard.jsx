import { Link } from 'react-router';

import { Copy, Heart } from 'lucide-react';
import Heading from '../typography/Heading';
import Paragraph from '../typography/Paragraph';

export default function PromptCard({ prompt }) {
  const variables = (prompt.variables || [])
    .map((v) => (typeof v === 'string' ? v : v.name))
    .filter(Boolean)
    .slice(0, 3)
    .join(', ');

  return (
    <Link to={`prompt/${prompt.id}`} className="block group">
      <article className="bg-white p-5 rounded-2xl border border-gray-300 shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-xl group-hover:border-blue-500">
        <Heading className="mb-2 line-clamp-1" level='3'>
          {prompt.title}
        </Heading>
        <Paragraph className="inline-block font-normal text-blue-500 rounded-full px-2.5 py-.5 border border-blue-300 mb-3">
          {prompt.category}
        </Paragraph>
        {variables && (
          <Paragraph className="mt-2.5 font-normal">{variables}</Paragraph>
        )}
        {!variables && (
          <Paragraph className="mt-2.5 font-normal">No variables available.</Paragraph>
        )}

        {/* Likes and Copies */}
        <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
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
