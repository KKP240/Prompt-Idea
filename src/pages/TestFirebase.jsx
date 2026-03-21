import { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function TestFirebase() {
  const [data, setData] = useState([]);

  // add data
  const handleAdd = async () => {
    try {
      const docRef = await addDoc(collection(db, "test"), {
        name: "Hello Firebase",
        createdAt: new Date()
      });
      console.log("Document written with ID:", docRef.id);
      alert("Added successfully!");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // fetch data
  const handleFetch = async () => {
    const querySnapshot = await getDocs(collection(db, "test"));
    const result = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setData(result);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-4">🧪 Test Firebase</h1>

        <div className="flex gap-3 mb-4">
          <button onClick={handleAdd} className="bg-indigo-600 text-white px-4 py-2 rounded">➕ Add</button>
          <button onClick={handleFetch} className="bg-gray-100 px-4 py-2 rounded">📥 Fetch</button>
        </div>

        <hr className="my-4" />

        <h3 className="font-semibold mb-2">📊 Data from Firestore</h3>
        <div className="space-y-2">
          {data.map(item => (
            <div key={item.id} className="p-3 bg-gray-50 rounded">
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-gray-400">{item.createdAt?.toDate ? item.createdAt.toDate().toString() : ''}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}