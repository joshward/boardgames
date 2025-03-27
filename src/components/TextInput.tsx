import {
  ComponentPropsWithoutRef,
  ReactNode,
  RefObject,
  useRef,
  MouseEvent,
} from "react";
import { twJoin, twMerge } from "tailwind-merge";
import {
  DefaultTransitionStyles,
  FocusResetStyles,
  ShowFocusOnKeyboardStyles,
  ShowFocusWithinStyles,
} from "@/styles/common";

interface DecoratorProps {
  value: ReactNode;
  onClick?: (e: MouseEvent) => void;
}

type TextInputProps = Omit<ComponentPropsWithoutRef<"input">, "type"> & {
  pre?: DecoratorProps;
  post?: DecoratorProps;
  ref?: RefObject<HTMLInputElement>;
};

function Decorator({ value, onClick }: DecoratorProps) {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={twJoin(
          DefaultTransitionStyles,
          FocusResetStyles,
          ShowFocusOnKeyboardStyles,
          "flex items-center self-stretch rounded px-3",
        )}
      >
        {value}
      </button>
    );
  }

  return (
    <div className="flex items-center self-stretch rounded px-3">{value}</div>
  );
}

export default function TextInput({
  className,
  pre,
  post,
  ref,
  ...props
}: TextInputProps) {
  const internalRef = useRef<HTMLInputElement>(null);
  const inputRef = ref || internalRef;

  return (
    <div
      className={twMerge(
        ShowFocusWithinStyles,
        DefaultTransitionStyles,
        "bg-sage-1 hover:bg-sage-2 focus:bg-sage-3 text-slate-12 rounded",
        "flex flex-row items-center",
        !pre && "pl-2",
        !post && "pr-2",
        className,
      )}
      onClick={() => inputRef?.current?.focus()}
    >
      {pre && <Decorator {...pre} />}
      <input
        type="text"
        ref={inputRef}
        {...props}
        className={twJoin(FocusResetStyles, "grow py-2")}
      />
      {post && <Decorator {...post} />}
    </div>
  );
}
