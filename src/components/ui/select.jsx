import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger 
    ref={ref} 
    className={cn("border rounded-md p-2 w-full flex items-center justify-between", className)} 
    {...props}
  >
    <SelectPrimitive.Value /> {/* ✅ Fix: Displays the selected value */}
    <SelectPrimitive.Icon>
      <ChevronDownIcon className="size-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));

const SelectContent = ({ className, children, ...props }) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content 
      position="popper" 
      side="top" 
      sideOffset={5} 
      className={cn("bg-white border rounded-md shadow-lg p-2", className)} 
      {...props}
    >
      {children}
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
);

const SelectItem = ({ className, children, ...props }) => (
  <SelectPrimitive.Item 
    className={cn("cursor-pointer p-2 hover:bg-gray-100 rounded-md flex items-center", className)} 
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText> {/* ✅ Fix: Displays text inside the dropdown */}
    <SelectPrimitive.ItemIndicator>
      <CheckIcon className="size-4 ml-2" />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
);

export { Select, SelectTrigger, SelectContent, SelectItem };
