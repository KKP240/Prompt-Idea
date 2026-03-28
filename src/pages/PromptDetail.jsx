import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { getClientId } from '@/lib/utils';
import { useLanguage } from '@/lib/LanguageProvider';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@/hooks/useQuery';

import Loading from '@/components/common/Loading';
import BasicBreadcrumb from '@/components/common/BasicBreadcrumb';
import Heading from '@/components/typography/Heading';
import Paragraph from '@/components/typography/Paragraph';
import PromptCustomize from '@/components/prompt/PromptCustomize';
import PromptPreview from '@/components/prompt/PromptPreview';
import PromptGeneralInfo from '@/components/prompt/PromptGeneralInfo';
import ErrorMessage from '@/components/common/ErrorMessage';

export default function PromptDetail() {
  const { id } = useParams();
  const { lang } = useLanguage();

  const [values, setValues] = useState({});
  const [generated, setGenerated] = useState('');

  // Fetch Prompts
  const fetchPrompt = useCallback(async function() {
    const collectionName = lang === 'th' ? 'prompts-th' : 'prompts';
    const ref = doc(db, collectionName, id);
    const snap = await getDoc(ref);

    if (snap.exists()) return { id: snap.id, ...snap.data() }

    throw new Error('ไม่พบข้อมูล Prompt นี้')
  }, [lang, id]);

  const { data: prompt, setData: setPrompt, isLoading, error, execute } = useQuery(fetchPrompt)

  useEffect(() => {
    execute()
  }, [execute])

  // Generate Text
  const generate = function() {
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

  // Regenerate when dependency array change (values, prompt)
  useEffect(() => {
    setGenerated(generate());
  }, [values, prompt]);

  return (
    <div className="px-6 py-14">
      {/* Loading */}
      {isLoading && <Loading />}

      {/* Error Occurred */}
      {!isLoading && !error.success && <ErrorMessage message={error.message} />}

      {!isLoading && error.success && prompt && (
        <>
          {/* Breadcrumb */}
          <BasicBreadcrumb
            className='mb-6'
            linkItems={[
              { path: '/', label: 'Home' },
              { path: '', label: prompt.title },
            ]}
          />

          {/* Header */}
          <div className="mb-10 flex flex-col gap-2">
            <Heading>{prompt.title}</Heading>
            <Paragraph>
              {prompt.description || prompt.category}
            </Paragraph>
            <Paragraph className="text-black">
              By {prompt.author?.name || 'Unknown'} • {prompt.category} •{' '}
              {prompt.model} • {prompt.language}
            </Paragraph>
          </div>

          <div className="flex flex-col gap-8">
            {/* Customize */}
            <PromptCustomize
              prompt={prompt} 
              values={values} 
              setValues={setValues} 
            />

            {/* Preview */}
            <PromptPreview
              generated={generated}
              prompt={prompt}
              setPrompt={setPrompt}
              lang={lang}
              id={id}
              getClientId={getClientId}
            />

            {/* General Info */}
            <PromptGeneralInfo prompts={prompt} />
          </div>

          {/* Additional Info */}
          <Paragraph className="mt-4">Rendered prompt updates as you type.</Paragraph>
        </>
      )}
    </div>
  );
}
