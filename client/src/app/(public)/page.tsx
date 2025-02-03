"use client";

import { Calendar } from "@/components/Calendar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <div className="py-8 w-4/5 mx-auto">
        <Calendar />
      </div>
      <Footer />
    </main>
  );
}
