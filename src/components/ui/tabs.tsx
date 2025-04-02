import { cn } from "@/lib/utils"
import { Button } from "./button"

interface TabsProps {
  tabs: { value: string; label: string }[]
  activeTab: string
  onTabChange: (value: string) => void
  className?: string
}

export const Tabs = ({ tabs, activeTab, onTabChange, className }: TabsProps) => (
  <div className={cn("flex overflow-hidden bg-gray-100", className)}>
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