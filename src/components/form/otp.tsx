"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { OTPInput, SlotProps } from "input-otp";
import { MinusIcon } from "lucide-react";
import { useId } from "react";

interface OTPProps {
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
  containerClassName?: string;
  showLabel?: boolean;
  labelText?: string;
}

export default function OTP({
  value = "",
  onChange = () => {},
  maxLength = 6,
  containerClassName = "flex items-center gap-3 has-disabled:opacity-50",
  showLabel = false,
  labelText = "OTP input double"
}: OTPProps) {
  const id = useId();
  return (
    <div className="*:not-first:mt-2">
      {showLabel && <Label htmlFor={id}>{labelText}</Label>}
      {/* TODO Make the slots clickable */}
      {/* TODO Make the slots numbers only */}
      <OTPInput
        id={id}
        containerClassName={containerClassName}
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        render={({ slots }) => (
          <>
            <div className="flex gap-1 ">
              {slots.slice(0, 3).map((slot, idx) => (
                <Slot key={idx} {...slot} />
              ))}
            </div>

            <div className="text-muted-foreground/80 flex items-center justify-center">
              <MinusIcon size={16} aria-hidden="true" />
            </div>

            <div className="flex gap-1">
              {slots.slice(3, 6).map((slot, idx) => (
                <Slot key={idx} {...slot} />
              ))}
            </div>
          </>
        )}
      />
    </div>
  );
}

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "border text-center w-10 h-[46px] text-xl bg-background relative flex items-center justify-center font-medium transition-[color,box-shadow]",
        { "border-black z-10 border-[1.5px] outline-none": props.isActive },
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
    </div>
  );
}
