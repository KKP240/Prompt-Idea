import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useActionState, useState } from "react";
import { useNavigate } from "react-router";
import { useLanguage } from '@/lib/LanguageProvider';

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import Heading from "@/components/typography/Heading";
import ErrorMessage from "@/components/common/ErrorMessage";
import PromptBasicFieldSet from "@/components/prompt/PromptBasicFieldSet";
import PromptVariablesFieldSet from "@/components/prompt/PromptVariablesFieldSet";
import PromptMetaDataFieldSet from "@/components/prompt/PromptMetaDataFieldSet";
import PromptSettingFieldSet from "@/components/prompt/PromptSettingFieldSet";

export default function AddPrompt() {
  const [variables, setVariables] = useState([
    { name: "length", type: "string", placeholder: "short|medium|long", required: true },
  ]);

  const navigate = useNavigate();
  const { lang } = useLanguage();

  // Form Data
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    template: '',
    examples: '',
    category: '',
    tags: '',
    model: 'gpt-4',
    language: 'en',
    featured: false,
    version: '1.0',
    authorId: '',
    authorName: '',
    metaSource: '',
    metaLicense: '',
  })

  const handleInputChange = function(e){
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCheckedChange = function(name, value){
    setFormData({ ...formData, [name]: value })
  }

  // Operation: Variable Row
  const addVariableRow = () => {
    setVariables((v) => [...v, { name: "", type: "string", placeholder: "", required: false }]);
  };

  const updateVariable = (idx, key, value) => {
    setVariables((v) => v.map((item, i) => (i === idx ? { ...item, [key]: value } : item)));
  };

  const removeVariable = (idx) => {
    setVariables((v) => v.filter((_, i) => i !== idx));
  };

  // Add Prompt
  const handleSubmit = async function(prevState, nativeFormData) {
    // Validation
    const errors = {};

    // Basic Field
    if (!formData.title.trim()) errors.title = "Title is required.";
    if (!formData.description.trim()) errors.description = "Description is required.";
    if (!formData.template.trim()) errors.template = "Template is required.";

    // Classification Field
    if (!formData.category.trim()) errors.category = "Category is required.";
    if (!formData.model.trim()) errors.model = "Model is required.";
    if (!formData.language.trim()) errors.language = "Language is required.";

    // Variables Field
    const hasInvalidVariable = variables.some(v => !v.name.trim() || !v.type.trim());
    if (hasInvalidVariable) {
      errors.variables = "All variables must have both Name and Type.";
    }

    // Return Error
    if (Object.keys(errors).length > 0) {
      return { 
        success: false, 
        error: "Please fill in all required fields correctly.", 
        fieldErrors: errors 
      };
    }

    // Save in DB
    try {
      const collectionName = (lang === 'th') ? 'prompts-th' : 'prompts'
      
      await addDoc(collection(db, collectionName), {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        description: formData.description,
        template: formData.template,
        variables,
        category: formData.category,
        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        author: { id: formData.authorId || "user_anon", name: formData.authorName || "Anonymous" },
        examples: formData.examples ? formData.examples.split("\n").map((e) => e.trim()).filter(Boolean) : [],
        model: formData.model,
        language: formData.language,
        visibility: 'public',
        status: 'published',
        metrics: { likes: 0, uses: 0, rating: 0 },
        likedBy: [],
        usedBy: [],
        featured: formData.featured,
        version: formData.version,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        meta: { source: formData.metaSource || "internal", license: formData.metaLicense || null },
      });

      navigate("/");
      return { success: true, error: null };
    } catch (error) {
      console.error("Error adding document:", error);
      return { success: false, error: `${error.message}. Please try again.` };
    }
  };

  const [formState, formAction, isPending] = useActionState(handleSubmit, { success: true, error: null, fieldErrors: {} });

  return (
    <div className="py-14 px-6">
      <Heading className="mb-10">Add Prompt</Heading>
      <form action={formAction} className="flex flex-col gap-10">
        {/* Basic Information */}
        <PromptBasicFieldSet formData={formData} handleInputChange={handleInputChange} errors={formState?.fieldErrors} />
        <Separator />

        {/* Variables */}
        <PromptVariablesFieldSet variables={variables} addVariableRow={addVariableRow} updateVariable={updateVariable} removeVariable={removeVariable} errors={formState?.fieldErrors} />
        <Separator />

        {/* Classification & Metadata */}
        <PromptMetaDataFieldSet formData={formData} handleInputChange={handleInputChange} errors={formState?.fieldErrors} />
        <Separator />

        {/* Settings */}
        <PromptSettingFieldSet featured={formData.featured} handleCheckedChange={handleCheckedChange} />

        {/* Error Occured */}
        {formState?.error && (
          <ErrorMessage message={formState?.error} />
        )}

        {/* Actions */}
        <div className="flex gap-4 items-center pt-6 self-start">
          <Button type="submit" className="flex-1 flex items-center gap-1" disabled={isPending}>
            {isPending && (
              <>
                <Spinner />
                Saving...
              </>
            )}
            {!isPending && 'Save Prompt'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isPending}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
