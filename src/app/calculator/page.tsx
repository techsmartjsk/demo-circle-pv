"use client"

import SolarPanelCalculator from "@/components/calculator/calc";
import { Footer } from "@/components/common/footer";
import { Header } from "@/components/common/navbar";

export default function Calc() {

  return (
    <>
      <Header/>
      <SolarPanelCalculator/>
      <Footer/>
    </>
  );
}