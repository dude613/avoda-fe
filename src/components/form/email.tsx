import { Input } from "@/components/ui/input";
import { MailIcon } from "lucide-react";
import { useId } from "react";
import ErrorMessage from "../ErrorMessage";


interface EmailProps {
  value?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export default function Email({ value, disabled, onChange, error }: EmailProps) {
  const id = useId();
  return (
    <div className="group relative">
      <label htmlFor={id} className="origin-start text-muted-foreground/70 group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium">
        Email
      </label>
      <div>
        <Input
          id={id}
          className="pe-9"
          type="email"
          value={value}
          disabled={disabled}
          onChange={onChange}
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
          <MailIcon size={16} aria-hidden="true" />
        </div>
      </div>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
