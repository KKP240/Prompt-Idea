import { RouterProvider } from 'react-router';
import { router } from './router/routes';
import { LanguageProvider } from '@/lib/LanguageProvider';

function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  );
}

export default App;
