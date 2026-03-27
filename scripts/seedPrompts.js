import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  writeBatch,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDZvT7Pm6xRVJOBfssJlgLAxunQIVrvG_g",
  authDomain: "prompt-idea-ffa97.firebaseapp.com",
  projectId: "prompt-idea-ffa97",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const makeSlug = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

import prompts from "./seedPrompts2.json" with { type: "json" };

const run = async () => {
  const batch = writeBatch(db);

  prompts.forEach((item) => {
    const ref = doc(collection(db, "prompts"));

    batch.set(ref, {
      title: item.title,
      slug: item.slug || makeSlug(item.title),
      description: item.description,
      template: item.template,
      variables: item.variables,
      category: item.category,
      tags: item.tags,
      author: { id: "seed", name: "Seed Script" },
      examples: item.examples,
      model: "gpt-4",
      language: item.language || "en",
      visibility: "public",
      status: "published",
      metrics: { likes: 0, uses: 0, rating: 0 },
      likedBy: [],
      usedBy: [],
      featured: Boolean(item.featured),
      version: "1.0",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      meta: { source: "seed-script", license: "CC0" },
    });
  });

  await batch.commit();
  console.log("✅ Seed success:", prompts.length);
};

run();