import TextInput from "@/components/TextInput";
import { useEffect, useState } from "react";

interface SearchInputProps {
  onSearch: (term: string) => void;
}

export default function SearchInput({ onSearch }: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timeout);
  }, [onSearch, searchTerm]);

  return (
    <div>
      <TextInput
        value={searchTerm}
        className="w-full"
        autoFocus
        placeholder="Enter search term"
        onInput={(e) => setSearchTerm(e.currentTarget.value)}
      />
    </div>
  );
}
