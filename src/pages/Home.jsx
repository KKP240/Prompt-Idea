import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import { Flame } from 'lucide-react';
import PromptCard from '../components/prompt/PromptCard';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';

export default function Home() {
  const [prompts, setPrompts] = useState([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState({ success: true, message: '' });
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setIsLoaded(true);

        const q = query(collection(db, 'prompts'), orderBy('metrics.likes', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPrompts(data);
        console.log(data)
      } catch (err) {
        setError({ success: false, message: err.message });
      } finally {
        setIsLoaded(false);
      }
    };

    fetchPrompts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <h1 className="text-3xl font-extrabold mb-10 flex items-center gap-2">
        <Flame />
        Popular Prompts
      </h1>

      {prompts.length > 0 && (
        (() => {
          const cats = Array.from(new Set(prompts.map(p => p.category).filter(Boolean)));
          cats.sort((a, b) => a.localeCompare(b, 'en') || a.localeCompare(b, 'th'));
          return (
            <div className="mt-4">
              <div className="rounded-2xl overflow-x-auto whitespace-nowrap py-3 px-2" style={{ background: '' }}>
                <div className="flex gap-3 px-2 py-2">
                  <button
                    onClick={() => { setSearchParams({}); setPage(1); }}
                    className={`px-4 py-1 rounded-full text-sm ${selectedCategory === '' ? 'ring-2 ring-offset-2 ring-white' : 'bg-white/30'}`}
                  >
                    All
                  </button>
                  {cats.map((c, idx) => {
                    const hue = Math.round((idx / Math.max(1, cats.length - 1)) * 270);
                    const bg = `hsl(${hue} 100% 40%)`;
                    return (
                      <button
                        key={c}
                        onClick={() => { setSearchParams({ category: c }); setPage(1); }}
                        className="px-4 py-1 rounded-full text-sm text-white"
                        style={{ background: bg }}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          
          );
        })()
      )}

      {/* Prompts Loading... */}
      {isLoaded && <Loading />}

      {/* Error Fetching Prompts... */}
      {!isLoaded && !error.success && <ErrorMessage message={error.message} />}

      {/* Render Prompts */}
      {error.success && !isLoaded && (
        <>
          <div className="grid md:grid-cols-3 gap-6">
            {prompts.length > 0 ? (
              (() => {
                const filtered = selectedCategory ? prompts.filter((x) => x.category === selectedCategory) : prompts;
                const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
                return pageItems.map((p) => <PromptCard key={p.id} prompt={p} />);
              })()
            ) : (
              <p className="text-gray-500 font-light">No prompt available.</p>
            )}
          </div>

          {/* Pagination */}
          {(() => {
            const filteredTotal = selectedCategory ? prompts.filter((x) => x.category === selectedCategory).length : prompts.length;
            return filteredTotal > PAGE_SIZE && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button onClick={() => setPage(1)} disabled={page === 1} className="px-3 py-1 rounded border">
                &lt;&lt;
              </button>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded border">
                &lt;
              </button>

              {(() => {
                const total = Math.ceil(filteredTotal / PAGE_SIZE);
                const pages = [];
                const start = Math.max(1, page - 2);
                const end = Math.min(total, page + 2);
                if (start > 1) pages.push(1);
                if (start > 2) pages.push('left-ellipsis');
                for (let i = start; i <= end; i++) pages.push(i);
                if (end < total - 1) pages.push('right-ellipsis');
                if (end < total) pages.push(total);

                return pages.map((p, idx) => {
                  if (p === 'left-ellipsis' || p === 'right-ellipsis') return (
                    <div key={p + idx} className="px-2">...</div>
                  );
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${p === page ? 'bg-indigo-600 text-white' : 'bg-white border'}`}
                    >
                      {p}
                    </button>
                  );
                });
              })()}

              <button onClick={() => setPage((p) => Math.min(Math.ceil(filteredTotal / PAGE_SIZE), p + 1))} disabled={page === Math.ceil(filteredTotal / PAGE_SIZE)} className="px-3 py-1 rounded border">
                &gt;
              </button>
              <button onClick={() => setPage(Math.ceil(filteredTotal / PAGE_SIZE))} disabled={page === Math.ceil(filteredTotal / PAGE_SIZE)} className="px-3 py-1 rounded border">
                &gt;&gt;
              </button>
            </div>
            );
          })()}
        </>
      )}
    </div>
  );
}
