import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import PromptCard from '../components/PromptCard';
import { Flame } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';

export default function Home() {
  const [prompts, setPrompts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState({ success: true, message: '' });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setIsLoaded(true);

        const snapshot = await getDocs(collection(db, 'prompts'));
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
        <div className="grid md:grid-cols-3 gap-6">
          {prompts.length > 0 &&
            prompts.map((p) => (
              <PromptCard
                key={p.id}
                prompt={p}
                onClick={() => navigate(`/prompt/${p.id}`)}
              />
            ))}
          {prompts.length === 0 && (
            <p className="text-gray-500 font-light">No prompt available.</p>
          )}
        </div>
      )}
    </div>
  );
}
