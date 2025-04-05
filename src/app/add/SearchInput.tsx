import { useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  UpdateIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";
import TextInput from "@/components/TextInput";

interface SearchInputProps {
  onSearch: (term: string) => void;
  isSearching?: boolean;
  initialTerm?: string;
}

export default function SearchInput({
  onSearch,
  isSearching,
  initialTerm,
}: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState(initialTerm ?? "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timeout);
  }, [onSearch, searchTerm]);

  return (
    <div>
      <TextInput
        pre={{
          value: isSearching ? (
            <UpdateIcon
              className="animate-spin"
              aria-label="Search Loading..."
            />
          ) : (
            <MagnifyingGlassIcon aria-label="Search Entry" />
          ),
        }}
        post={
          searchTerm
            ? {
                value: (
                  <Cross1Icon
                    className="text-ruby-10"
                    aria-label="Clear Search"
                  />
                ),
                onClick: () => {
                  setSearchTerm("");
                },
              }
            : undefined
        }
        value={searchTerm}
        className="w-full"
        autoFocus
        placeholder="Enter search term"
        onInput={(e) => setSearchTerm(e.currentTarget.value)}
      />
    </div>
  );
}
