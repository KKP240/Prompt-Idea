"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Search } from "lucide-react"
import { db } from "@/firebase/config"
import { collection, getDocs, query } from "firebase/firestore"
import { useNavigate } from 'react-router'

export function SearchPrompt() {
  const [open, setOpen] = React.useState(false)
  const [prompts, setPrompts] = React.useState([])
  const [queryText, setQueryText] = React.useState("")
  const navigate = useNavigate()

  React.useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const q = query(collection(db, 'prompts'))
        const snapshot = await getDocs(q)
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setPrompts(data)
      } catch (err) {
        console.error('Failed to fetch prompts for search', err)
      }
    }

    fetchPrompts()
  }, [])

  const results = React.useMemo(() => {
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

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={() => setOpen(true)} variant="outline" className="flex items-center justify-center border border-gray-300 transition-all duration-300 hover:border-blue-500 rounded-full p-2 shadow-lg" >
        <Search className="text-blue-500 size-5" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput
            placeholder="Search prompts by title, description, category, tags..."
            value={queryText}
            onValueChange={(v) => setQueryText(v)}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            {queryText.trim() !== "" && (
              <CommandGroup heading="Results">
                {results.slice(0, 10).map((p) => (
                  <CommandItem
                    key={p.id}
                    onSelect={() => {
                      setOpen(false)
                      navigate(`/prompt/${p.id}`)
                    }}
                    onClick={() => {
                      setOpen(false)
                      navigate(`/prompt/${p.id}`)
                    }}
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

            {queryText.trim() === "" && (
              <CommandGroup heading="Quick Actions">
                <CommandItem
                  onSelect={() => {
                    setOpen(false)
                    navigate('/')
                  }}
                >
                  Popular Prompts
                </CommandItem>

                <CommandItem
                  onSelect={() => {
                    setOpen(false)
                    navigate('/add')
                  }}
                >
                  Create New Prompt
                </CommandItem>

                <CommandItem
                  onSelect={() => {
                    setOpen(false)
                    if (prompts && prompts.length > 0) {
                      const r = prompts[Math.floor(Math.random() * prompts.length)]
                      navigate(`/prompt/${r.id}`)
                    }
                  }}
                >
                  Try a Random Prompt
                </CommandItem>

                <CommandItem
                  onSelect={() => {
                    setOpen(false)
                    navigate('/')
                  }}
                >
                  Browse Categories
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}

