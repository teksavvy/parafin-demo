"use client";
import { useContext } from "react";
import Topbar from "@/components/grubdash/Topbar";
import CapitalTab from "@/components/capital/CapitalTab";
import { PageHeader } from "@/components/grubdash/Card";
import MobileMenuContext from "../MobileMenuContext";

export default function Page() {
  const { open } = useContext(MobileMenuContext);
  return (
    <>
      <Topbar title="Capital" onMenuClick={open} />
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
        <PageHeader title="Capital" subtitle="Access flexible financing powered by Parafin" />
        <CapitalTab />
      </div>
    </>
  );
}
