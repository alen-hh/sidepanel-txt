import { useCallback, useEffect, useRef, useState } from "react"

export interface TextItem {
  id: string
  content: string
  createdAt: number
  updatedAt: number
}

const STORAGE_KEY = "text-items"

export function useTextStorage() {
  const [items, setItems] = useState<TextItem[]>([])
  const [loaded, setLoaded] = useState(false)
  const itemsRef = useRef<TextItem[]>([])

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  useEffect(() => {
    chrome.storage.sync.get(STORAGE_KEY, (result) => {
      if (result[STORAGE_KEY]) {
        const stored: TextItem[] = result[STORAGE_KEY]
        setItems(stored)
        itemsRef.current = stored
      }
      setLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (!loaded) return

    const isInternalChange = { current: false }

    const listener = (
      changes: { [key: string]: chrome.storage.StorageChange },
      area: string
    ) => {
      if (area === "sync" && changes[STORAGE_KEY] && !isInternalChange.current) {
        setItems(changes[STORAGE_KEY].newValue ?? [])
      }
    }

    chrome.storage.onChanged.addListener(listener)
    return () => chrome.storage.onChanged.removeListener(listener)
  }, [loaded])

  const saveText = useCallback(async (content: string) => {
    const now = Date.now()
    const newItem: TextItem = {
      id: crypto.randomUUID(),
      content,
      createdAt: now,
      updatedAt: now
    }

    const next = [newItem, ...itemsRef.current]
    itemsRef.current = next
    setItems(next)
    await chrome.storage.sync.set({ [STORAGE_KEY]: next })
  }, [])

  const updateText = useCallback(async (id: string, content: string) => {
    const updated = itemsRef.current.map((item) =>
      item.id === id ? { ...item, content, updatedAt: Date.now() } : item
    )

    itemsRef.current = updated
    setItems(updated)
    await chrome.storage.sync.set({ [STORAGE_KEY]: updated })
  }, [])

  const deleteText = useCallback(async (id: string) => {
    const filtered = itemsRef.current.filter((item) => item.id !== id)

    itemsRef.current = filtered
    setItems(filtered)
    await chrome.storage.sync.set({ [STORAGE_KEY]: filtered })
  }, [])

  return { items, loaded, saveText, updateText, deleteText }
}
