import { createBrowserRouter } from 'react-router';

import Home from '../pages/Home';
import MainLayout from '../components/layout/MainLayout';
import AddPrompt from '../pages/AddPrompt';
import PromptDetail from '../pages/PromptDetail';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MainLayout,
    children: [
      { index: true, Component: Home },
      { path: 'add', Component: AddPrompt },
      { path: 'prompt/:id', Component: PromptDetail },
    ],
  },
]);
