import { db } from '@/firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useCallback, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageProvider';
import { useSearchParams } from 'react-router';
import { useQuery } from '@/hooks/useQuery';

import { Flame } from 'lucide-react';
import Loading from '@/components/common/Loading';
import ErrorMessage from '@/components/common/ErrorMessage';
import PromptCard from '@/components/prompt/PromptCard';
import BasicPagination from '@/components/common/BasicPagination';
import CategoryTab from '@/components/home/CategoryTab';
import Heading from '@/components/typography/Heading';
import Paragraph from '@/components/typography/Paragraph';
import SortSelect from '@/components/home/SortSelect';

const PAGE_SIZE = 12;

export default function Home() {
  // Config Page
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || '';
  const currentPage = Number(searchParams.get('page')) || 1;

  const { lang: useLang } = useLanguage();

  // Fetch Prompts
  const fetchPrompts = useCallback(async () => {
      const col = (useLang === undefined) ? 'prompts' : useLang;
      const collectionName = (col === 'th' || col === 'prompts-th') ? 'prompts-th' : 'prompts';
      const q = query(collection(db, collectionName), orderBy('metrics.likes', 'desc'));

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  }, [useLang]);

  const { data: prompts, isLoading, error, execute } = useQuery(fetchPrompts, [])

  useEffect(() => {
    execute()
  }, [execute]);

  // Computed Final Prompts
  const filteredPrompts = selectedCategory
    ? prompts.filter((p) => p.category === selectedCategory)
    : prompts;
  const totalPages = Math.ceil(filteredPrompts.length / PAGE_SIZE);
  
  const selectedSort = searchParams.get('sort_by') || 'likes';
  const sortedPrompts = [...filteredPrompts].sort((a, b) => {
    if (selectedSort === 'likes') return (b.metrics?.likes || 0) - (a.metrics?.likes || 0);
    if (selectedSort === 'copies') return (b.metrics?.uses || 0) - (a.metrics?.uses || 0);
    if (selectedSort === 'alpha') return String(a.title || '').localeCompare(String(b.title || ''), undefined, { sensitivity: 'base' });
    return 0;
  });

  return (
    <div className="px-6 py-14">
      <div className="mb-10 flex items-center justify-between">
        <Heading className="flex items-center gap-2">
          <Flame className="size-8" />
          Popular Prompts
        </Heading>
        
        {/* Sort Select */}
        <SortSelect curSortVal={selectedSort} />
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
      {isLoading && <Loading />}

      {/* Error Fetching Prompts */}
      {!isLoading && !error.success && <ErrorMessage message={error.message} />}

      {/* Render Prompts */}
      {error.success && !isLoading && (
        <>
          <div className="grid md:grid-cols-2 gap-6 mb-15 mt-6">
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
