import { Button } from "@/components/ui/button"

interface TextInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isEditing: boolean
  onCancelEdit?: () => void
}

export function TextInput({
  value,
  onChange,
  onSubmit,
  isEditing,
  onCancelEdit
}: TextInputProps) {
  const handleSubmit = () => {
    if (!value.trim()) return
    onSubmit()
  }

  return (
    <div className="flex flex-col gap-2">
      <textarea
        className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        rows={8}
        placeholder="Type something here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="flex gap-2">
        <Button
          className="flex-1"
          onClick={handleSubmit}
          disabled={!value.trim()}
        >
          {isEditing ? "Update" : "Save"}
        </Button>
        {isEditing && onCancelEdit && (
          <Button variant="outline" onClick={onCancelEdit}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  )
}
