"use client";

import { Calendar } from "@/components/Calendar";
import Spinner from "@/components/Spinner";
import { LoadingContext } from "@/contexts/LoadingContext";
import { useContext } from "react";

export default function Home() {
  const { isLoading } = useContext(LoadingContext);

  return (
    <main>
      {isLoading && (
        <div className="fixed bg-[rgba(0,0,0,0.5)] w-full h-full flex justify-center items-center z-20">
          <Spinner size="large" />
        </div>
      )}
      <div className="py-8 w-4/5 mx-auto">
        <Calendar />
      </div>
    </main>
  );
}
