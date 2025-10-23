import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-20 w-full rounded-md px-3 py-2 text-base shadow-sm transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        // Placeholder styling - more discreet and italic
        "placeholder:text-gray-400 placeholder:opacity-60 placeholder:italic dark:placeholder:text-gray-500",
        // Border and background
        "border-2 border-gray-300 dark:border-gray-600",
        "bg-white dark:bg-gray-800/50",
        // Focus state
        "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
        // Invalid state
        "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
