import { db } from '../firebase/config';
import { doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function PromptDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState(null);
  const [values, setValues] = useState({});
  const [generated, setGenerated] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  // get a client identifier: prefer IP, else use stored client id
  const getClientId = async () => {
    try {
      const stored = localStorage.getItem('clientId');
      if (stored) return stored;
      // try to resolve public IP
      const res = await fetch('https://api.ipify.org?format=json');
      if (res.ok) {
        const data = await res.json();
        if (data?.ip) {
          localStorage.setItem('clientId', data.ip);
          return data.ip;
        }
      }
    } catch (e) {
      // ignore
    }
    // fallback: generate short id
    const id = 'anon_' + Math.random().toString(36).slice(2, 10);
    localStorage.setItem('clientId', id);
    return id;
  };

  useEffect(() => {
    const fetchPrompt = async () => {
      const ref = doc(db, 'prompts', id);
      const snap = await getDoc(ref);
      if (snap.exists()) setPrompt({ id: snap.id, ...snap.data() });
    };

    const init = async () => {
      await fetchPrompt();
      const clientId = await getClientId();
      // check if already liked
      try {
        const ref = doc(db, 'prompts', id);
        const s = await getDoc(ref);
        if (s.exists()) {
          const data = s.data();
          const likedArr = data.likedBy || [];
          if (likedArr.includes(clientId)) setLiked(true);
        }
      } catch (e) {
        // ignore
      }
    };

    init();
  }, [id]);

  const generate = () => {
    if (!prompt) return '';
    let text = prompt.template || '';

    const vars = prompt.variables || [];

    vars.forEach((varObj) => {
      const key = varObj?.name || '';
      const val = values[key] ?? `{${key}}`;
      text = text.replace(new RegExp(`\\{${key}\\}`, 'g'), val);
    });

    return text;
  };

  // keep a generated state that updates whenever inputs change
  useEffect(() => {
    setGenerated(generate());
  }, [values, prompt]);

  if (!prompt) return <p className="text-center py-20">Loading...</p>;

  const copyMessage = function () {
    navigator.clipboard.writeText(generated);

    toast.success('Prompt copied to clipboard.', {
      position: 'top-center',
      style: {
        color: 'oklch(62.3% 0.214 259.815)',
      },
    });
  };

  const handleLike = async () => {
    if (liked || likeLoading) return;
    setLikeLoading(true);
    try {
      const clientId = await getClientId();
      const ref = doc(db, 'prompts', id);
      await updateDoc(ref, {
        likedBy: arrayUnion(clientId),
        'metrics.likes': increment(1),
      });

      // update local prompt state
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

  const formatDate = (ts) => {
    try {
      return ts?.toDate ? ts.toDate().toLocaleString() : String(ts || '');
    } catch {
      return String(ts || '');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-gray-500"
      >
        ⬅ Back
      </button>

      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">{prompt.title}</h1>
        <p className="text-sm text-gray-500 mt-1">{prompt.description || prompt.category}</p>
        <div className="mt-2 text-xs text-gray-400">By {prompt.author?.name || 'Unknown'} • {prompt.category} • {prompt.model} • {prompt.language}</div>
      </header>

      <section className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Customize</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {(prompt.variables || []).map((varObj) => {
            const name = varObj?.name || '';
            const placeholder = varObj?.placeholder || name;
            const type = varObj?.type || 'string';
            return (
              <label key={name} className="block">
                <span className="text-sm text-gray-600 mb-1 block">{name}{varObj?.required ? ' *' : ''}</span>
                {type === 'string' && (
                  <input
                    placeholder={placeholder}
                    value={values[name] || ''}
                    onChange={(e) => setValues((prev) => ({ ...prev, [name]: e.target.value }))}
                    className="w-full border-gray-200 border bg-gray-50 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                )}
                {type === 'number' && (
                  <input
                    type="number"
                    placeholder={placeholder}
                    value={values[name] || ''}
                    onChange={(e) => setValues((prev) => ({ ...prev, [name]: e.target.value }))}
                    className="w-full border-gray-200 border bg-gray-50 px-3 py-2 rounded-md"
                  />
                )}
              </label>
            );
          })}
        </div>
      </section>

      <section className="bg-gray-900 text-gray-100 p-6 rounded-2xl shadow-md mb-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-mono text-sm text-green-300">Preview</h3>
          <div className="space-x-2">
            <button
              onClick={copyMessage}
              className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm"
            >
              📋 Copy
            </button>
            <button
              onClick={handleLike}
              disabled={liked || likeLoading}
              className={`px-3 py-1 rounded text-sm ${liked ? 'bg-gray-600 text-white' : 'bg-rose-500 text-white hover:bg-rose-600'}`}
            >
              ❤️ {prompt.metrics?.likes ?? 0}
            </button>
          </div>
        </div>

        <textarea
          readOnly
          value={generated}
          className="w-full min-h-[140px] resize-y bg-transparent font-mono text-sm text-green-200 focus:outline-none"
        />
      </section>

      <section className="bg-white p-4 rounded-2xl shadow-md mb-4 text-sm text-gray-600">
        <div className="mb-2"><strong>Tags:</strong> {(prompt.tags || []).join(', ')}</div>
        <div className="mb-2"><strong>Examples:</strong> {(prompt.examples || []).map((e, i) => <div key={i} className="text-xs text-gray-500">- {e}</div>)}</div>
        <div className="mb-2"><strong>Metrics:</strong> likes {prompt.metrics?.likes ?? 0} • uses {prompt.metrics?.uses ?? 0} • rating {prompt.metrics?.rating ?? 0}</div>
        <div className="mb-2"><strong>Created:</strong> {formatDate(prompt.createdAt)}</div>
        <div className="mb-2"><strong>Updated:</strong> {formatDate(prompt.updatedAt)}</div>
        <div className="mb-2"><strong>Meta:</strong> source {prompt.meta?.source || '-'} • license {prompt.meta?.license || '-'}</div>
      </section>

      <footer className="text-sm text-gray-500 mt-2">Rendered prompt updates as you type.</footer>
    </div>
  );
}
