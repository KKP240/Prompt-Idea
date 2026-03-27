import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

import { db } from "@/firebase/config"
import { collection, getDocs, query } from "firebase/firestore"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from 'react-router'
import { useLanguage } from '@/lib/LanguageProvider'

export function SearchPrompt() {
  // Command State
  const [open, setOpen] = useState(false)
  const [queryText, setQueryText] = useState("")
  const [prompts, setPrompts] = useState([])

  const initCommandResult = [
    { path: '/', label: 'Popular Prompts' },
    { path: '/add', label: 'Create New Prompt' },
    { path: `${prompts.length > 0 ? `/prompt/${prompts[Math.floor(Math.random() * prompts.length)].id}`: ''}`, label: 'Try a Random Prompt' },
    { path: '/', label: 'Browse Categories' }
  ]

  const navigate = useNavigate()
  const { lang } = useLanguage()

  // Prompt Languages
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const collectionName = (lang === 'th') ? 'prompts-th' : 'prompts'
        const q = query(collection(db, collectionName))
        const snapshot = await getDocs(q)
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setPrompts(data)
      } catch (err) {
        console.error('Failed to fetch prompts for search', err)
      }
    }

    fetchPrompts()
  }, [lang])
  
  //  Computed Result
  const results = useMemo(() => {
    const q = queryText.trim().toLowerCase()
    if (!q) return []
    return prompts.filter((p) => {
      try {
        const hay = JSON.stringify(p).toLowerCase()
        return hay.includes(q)
      } catch (e) {
        return false
      }
    })
  }, [prompts, queryText])

  // Select Command Item
  const handleSelectCommandItem = function(path){
    navigate(path)

    setQueryText('');
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <Button 
        onClick={() => setOpen(true)} 
        size="icon-lg"
        className="bg-transparent border border-white transition-all duration-300 hover:border-gray-300 hover:bg-blue-500 rounded-full shadow-xl"
        aria-label='ค้นหา Prompt ต่างๆ'
      >
        <Search className="text-white size-5" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search prompts by title, description, category, tags..."
            value={queryText}
            onValueChange={(v) => setQueryText(v)}
          />
          <CommandList>
            <CommandEmpty className='text-gray-500'>No results found.</CommandEmpty>

            {/* Found Result */}
            {queryText.trim() !== "" && results.length > 0 && (
              <CommandGroup heading={`Results`}>
                {results.slice(0, 10).map((p) => (
                  <CommandItem
                    key={p.id}
                    onSelect={() => handleSelectCommandItem(`/prompt/${p.id}`)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{p.title || 'Untitled'}</span>
                      {p.description && (
                        <span className="text-xs text-muted-foreground line-clamp-2">{p.description}</span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Initial Result */}
            {queryText.trim() === "" && (
              <CommandGroup heading="Quick Actions">
                {initCommandResult.length > 0 && initCommandResult.map(result => (
                  <CommandItem
                    key={result.label}
                    onSelect={() => handleSelectCommandItem(result.path)}
                  >
                    {result.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}
