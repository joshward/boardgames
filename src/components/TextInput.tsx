import { ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";
import { DefaultTransitionStyles, FocusStyles } from "@/styles/common";

type TextInputProps = Omit<ComponentPropsWithRef<"input">, "type">;

export default function TextInput({ className, ...props }: TextInputProps) {
  return (
    <input
      type="text"
      className={twMerge(
        FocusStyles,
        DefaultTransitionStyles,
        "bg-sage-1 hover:bg-sage-2 focus:bg-sage-3 text-slate-12 rounded p-2",
        className,
      )}
      {...props}
    />
  );
}
