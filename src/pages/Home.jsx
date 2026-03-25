import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import { Flame } from 'lucide-react';
import PromptCard from '../components/prompt/PromptCard';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import BasicPagination from '../components/BasicPagination';

export default function Home() {
  const [prompts, setPrompts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState({ success: true, message: '' });

  // Config Page
  const [searchParams] = useSearchParams();
  const PAGE_SIZE = 12;
  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(prompts.length / PAGE_SIZE);

  // Fetch Prompts
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setIsLoaded(true);

        const q = query(
          collection(db, 'prompts'),
          orderBy('metrics.likes', 'desc'),
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPrompts(data);
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
      <h1 className="text-[2.2rem] font-extrabold mb-10 flex items-center gap-2">
        <Flame className="size-8" />
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
          <div className="grid md:grid-cols-2 gap-6 mb-15">
            {prompts.length > 0 ? (
              prompts
                .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
                .map((p) => <PromptCard key={p.id} prompt={p} />)
            ) : (
              <p className="text-gray-500 font-light">No prompt available.</p>
            )}
          </div>

          {/* Pagination */}
          {prompts.length > PAGE_SIZE && (
            <BasicPagination totalPages={totalPages} />
          )}
        </>
      )}
    </div>
  );
}
