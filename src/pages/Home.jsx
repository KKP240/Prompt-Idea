import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import { Flame } from 'lucide-react';
import PromptCard from '../components/prompt/PromptCard';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import BasicPagination from '../components/BasicPagination';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const [prompts, setPrompts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState({ success: true, message: '' });

  // Config Page
  const [searchParams, setSearchParams] = useSearchParams();
  const PAGE_SIZE = 12;
  const selectedCategory = searchParams.get('category') || '';
  const currentPage = Number(searchParams.get('page')) || 1;

  const filteredPrompts = selectedCategory
    ? prompts.filter((p) => p.category === selectedCategory)
    : prompts;
  const totalPages = Math.ceil(filteredPrompts.length / PAGE_SIZE);

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

      {prompts.length > 0 &&
        (() => {
          // ดึง Category แบบไม่ซ้ำ และเรียงตามตัวอักษร
          const cats = Array.from(
            new Set(prompts.map((p) => p.category).filter(Boolean)),
          );
          cats.sort(
            (a, b) => a.localeCompare(b, 'en') || a.localeCompare(b, 'th'),
          );

          // กำหนดค่า Tab ปัจจุบัน (ถ้าไม่มี selectedCategory ให้เป็น 'all')
          const activeTab = selectedCategory || 'all';

          return (
            <div className="mt-4">
              <Tabs value={activeTab}>
                {/* ครอบด้วย div เพื่อให้เลื่อนซ้ายขวาได้ในจอมือถือ */}
                <div className="overflow-x-auto overflow-y-hidden">
                  <TabsList
                    variant="line"
                    className="w-full justify-start border-b mb-6"
                  >
                    {/* Tab: All */}
                    <TabsTrigger
                      value="all"
                      onClick={() => {
                        setSearchParams({ page: '1' });
                      }}
                      // เพิ่มคลาสเปลี่ยนสีตรงนี้
                      className="data-[state=active]:text-blue-500"
                    >
                      All
                    </TabsTrigger>

                    {/* Tabs: Categories */}
                    {cats.map((c) => (
                      <TabsTrigger
                        key={c}
                        value={c}
                        onClick={() => {
                          setSearchParams({ category: c, page: '1' });
                        }}
                        // เพิ่มคลาสเปลี่ยนสีตรงนี้ด้วย
                        className="data-[state=active]:text-blue-500"
                      >
                        {c}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </Tabs>
            </div>
          );
        })()}

      {/* Prompts Loading... */}
      {isLoaded && <Loading />}

      {/* Error Fetching Prompts... */}
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
              <p className="text-gray-500 font-light">No prompt available.</p>
            )}
          </div>

          {/* Pagination */}
          {filteredPrompts.length > PAGE_SIZE && (
            <BasicPagination totalPages={totalPages} />
          )}
        </>
      )}
    </div>
  );
}
