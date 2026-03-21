import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import PromptCard from "../components/PromptCard";

export default function Home() {
  const [prompts, setPrompts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrompts = async () => {
      const snapshot = await getDocs(collection(db, "prompts"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPrompts(data);
    };

    fetchPrompts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-extrabold mb-6">🔥 Popular Prompts</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {prompts.map(p => (
          <PromptCard key={p.id} prompt={p} onClick={() => navigate(`/prompt/${p.id}`)} />
        ))}
      </div>
    </div>
  );
}