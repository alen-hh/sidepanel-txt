import type { TextItem } from "~hooks/use-text-storage"
import { TextCard } from "~components/text-card"

interface TextListProps {
  items: TextItem[]
  onEdit: (item: TextItem) => void
  onDelete: (id: string) => void
}

export function TextList({ items, onEdit, onDelete }: TextListProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
        <p className="text-sm">No saved texts yet.</p>
        <p className="mt-1 text-xs">Type something above and click Save.</p>
      </div>
    )
  }

  const sorted = [...items].sort((a, b) => b.updatedAt - a.updatedAt)

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((item) => (
        <TextCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
