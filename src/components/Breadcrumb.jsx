export default function Breadcrumb() {
  return (
    <nav aria-label="breadcrumb" class="w-max">
      <ol class="flex w-full flex-wrap items-center rounded-md bg-slate-50 px-4 py-2">
        <li class="flex cursor-pointer items-center text-sm text-slate-500 transition-colors duration-300 hover:text-slate-800">
          <a href="#">Docs</a>
          <span class="pointer-events-none mx-2 text-slate-800">/</span>
        </li>
        <li class="flex cursor-pointer items-center text-sm text-slate-500 transition-colors duration-300 hover:text-slate-800">
          <a href="#">Components</a>
          <span class="pointer-events-none mx-2 text-slate-800">/</span>
        </li>
        <li class="flex cursor-pointer items-center text-sm text-slate-500 transition-colors duration-300 hover:text-slate-800">
          <a href="#">Breadcrumbs</a>
        </li>
      </ol>
    </nav>
  );
}
