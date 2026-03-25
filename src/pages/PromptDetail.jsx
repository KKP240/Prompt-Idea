import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function PromptDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState(null);
  const [values, setValues] = useState({});
  const [generated, setGenerated] = useState('');

  useEffect(() => {
    const fetchPrompt = async () => {
      const ref = doc(db, 'prompts', id);
      const snap = await getDoc(ref);
      if (snap.exists()) setPrompt(snap.data());
    };

    fetchPrompt();
  }, [id]);

  const normalizeVar = (v) =>
    typeof v === 'string' ? v.replace(/^"+|"+$/g, '').trim() : v;

  const generate = () => {
    if (!prompt) return '';
    let text = prompt.template || '';

    const vars = (prompt.variables || []).map(normalizeVar);

    vars.forEach((v) => {
      const key = v;
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

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-gray-500"
      >
        ⬅ Back
      </button>

      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">
          {prompt.title}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {prompt.description || prompt.category}
        </p>
      </header>

      <section className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Customize</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {(prompt.variables || []).map((raw) => {
            const v = normalizeVar(raw);
            return (
              <label key={v} className="block">
                <span className="text-sm text-gray-600 mb-1 block">{v}</span>
                <input
                  placeholder={v}
                  value={values[v] || ''}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [v]: e.target.value }))
                  }
                  className="w-full border-gray-200 border bg-gray-50 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
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
          </div>
        </div>

        <textarea
          readOnly
          value={generated}
          className="w-full min-h-[140px] resize-y bg-transparent font-mono text-sm text-green-200 focus:outline-none"
        />
      </section>

      <footer className="text-sm text-gray-500 mt-2">
        Rendered prompt updates as you type.
      </footer>
    </div>
  );
}
