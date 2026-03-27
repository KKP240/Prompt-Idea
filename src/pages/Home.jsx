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
      <Heading className="mb-10 flex items-center gap-2">
        <Flame className="size-8" />
        Popular Prompts
      </Heading>

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
            {filteredPrompts.length > 0 ? (
              filteredPrompts
                .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
                .map((p) => <PromptCard key={p.id} prompt={p} />)
            ) : (
              <Paragraph>No prompt available.</Paragraph>
            )}
          </div>

          {/* Pagination */}
          {filteredPrompts.length > PAGE_SIZE && <BasicPagination totalPages={totalPages} />}
        </>
      )}
    </div>
  );
}
