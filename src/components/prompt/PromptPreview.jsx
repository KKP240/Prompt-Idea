import { db } from '@/firebase/config';
import { doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore'; 
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

import Heading from '../typography/Heading';
import { Button } from '../ui/button';
import { Copy, Heart } from 'lucide-react';

export default function PromptPreview({ prompt, setPrompt, generated, lang, id, getClientId }) {
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [used, setUsed] = useState(false);
  const [useLoading, setUseLoading] = useState(false);

  useEffect(() => {
    if (!prompt) return;
    getClientId().then((clientId) => {
      if (prompt.likedBy?.includes(clientId)) setLiked(true);
      if (prompt.usedBy?.includes(clientId)) setUsed(true);
    });
  }, [prompt, getClientId]);

  const copyMessage = async () => {
    navigator.clipboard.writeText(generated);

    toast.success('Prompt copied to clipboard.', {
      position: 'top-center',
      style: {
        color: 'oklch(62.3% 0.214 259.815)',
      },
    });

    if (useLoading || used) return;
    setUseLoading(true);
    
    try {
      const clientId = await getClientId();
      const collectionName = (lang === 'th') ? 'prompts-th' : 'prompts';
      const ref = doc(db, collectionName, id);
      
      const s = await getDoc(ref);
      if (!s.exists()) return;
      const data = s.data();
      const already = (data.usedBy || []).includes(clientId);
      
      if (!already) {
        await updateDoc(ref, {
          usedBy: arrayUnion(clientId),
          'metrics.uses': increment(1),
        });

        setPrompt((p) => ({
          ...p,
          usedBy: [...(p.usedBy || []), clientId],
          metrics: { ...(p.metrics || {}), uses: (p.metrics?.uses || 0) + 1 },
        }));
      }
      setUsed(true);
    } catch (e) {
      console.error('Use registration error', e);
    } finally {
      setUseLoading(false);
    }
  };

  const handleLike = async () => {
    if (liked || likeLoading) return;
    setLikeLoading(true);
    try {
      const clientId = await getClientId();
      const collectionName = (lang === 'th') ? 'prompts-th' : 'prompts';
      const ref = doc(db, collectionName, id);
      
      await updateDoc(ref, {
        likedBy: arrayUnion(clientId),
        'metrics.likes': increment(1),
      });

      setPrompt((p) => ({
        ...p,
        likedBy: [...(p.likedBy || []), clientId],
        metrics: { ...(p.metrics || {}), likes: (p.metrics?.likes || 0) + 1 },
      }));
      setLiked(true);
    } catch (e) {
      console.error('Like error', e);
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <section className="bg-black text-white p-6 rounded-xl shadow-lg">
      <div className="flex items-start justify-between mb-3">
        <Heading level="3" className="text-blue-500">Preview</Heading>
        <div className="flex items-center gap-2">
          <Button
            onClick={copyMessage}
            className=" bg-transparent hover:bg-gray-800 border border-blue-500 text-blue-500 font-semibold px-3 py-1 rounded-full hover:border-blue-600 flex items-center gap-1"
          >
            <Copy className="text-blue-500" />
            Copy
          </Button>
          <Button
            onClick={handleLike}
            disabled={liked || likeLoading}
            className={`px-3 py-1 rounded-full flex items-center gap-1 ${liked ? 'bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            <Heart className="text-white" />
            {prompt.metrics?.likes ?? 0}
          </Button>
        </div>
      </div>
      <textarea
        readOnly
        value={generated}
        className="w-full min-h-35 resize-y bg-transparent border border-gray-700 text-blue-400 focus:outline-none rounded-xl p-4 mt-2"
      />
    </section>
  );
}