import { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router";

export default function AddPrompt() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [template, setTemplate] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [examples, setExamples] = useState("");
  const [model, setModel] = useState("gpt-4");
  const [language, setLanguage] = useState("en");
  const [visibility, setVisibility] = useState("public");
  const [status, setStatus] = useState("published");
  const [featured, setFeatured] = useState(false);
  const [version, setVersion] = useState("1.0");
  const [authorId, setAuthorId] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [metaSource, setMetaSource] = useState("");
  const [metaLicense, setMetaLicense] = useState("");

  const [variables, setVariables] = useState([
    { name: "length", type: "string", placeholder: "short|medium|long", required: true },
  ]);

  const navigate = useNavigate();

  const addVariableRow = () => {
    setVariables((v) => [...v, { name: "", type: "string", placeholder: "", required: false }]);
  };

  const updateVariable = (idx, key, value) => {
    setVariables((v) => v.map((item, i) => (i === idx ? { ...item, [key]: value } : item)));
  };

  const removeVariable = (idx) => {
    setVariables((v) => v.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    try {
        await addDoc(collection(db, "prompts"), {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        description,
        template,
        variables,
        category,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        author: { id: authorId || "user_anon", name: authorName || "Anonymous" },
        examples: examples.split("\n").map((e) => e.trim()).filter(Boolean),
        model,
        language,
        visibility,
        status,
        metrics: { likes: 0, uses: 0, rating: 0 },
        likedBy: [],
        featured,
        version,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        meta: { source: metaSource || "internal", license: metaLicense || null },
      });

      navigate("/");
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-4">➕ Add Prompt</h1>

        <label className="block mb-3">
          <span className="text-sm text-gray-600">Title</span>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border-gray-200 border px-3 py-2 rounded mt-1" placeholder="Title" />
        </label>

        <label className="block mb-3">
          <span className="text-sm text-gray-600">Slug (optional)</span>
          <input value={slug} onChange={e => setSlug(e.target.value)} className="w-full border-gray-200 border px-3 py-2 rounded mt-1" placeholder="product-description-concise" />
        </label>

        <label className="block mb-3">
          <span className="text-sm text-gray-600">Description</span>
          <input value={description} onChange={e => setDescription(e.target.value)} className="w-full border-gray-200 border px-3 py-2 rounded mt-1" placeholder="Short description" />
        </label>

        <label className="block mb-3">
          <span className="text-sm text-gray-600">Template</span>
          <textarea value={template} onChange={e => setTemplate(e.target.value)} className="w-full border-gray-200 border px-3 py-2 rounded mt-1" placeholder="Write a {length} product description for a {product}..." />
        </label>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Variables</span>
            <button type="button" onClick={addVariableRow} className="text-sm text-indigo-600">+ Add</button>
          </div>

          <div className="space-y-2">
            {variables.map((v, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                <input value={v.name} onChange={e => updateVariable(idx, 'name', e.target.value)} placeholder="name" className="col-span-4 border px-2 py-1 rounded" />
                <input value={v.type} onChange={e => updateVariable(idx, 'type', e.target.value)} placeholder="type" className="col-span-3 border px-2 py-1 rounded" />
                <input value={v.placeholder} onChange={e => updateVariable(idx, 'placeholder', e.target.value)} placeholder="placeholder" className="col-span-4 border px-2 py-1 rounded" />
                <button type="button" onClick={() => removeVariable(idx)} className="col-span-1 text-red-500">✕</button>
                <label className="col-span-12 inline-flex items-center gap-2 text-xs text-gray-500"><input type="checkbox" checked={v.required} onChange={e => updateVariable(idx, 'required', e.target.checked)} /> required</label>
              </div>
            ))}
          </div>
        </div>

        <label className="block mb-3">
          <span className="text-sm text-gray-600">Category</span>
          <input value={category} onChange={e => setCategory(e.target.value)} className="w-full border-gray-200 border px-3 py-2 rounded mt-1" placeholder="marketing" />
        </label>

        <label className="block mb-3">
          <span className="text-sm text-gray-600">Tags (comma separated)</span>
          <input value={tags} onChange={e => setTags(e.target.value)} className="w-full border-gray-200 border px-3 py-2 rounded mt-1" placeholder="product,marketing,ecommerce" />
        </label>

        <label className="block mb-3">
          <span className="text-sm text-gray-600">Examples (one per line)</span>
          <textarea value={examples} onChange={e => setExamples(e.target.value)} className="w-full border-gray-200 border px-3 py-2 rounded mt-1" placeholder="Short: EcoBrush — Clean teeth, kinder planet." />
        </label>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <input value={model} onChange={e => setModel(e.target.value)} placeholder="model" className="border px-2 py-1 rounded" />
          <input value={language} onChange={e => setLanguage(e.target.value)} placeholder="language" className="border px-2 py-1 rounded" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <input value={authorId} onChange={e => setAuthorId(e.target.value)} placeholder="author id" className="border px-2 py-1 rounded" />
          <input value={authorName} onChange={e => setAuthorName(e.target.value)} placeholder="author name" className="border px-2 py-1 rounded" />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <input value={metaSource} onChange={e => setMetaSource(e.target.value)} placeholder="meta source" className="border px-2 py-1 rounded" />
          <input value={metaLicense} onChange={e => setMetaLicense(e.target.value)} placeholder="meta license" className="border px-2 py-1 rounded" />
          <input value={version} onChange={e => setVersion(e.target.value)} placeholder="version" className="border px-2 py-1 rounded" />
        </div>

        <label className="inline-flex items-center gap-2 mb-4">
          <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} />
          <span className="text-sm text-gray-600">Featured</span>
        </label>

        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            Save Prompt
          </button>

          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
}