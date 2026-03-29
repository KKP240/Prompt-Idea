import { isRouteErrorResponse, useRouteError } from "react-router";

import Heading from "../typography/Heading";
import Paragraph from "../typography/Paragraph";

function ErrorComponent({ error }) {
  const errorTitle = isRouteErrorResponse(error) ? `${error.status}: ${error.statusText}` : 'Unknown';
  const errorMessage = isRouteErrorResponse(error) ? error.data : 'Something went wrong. Please try again later.';

  return (
    <div className="p-8 flex flex-col gap-2 bg-danger-light rounded-[10px] m-4">
      {/* Error Title */}
      <Heading>Error {errorTitle}</Heading>

      {/* Error Message */}
      <Paragraph>{errorMessage}</Paragraph>

      {/* --- Error Stack Trace --- */}
      {error instanceof Error && (
        <div className="mt-2 pt-6 border-t border-gray-light overflow-x-auto">
          <Heading level='2'>The stack trace is:</Heading>
          <pre>{error.stack}</pre>
        </div>
      )}
    </div>
  );
}

export default function RootErrorBoundary() {
  const error = useRouteError();

  return <ErrorComponent error={error} />;
}
