"use client";

import { Footer } from "@/components/common/footer";
import { Header } from "@/components/common/navbar";
import Rooftop from "@/components/rooftop/roof";

declare global {
  interface Window {
    google: typeof google;
  }
}

export default function RooftopPage() {

  return (
   <>
    <Header/>
    <Rooftop/>
    <Footer/>
   </>
  );
}
