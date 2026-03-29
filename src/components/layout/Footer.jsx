export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-300 py-6 bg-white">
      <div className="max-w-275 mx-auto px-6 text-center text-sm text-gray-500">
        <div className="mb-2 text-blue-500">PromptCraft — Professional prompt library</div>
        <div>© {new Date().getFullYear()} PromptCraft · Built with ❤️</div>
      </div>
    </footer>
  );
}
