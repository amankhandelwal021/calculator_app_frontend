"use client";
import Calculator from "@/components/Calculator";
import History from "@/components/History";
import { useState } from "react";

interface History {
  id: string;
  calculationName: string;
  calculationPattern: string;
  result: string;
}

export default function Home() {

  const [result, setResult] = useState('');
  const [history, setHistory] = useState<any>([]);

  return (
    <main className="bg-white h-screen overflow-scroll md:space-y-0 space-y-16 lg:flex lg:space-x-20 md:px -10 p-5 items-start justify-start">
      <Calculator result={result} setResult={setResult} setHistory={setHistory}/>
      <History setResult={setResult} history={history} setHistory={setHistory} />
    </main>
  );
}
