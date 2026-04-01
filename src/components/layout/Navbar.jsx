import { Link } from 'react-router';
import { useLanguage } from '@/lib/LanguageProvider';

import { CirclePlus, House } from 'lucide-react';
import { SearchPrompt } from './SearchPrompt';
import Heading from '../typography/Heading';
import { Button } from '../ui/button';

export default function Navbar() {
  const { lang, setLang } = useLanguage();

  return (
    <>
      <header className="w-full">
        <div className="max-w-275 mx-auto w-full flex justify-between items-center px-6 py-4">
          {/* Logo */}
          <Heading level='3' className="text-blue-500">
            <Link to="/">Prompt Idea</Link>
          </Heading>

          {/* Language Toggle */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-full text-sm transition duration-300 ${lang === 'en' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'}`}
              aria-label="Switch to English"
            >
              EN
            </Button>
            <Button
              onClick={() => setLang('th')}
              className={`px-3 py-1 rounded-full text-sm transition ${lang === 'th' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'}`}
              aria-label="Switch to Thai"
            >
              TH
            </Button>
          </div>
        </div>
      </header>
      <div className="bg-blue-500/75 backdrop-blur-[2px] w-full py-4 sticky top-0 left-0 z-5">
        <nav className="max-w-275 mx-auto w-full px-6">
          <div className="flex gap-2.5 justify-between items-center">
            {/* Home Button */}
            <Link
              to="/"
              className="border border-white transition-all duration-300 hover:bg-blue-500 hover:border-gray-300 rounded-full p-2 shadow-xl"
              aria-label="ไปยังหน้าแรก"
            >
              <House className="text-white" />
            </Link>

            {/* Search and Add Prompt */}
            <div className="flex items-center gap-2.5">
              <SearchPrompt />
              <Link
                to="/add"
                className="bg-white text-blue-500 shadow-xl px-4 py-2 rounded-full flex items-center gap-2 font-semibold transition-all duration-300 hover:bg-gray-200"
                aria-label="ไปยังหน้าเพิ่มคำสั่ง prompt"
              >
                <CirclePlus />
                Prompt
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
