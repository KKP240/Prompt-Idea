import { useNavigate } from "react-router";

export default function Category() {
  const navigate = useNavigate();

  const placeholder = [
    { name: "Marketing" },
    { name: "Writing" },
    { name: "Code" },
    { name: "Design" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {placeholder.map(c => (
          <button
            key={c.name}
            onClick={() => navigate(`/?category=${c.name}`)}
            className="bg-white border rounded-lg p-4 text-sm text-gray-700 hover:shadow"
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
