import * as React from "react";
import { Link, LinkProps } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

type NavigationLinkProps = React.PropsWithChildren<
  LinkProps &
    React.HTMLAttributes<HTMLAnchorElement> & {
      variant?: "link" | "ghost" | "outline";
      size?: "default" | "sm" | "lg" | "icon";
      underline?: boolean;
    }
>;

const NavigationLink = ({
  className,
  variant = "link",
  size = "sm",
  underline = false,
  children,
  ...props
}: NavigationLinkProps) => (
  <Link
    className={cn(
      buttonVariants({
        variant,
        size,
        className: cn(
          "hover:text-primary/90",
          underline && "hover:underline underline-offset-4",
          className
        ),
      })
    )}
    {...props}
  >
    {children}
  </Link>
);

export { NavigationLink };
