import { db } from '@/firebase/config';
import { doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore'; 
import { toast } from 'sonner';
import { useState, useEffect, useCallback } from 'react';

import Heading from '../typography/Heading';
import { Button } from '../ui/button';
import { Copy, Heart } from 'lucide-react';
import { useMutation } from '@/hooks/useMutation';

export default function PromptPreview({ prompt, setPrompt, generated, lang, id, getClientId }) {
  const [liked, setLiked] = useState(false);
  const [used, setUsed] = useState(false);

  // Check Status Like and Copy
  useEffect(() => {
    if (!prompt) return;

    getClientId().then((clientId) => {
      if (prompt.likedBy?.includes(clientId)) setLiked(true);
      if (prompt.usedBy?.includes(clientId)) setUsed(true);
    });
  }, [prompt, getClientId]);

  // Operation: Copy Message
  const copyLogic = useCallback(async function(){
    if (used) return;

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
  }, [used, getClientId, lang, id, setPrompt])

  const { execute: executeCopy, isLoading: copyLoading } = useMutation(copyLogic);

  const copyMessage = async () => {
    navigator.clipboard.writeText(generated);

    toast.success('Prompt copied to clipboard.', {
      position: 'top-center',
      style: {
        color: 'oklch(62.3% 0.214 259.815)',
      },
    });

    executeCopy()
  };

  // Operation: Like Prompt
  const likeLogic = useCallback(async function(){
    if(liked) return

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
  }, [liked, getClientId, lang, id, setPrompt])

  const { execute: handleLike, isLoading: likeLoading } = useMutation(likeLogic);

  return (
    <section className="bg-black text-white p-6 rounded-xl shadow-lg">
      <div className="flex items-start justify-between mb-3">
        <Heading level="3" className="text-blue-500">Preview</Heading>
        <div className="flex items-center gap-2">
          <Button
            onClick={copyMessage}
            disabled={copyLoading}
            className=" bg-transparent hover:bg-gray-800 border border-blue-500 text-blue-500 font-semibold px-3 py-1 rounded-full hover:border-blue-600 flex items-center gap-1"
          >
            <Copy className="text-blue-500" />
            {copyLoading ? 'Copy...' : 'Copy'}
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
