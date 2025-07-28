import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  emptyMessage?: string
  className?: string
  disabled?: boolean
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  emptyMessage = "No results found.",
  className,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  
  const safeOptions = React.useMemo(() => {
    return Array.isArray(options) 
      ? options.filter(opt => opt && typeof opt === 'object' && 'value' in opt && 'label' in opt) 
      : [];
  }, [options]);
  
  const safeValue = typeof value === 'string' ? value : '';
  
  const selectedOption = React.useMemo(() => {
    return safeOptions.find(option => option.value === safeValue);
  }, [safeOptions, safeValue]);

  const [inputValue, setInputValue] = React.useState("")
  
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    
    if (!isOpen) {
      setInputValue("")
    }
  }
  
  const handleValueChange = (newValue: string) => {
    if (typeof onValueChange === 'function') {
      onValueChange(newValue === safeValue ? "" : newValue)
    }
  }
  
  const filteredOptions = React.useMemo(() => {
    if (!safeOptions.length) return [];
    
    try {
      return safeOptions.filter(option => {
        if (!option || !option.label) return false;
        return option.label.toLowerCase().includes((inputValue || '').toLowerCase());
      });
    } catch (err) {
      return safeOptions;
    }
  }, [safeOptions, inputValue]);
  
  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-full justify-between", className)}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    handleValueChange(option.value)
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
                  </CommandItem>
                ))
            ) : (
              <CommandItem disabled>{emptyMessage}</CommandItem>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
