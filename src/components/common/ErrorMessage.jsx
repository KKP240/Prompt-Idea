import { cn } from "@/lib/utils";

import Heading from "../typography/Heading";
import Paragraph from "../typography/Paragraph";

export default function ErrorMessage({ message = 'Something went wrong.', className = '' }) {
  return (
    <div className={cn("p-4 border border-gray-300 rounded-lg shadow-xl", className)}>
      <Heading level="3" className="text-red-700">Error Occured</Heading>
      <Paragraph className="text-red-600 mt-2">{message}</Paragraph>
    </div>
  );
}
