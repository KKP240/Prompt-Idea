import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

import { useEffect, useState } from 'react';

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

      {/* Prompts Loading... */}
      {isLoaded && <Loading />}

      {/* Error Fetching Prompts... */}
      {!isLoaded && !error.success && <ErrorMessage message={error.message} />}

      {/* Render Prompts */}
      {error.success && !isLoaded && (
        <>
          <div className="grid md:grid-cols-3 gap-6">
            {prompts.length > 0 ? (
              prompts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((p) => (
                <PromptCard key={p.id} prompt={p} />
              ))
            ) : (
              <p className="text-gray-500 font-light">No prompt available.</p>
            )}
          </div>

          {/* Pagination */}
          {prompts.length > PAGE_SIZE && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button onClick={() => setPage(1)} disabled={page === 1} className="px-3 py-1 rounded border">
                &lt;&lt;
              </button>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded border">
                &lt;
              </button>

              {(() => {
                const total = Math.ceil(prompts.length / PAGE_SIZE);
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

              <button onClick={() => setPage((p) => Math.min(Math.ceil(prompts.length / PAGE_SIZE), p + 1))} disabled={page === Math.ceil(prompts.length / PAGE_SIZE)} className="px-3 py-1 rounded border">
                &gt;
              </button>
              <button onClick={() => setPage(Math.ceil(prompts.length / PAGE_SIZE))} disabled={page === Math.ceil(prompts.length / PAGE_SIZE)} className="px-3 py-1 rounded border">
                &gt;&gt;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
