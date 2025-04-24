import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "./button"

const tabsVariants = cva(
  "flex overflow-hidden bg-gray-100",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface TabsProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof tabsVariants> {
  tabs: { value: string; label: string }[]
  activeTab: string
  onTabChange: (value: string) => void
}

export const Tabs = ({
  tabs,
  activeTab,
  onTabChange,
  className,
  variant,
}: TabsProps) => (
  <div className={cn(tabsVariants({ variant, className }))}>
    {tabs.map((tab) => (
      <Button
        key={tab.value}
        variant="tab"
        className="flex-1 mx-1 my-1"
        data-state={activeTab === tab.value ? "active" : "inactive"}
        onClick={() => onTabChange(tab.value)}
      >
        {tab.label}
      </Button>
    ))}
  </div>
)

export { tabsVariants }