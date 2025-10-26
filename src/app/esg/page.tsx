"use client"

import { Footer } from "@/components/common/footer";
import { Header } from "@/components/common/navbar";
import EsgDashboardPage from "@/components/esg_dashboard/dashboard";

export default function EsgDashboard() {

  return (
    <>
      <Header/>
      <EsgDashboardPage/>
      <Footer/>
    </>
  );
}