import { useState } from "react"
import type { TextItem } from "~hooks/use-text-storage"
import { useTextStorage } from "~hooks/use-text-storage"
import { TextInput } from "~components/text-input"
import { TextList } from "~components/text-list"

export function SidePanel() {
  const { items, loaded, saveText, updateText, deleteText } = useTextStorage()
  const [editingItem, setEditingItem] = useState<TextItem | null>(null)
  const [inputValue, setInputValue] = useState("")

  const handleSave = async () => {
    if (!inputValue.trim()) return

    if (editingItem) {
      await updateText(editingItem.id, inputValue)
    } else {
      await saveText(inputValue)
    }

    setInputValue("")
    setEditingItem(null)
  }

  const handleEdit = (item: TextItem) => {
    setEditingItem(item)
    setInputValue(item.content)
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
    setInputValue("")
  }

  if (!loaded) return null

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <TextInput
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSave}
        isEditing={editingItem !== null}
        onCancelEdit={handleCancelEdit}
      />
      <div className="flex-1 overflow-y-auto">
        <TextList
          items={items}
          onEdit={handleEdit}
          onDelete={deleteText}
        />
      </div>
    </div>
  )
}
