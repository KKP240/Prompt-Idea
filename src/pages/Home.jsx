import { db } from '@/firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/LanguageProvider';
import { useSearchParams } from 'react-router';

import { Flame } from 'lucide-react';
import Loading from '@/components/common/Loading';
import ErrorMessage from '@/components/common/ErrorMessage';
import PromptCard from '@/components/prompt/PromptCard';
import BasicPagination from '@/components/common/BasicPagination';
import CategoryTab from '@/components/home/CategoryTab';
import Heading from '@/components/typography/Heading';
import Paragraph from '@/components/typography/Paragraph';

const PAGE_SIZE = 12;

export default function Home() {
  const [prompts, setPrompts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState({ success: true, message: '' });

  // Config Page
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || '';
  const currentPage = Number(searchParams.get('page')) || 1;

  const { lang: useLang } = useLanguage();

  const filteredPrompts = selectedCategory
    ? prompts.filter((p) => p.category === selectedCategory)
    : prompts;
  const totalPages = Math.ceil(filteredPrompts.length / PAGE_SIZE);
  const [sortBy, setSortBy] = useState('likes');

  const sortedPrompts = [...filteredPrompts].sort((a, b) => {
    if (sortBy === 'likes') return (b.metrics?.likes || 0) - (a.metrics?.likes || 0);
    if (sortBy === 'copies') return (b.metrics?.uses || 0) - (a.metrics?.uses || 0);
    if (sortBy === 'alpha') return String(a.title || '').localeCompare(String(b.title || ''), undefined, { sensitivity: 'base' });
    return 0;
  });

  // Fetch Prompts
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setIsLoaded(true);
        const col = (useLang === undefined) ? 'prompts' : useLang;
        // prefer full collection name mapping
        const collectionName = (col === 'th' || col === 'prompts-th') ? 'prompts-th' : 'prompts';
        const q = query(collection(db, collectionName), orderBy('metrics.likes', 'desc'));
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
  }, [useLang]);

  return (
    <div className="px-6 py-14">
      <div className="mb-10 flex items-center justify-between">
        <Heading className="flex items-center gap-2">
          <Flame className="size-8" />
          Popular Prompts
        </Heading>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-gray-500">Sort:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-md bg-white px-3 py-2 text-sm focus:outline-none"
          >
            <option value="likes">Most liked</option>
            <option value="alpha">Alphabetical (A–Z)</option>
            <option value="copies">Most copied</option>
          </select>
        </div>
      </div>

      {/* Tab Categories */}
      {prompts.length > 0 && (
        () => {
          const cats = Array.from(new Set(prompts.map((p) => p.category)
            .filter(Boolean)))
            .sort((a, b) => a.localeCompare(b, 'en') || a.localeCompare(b, 'th'));

          return (
            <CategoryTab 
              activeTab={selectedCategory || 'all'} 
              categories={cats} 
              className='mt-4' 
            />
          );
        }
      )()}

      {/* Prompts Loading */}
      {isLoaded && <Loading />}

      {/* Error Fetching Prompts */}
      {!isLoaded && !error.success && <ErrorMessage message={error.message} />}

      {/* Render Prompts */}
      {error.success && !isLoaded && (
        <>
          <div className="grid md:grid-cols-2 gap-6 mb-15">
            {sortedPrompts.length > 0 ? (
              sortedPrompts
                .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
                .map((p) => <PromptCard key={p.id} prompt={p} />)
            ) : (
              <Paragraph>No prompt available.</Paragraph>
            )}
          </div>

          {/* Pagination */}
          {sortedPrompts.length > PAGE_SIZE && <BasicPagination totalPages={totalPages} />}
        </>
      )}
    </div>
  );
}
