// ui/form-divider.tsx
export const FormDivider = ({ text }: { text: string }) => (
    <div className="flex items-center my-4">
      <hr className="flex-grow border border-border" />
      <span className="mx-2 text-primary text-xs">{text}</span>
      <hr className="flex-grow border border-border" />
    </div>
  )