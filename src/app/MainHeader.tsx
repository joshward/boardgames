import Image from "next/image";
import { HeaderActions } from "@/app/HeaderActions";
import TextLogo from "@/components/TextLogo";

export function MainHeader() {
  return (
    <header className="flex items-center justify-between gap-6 p-4 md:p-6">
      <div className="flex grow items-center gap-4 md:gap-6">
        <Image
          src="/game.svg"
          alt="Board game logo"
          width="60"
          height="60"
          className="size-[30px] animate-[wiggle_0.5s_ease-in-out_3s_2] md:size-[60px]"
          priority
        />
        <h1 className="text-slate-12 grow">
          <TextLogo className="text-slate-12 h-auto w-full max-w-[200px] md:w-[400px] md:max-w-none" />
        </h1>
      </div>
      <HeaderActions />
    </header>
  );
}
