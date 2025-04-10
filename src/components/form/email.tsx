import { Input } from "@/components/ui/input";
import { MailIcon } from "lucide-react";
import { useId } from "react";
import ErrorMessage from "./ErrorMessage";

interface EmailProps {
  value?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export default function Email({ value, disabled, onChange, error }: EmailProps) {
  const id = useId();
  return (
    <div className="relative">
      <Input
        id={id}
        className={`h-10 w-full pr-9 ${error ? 'border-destructive' : ''}`}
        type="email"
        value={value}
        disabled={disabled}
        onChange={onChange}
        placeholder="Enter email"
      />
      <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
        <MailIcon size={16} aria-hidden="true" />
      </div>
      {error && <div className="absolute -bottom-5 left-0"><ErrorMessage message={error} /></div>}
    </div>
  );
}
