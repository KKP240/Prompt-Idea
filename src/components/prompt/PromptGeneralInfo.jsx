import { formattedDateToReadable } from "@/lib/utils";

import Heading from "../typography/Heading";
import Paragraph from "../typography/Paragraph";

export default function PromptGeneralInfo({ prompts }) {
  const { tags, examples, metrics, createdAt, updatedAt, meta } = prompts

  // Computed Prompts Value
  const finalTags = (tags || []).join(', ')
  const finalExamples = examples || []
  const finalMetrics = `likes ${metrics?.likes ?? 0} • uses ${metrics?.uses ?? 0} • rating ${metrics?.rating ?? 0}`
  const finalCreatedAt = formattedDateToReadable(createdAt)
  const finalUpdatedAt = formattedDateToReadable(updatedAt)
  const finalMeta = `source ${meta?.source || '-'} • license ${meta?.license || '-'}`

  return (
    <ul className="flex flex-col gap-6 bg-white p-6 border border-gray-300 rounded-xl shadow-lg">
      <li className="flex flex-col gap-1">
        <Heading level="6">Tags</Heading> 
        <Paragraph className="text-gray-600">{finalTags}</Paragraph>
      </li>
      <li className="flex flex-col gap-1">
        <Heading level="6">Examples</Heading>
        {finalExamples.map((ex, index) => (
          <Paragraph key={index} className="text-gray-600">
            {ex}
          </Paragraph>
        ))}
      </li>
      <li className="flex flex-col gap-1">
        <Heading level="6">Metrics</Heading> 
        <Paragraph className="text-gray-600">{finalMetrics}</Paragraph>
      </li>
      <li className="flex flex-col gap-1">
        <Heading level="6">Created</Heading>
        <Paragraph className="text-gray-600">{finalCreatedAt}</Paragraph>
      </li>
      <li className="flex flex-col gap-1">
        <Heading level="6">Updated</Heading>
        <Paragraph className="text-gray-600">{finalUpdatedAt}</Paragraph>
      </li>
      <li className="flex flex-col gap-1">
        <Heading level="6">Meta</Heading> 
        <Paragraph>{finalMeta}</Paragraph>
      </li>
    </ul>
  );
}
