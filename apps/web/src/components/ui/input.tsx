import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground selection:bg-primary selection:text-primary-foreground h-9 w-full min-w-0 rounded-md px-3 py-1 text-base shadow-sm transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
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

export { Input };
