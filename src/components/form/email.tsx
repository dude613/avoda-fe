import { Input } from "@/components/ui/input";
import { MailIcon } from "lucide-react";
import { useId } from "react";

interface EmailProps {
  value?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Email({ value, disabled, onChange }: EmailProps) {
  const id = useId();
  return (
    <div className="*:not-first:mt-2">
      <div className="relative">
        <Input 
          id={id} 
          className="peer pe-9" 
          placeholder="Email" 
          type="email" 
          value={value} 
          disabled={disabled}
          onChange={onChange}
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
          <MailIcon size={16} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
