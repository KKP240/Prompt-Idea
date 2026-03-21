export default function Footer() {
  return (
    <footer className="w-full border-t bg-white py-6 mt-12">
      <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-500">
        <div className="mb-2">PromptCraft — Professional prompt library</div>
        <div>© {new Date().getFullYear()} PromptCraft · Built with ❤️</div>
      </div>
    </footer>
  );
}
