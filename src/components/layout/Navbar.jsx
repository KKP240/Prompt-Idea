import { CirclePlus, House, Search } from 'lucide-react';
import { Link } from 'react-router';
import { SearchPrompt } from './SearchPrompt';
import { useLanguage } from '@/lib/LanguageProvider';

export default function Navbar() {
  const { lang, setLang } = useLanguage();

  return (
    <header className="w-full border-b border-gray-300 shadow-sm">
      <nav className="max-w-275 mx-auto flex justify-between items-center p-6">
        {/* Logo */}
        <h1 className="text-2xl font-semibold text-blue-500">
          <Link to="/">PromptCraft</Link>
        </h1>

        {/* Action Link and Button */}
        <div className="flex gap-2.5 items-center">
          <Link
            to="/"
            className="flex items-center justify-center border border-gray-300 transition-all duration-300 hover:border-blue-500 rounded-full p-2 shadow-lg"
            aria-label="ไปยังหน้าแรก"
          >
            <House className="text-blue-500" />
          </Link>

          {/* Language Toggle */}
          <div className="flex items-center gap-2 px-2">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-full text-sm transition ${lang === 'en' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
              aria-label="Switch to English"
            >
              EN
            </button>
            <button
              onClick={() => setLang('th')}
              className={`px-3 py-1 rounded-full text-sm transition ${lang === 'th' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
              aria-label="Switch to Thai"
            >
              TH
            </button>
          </div>

          <SearchPrompt />
          <Link
            to="/add"
            className="bg-blue-500 text-white shadow-lg px-4 py-2 rounded-full flex items-center gap-2 font-semibold transition-all duration-300 hover:bg-blue-600"
            aria-label="ไปยังหน้าเพิ่มคำสั่ง prompt"
          >
            <CirclePlus />
            Prompt
          </Link>
        </div>
      </nav>
    </header>
  );
}
