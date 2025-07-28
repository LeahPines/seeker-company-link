import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxOption {
  value: string
  label: string
}

interface BasicComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  emptyMessage?: string
  className?: string
  disabled?: boolean
}

/**
 * A simplified combobox that doesn't use cmdk to avoid "undefined is not iterable" errors
 */
export function BasicCombobox({
  options = [],
  value = "",
  onValueChange,
  placeholder = "Select an option",
  emptyMessage = "No results found.",
  className,
  disabled = false,
}: BasicComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  
  const safeOptions = React.useMemo(() => {
    return Array.isArray(options) ? options : []
  }, [options])
  
  const selectedOption = React.useMemo(() => {
    return safeOptions.find(option => option && option.value === value)
  }, [safeOptions, value])

  const filteredOptions = React.useMemo(() => {
    if (!safeOptions.length) return []
    if (!searchTerm) return safeOptions
    
    return safeOptions.filter(option => {
      return option && option.label && 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    })
  }, [safeOptions, searchTerm])
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-full justify-between bg-gray-300 border-gray-500 text-gray-900 hover:bg-gray-200", className)}
        >
          <span className={cn("text-left", !selectedOption && "text-gray-600")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <div className="flex flex-col">
          <div className="flex items-center border-b px-3">
            <input
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            {filteredOptions.length > 0 ? (
              <div className="overflow-hidden p-1">
                {filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                      value === option.value && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => {
                      onValueChange(option.value === value ? "" : option.value)
                      setSearchTerm("")
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-sm">{emptyMessage}</div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
