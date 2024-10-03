'use client';

import { useState } from "react";
import RadioList from "./components/RadioList";
import RadioSearchBar from "./components/RadioSearchBar";


export default function Home() {

  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <h1>Radio Browser</h1>
      <RadioSearchBar onSearch={handleSearch} />
      <RadioList searchTerm={searchTerm} />
    </div>
  );
}