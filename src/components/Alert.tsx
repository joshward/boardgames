import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface AlertProps {
  type: "Danger" | "Warning";
  children?: ReactNode;
  icon?: ReactNode;
  title: ReactNode;
  className?: string;
}

const DefaultIcons = {
  Danger: <ExclamationTriangleIcon className="size-5" />,
  Warning: <ExclamationTriangleIcon className="size-5" />,
} as const;

export default function Alert({
  type,
  title,
  className,
  children,
  icon,
}: AlertProps) {
  return (
    <div
      className={twMerge(
        type === "Danger" && "bg-ruby-10 text-ruby-1",
        type === "Warning" && "bg-orange-10 text-orange-1",
        "flex flex-row items-center gap-4 rounded p-4",
        className,
      )}
    >
      {icon || DefaultIcons[type]}
      <div className="flex flex-col gap-4 md:flex-row md:items-baseline">
        <h4 className="text-xl font-bold">{title}</h4>
        {children && <div>{children}</div>}
      </div>
    </div>
  );
}
