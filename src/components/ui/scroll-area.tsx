import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    className={cn("relative overflow-hidden", className)}
    {...props}
    ref={ref}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollAreaPrimitive.Scrollbar
      className="flex select-none flex-col p-[1px] transition-colors group-hover:bg-border/30 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:h-2.5"
      orientation="vertical"
    >
      <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-border" />
    </ScrollAreaPrimitive.Scrollbar>
    <ScrollAreaPrimitive.Scrollbar
      className="flex select-none flex-row p-[1px] transition-colors group-hover:bg-border/30 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:h-2.5"
      orientation="horizontal"
    >
      <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-border" />
    </ScrollAreaPrimitive.Scrollbar>
    <ScrollAreaPrimitive.Corner className="h-2.5 w-2.5 bg-background" />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

export { ScrollArea };
